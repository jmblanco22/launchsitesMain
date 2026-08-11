# StudySpark: Building an AI-Generated Learning Platform

*A project report on what it takes to make a large language model reliably teach.*

---

> **Note on placeholders:** Anywhere you see `[INSERT ...]`, that's a spot for you to drop in a code sample, a screenshot, or a diagram. I've written a description of exactly what goes there. Code blocks that are already filled in are pulled from the real project — verify them against your current files before submitting, since a few may have drifted.

---

## 1. Introduction

*Audience: everyone. Job: introduce the project to a reader who has never seen it, and hook them with the central realization.*

StudySpark is a mobile-first web app that turns any topic into a personalized course. You type what you want to learn — "basic derivatives," "how to swing a golf club," "who was Nikola Tesla" — and StudySpark generates a roadmap of ordered modules, writes a micro-lecture for every submodule, quizzes you on what you just read, and tracks your progress against other learners on a leaderboard. Every piece of educational content is generated on demand by a large language model.

The project began as user research, not code. My team interviewed six undergraduates about how they study, and the same thing kept surfacing: it's not that students don't want to learn — it's that studying feels like one big, overwhelming, ambiguous task. Four findings shaped everything that followed: big tasks kill motivation, learning feels passive, visible progress builds momentum, and structure affects retention. StudySpark is an attempt to answer each of those with a feature.

When I started building, I thought the AI part was simple. You want the model to teach something, so you write a good prompt asking it to teach that thing. Prompt in, lecture out. I spent the first weeks learning how wrong that is.

Reliably generating educational content from an LLM is almost never a single prompt. It's *multiple* prompts. It's deciding what order those prompts run in, and what information each one is allowed to see. It's choosing what to make explicit versus what to leave for the model to infer. And sometimes it's not even a prompt at all — sometimes you have to invent a little intermediate syntax that hands off from the LLM to an ordinary, non-AI search. The interesting work of building an AI product turned out to live in the *architecture around* the prompts, far more than in the wording of any one of them.

This report is about that architecture. It covers how StudySpark actually generates a micro-lecture, the specific things I got wrong and how I fixed them, and the general principles I'd hand to anyone building something similar.

---

## 2. The Tech Stack

*Audience: process managers deciding what to build with, and coders who want to reproduce it. Job: document every moving piece and why it's there.*

| Layer | Choice | Why it's here |
|---|---|---|
| Framework | **Next.js 16** (App Router, TypeScript) | API routes and pages in one codebase; server-side rendering for the parts that need it |
| Database & Auth | **Supabase** (Postgres + magic-link auth) | Row-level security out of the box, so a user can only ever read their own data |
| LLM gateway | **OpenRouter** → DeepSeek V4 Flash | One API key for many models; you swap models by changing a single string |
| AI SDK | **Vercel AI SDK** (`generateObject`, `generateText`) | Structured-output enforcement — this is load-bearing, see §4 |
| Validation | **Zod** | Defines the exact shape the model must return, and validates it |
| Images | **Unsplash API** | Free stock photos, fetched server-side |
| Math & tables | **remark-math + rehype-katex + KaTeX**, **remark-gfm** | Renders LaTeX formulas and markdown tables inside lectures |
| Hosting | **Vercel** | Auto-deploys on every push to `main` |

Two stack choices are worth flagging for a process reader, because they weren't obvious going in.

First, **all AI runs server-side, in API routes, never in the browser.** This isn't a performance decision — it's a secrets decision. The API key that pays for model calls can never touch the client, or anyone could read it and spend your money. Every generation route lives behind the server boundary.

Second, **the model provider is deliberately abstracted behind OpenRouter.** DeepSeek V4 Flash is cheap and good enough for lectures, but the day it isn't, switching to a different model is a one-line change instead of a rewrite. If you're evaluating whether to build this way, that abstraction is the first thing worth looking up.

---

## 3. How StudySpark Generates a Micro-Lecture

*Audience: coders who want to implement this, and process managers who want to understand the shape of the pipeline. Job: show the actual mechanism — not that I did something clever, but how to do it.*

Generating a single micro-lecture is not one model call. It's a pipeline of three stages, and each stage's output constrains the next. The most important design decisions are about *where* in that pipeline each decision gets made.

**[INSERT DIAGRAM: The micro-lecture pipeline.** A left-to-right flowchart with three main boxes: (1) *Roadmap generation* — inputs "topic," outputs "modules → submodules, each tagged visual/not"; (2) *Lecture generation* — inputs the submodule + the visual flag, outputs "markdown with `[FIGURE: …]` placeholders"; (3) *Figure resolution* — inputs the placeholders, outputs "markdown with real image URLs." Draw a **dotted rectangle around each stage that happens inside a single LLM query context**, so the reader can see what the model sees in one shot versus what's passed forward between stages. Label the arrows between stages with the artifact that travels along them: "roadmap JSON," "lecture markdown + placeholders," "finished markdown." Boxes-and-arrows is fine; it does not need to be pretty.**]**

### Stage 1 — Roadmap generation, where scope and visual-ness are decided

The roadmap route takes the raw topic and returns a structured set of modules and submodules. Two judgments happen *here*, at the very start, that matter enormously downstream.

**Scope.** Early on, asking StudySpark "how do I do addition" produced a five-module curriculum, because my prompt always asked for three to five modules. The fix was to make the model assess scope *before* producing structure:

```
First, judge the scope of what the learner asked for, and size the roadmap to match:
- A narrow, simple, or single-skill request → 1-2 modules with a few submodules.
- A moderate topic → 2-3 modules.
- A broad subject → 4-5 modules.
Match the structure to what was actually asked. Never inflate a small question into a large roadmap.
```

**Visual-ness.** Each submodule gets tagged, right here, as visual or not — meaning "can this be literally photographed, or is it abstract?" This one boolean is what later lets me avoid asking for images on a calculus lecture (see §5.2). The instruction:

```
- Set "visual" to true ONLY if this submodule teaches something that can be literally
  photographed: a physical object, material, tool, place, or a person performing a
  hands-on activity.
- Set "visual" to false for anything conceptual, mathematical, theoretical, or symbolic.
  When in doubt, use false.
```

The whole output is forced into a strict shape by a Zod schema (the mechanism §4 is about):

```ts
const roadmapSchema = z.object({
  topic: z.string(),
  modules: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      submodules: z.array(
        z.object({
          title: z.string(),
          summary: z.string(),
          visual: z.boolean(),   // decided upstream, used downstream
        })
      ),
    })
  ),
})
```

### Stage 2 — Lecture generation, adapted and conditional

The lecture route generates the actual teaching text for one submodule. It does three things at once: it adapts depth to the learner, it only offers figures when the submodule was flagged visual, and it emits math as LaTeX.

The figures instruction is *conditional* — it's only added to the prompt when `visual` is true. A model that is never told figures exist cannot invent one:

```ts
const figuresBlock = sub.visual
  ? `
FIGURES:
Where a visual would genuinely help, insert a placeholder on its own line, exactly:
[FIGURE: search query | caption]
- The query must name the ACTUAL physical thing being taught — the real object, tool,
  material, or activity. Never a metaphor or symbolic stand-in.
- Include 1-3 figures, placed inline next to the text they illustrate.
- If you can't name a concrete photographable subject, omit the figure.`
  : ''
```

The rest of the prompt reads the learner's original request and adapts tone, and instructs the model to write math in LaTeX rather than backticks:

```ts
prompt: `Write a concise micro-lecture on "${sub.title}" within the module "${mod.title}".
Context: ${sub.summary}

The learner's original request was: "${roadmap.content.topic}".
Adapt the depth and tone to that request. If it signals a beginner, explain simply with
everyday language and concrete examples. If it signals an advanced learner, go deeper and
assume fundamentals are known. If there's no signal, aim for a motivated beginner.

Format as markdown: use ## subheadings and end with a ## Key Takeaway section.
Length: 300–500 words.${figuresBlock}
For any mathematical expressions, use LaTeX syntax: wrap inline math in single dollar
signs and standalone equations in double dollar signs. Do NOT use backticks.`
```

Notice what the model *emits* for a figure: not an image, but a piece of intermediate syntax — `[FIGURE: search query | caption]`. This is the hand-off point where the LLM stops and something ordinary takes over.

### Stage 3 — Figure resolution, where the LLM hands off to a plain search

The lecture is saved and returned with those `[FIGURE:…]` placeholders still in it. The text renders on the page *immediately*. Then, on the client, an effect finds every placeholder, resolves each into a real image in parallel, swaps it in, and re-caches the finished version so the next visit is instant:

```tsx
useEffect(() => {
  if (!lecture) return
  const figureRegex = /\[FIGURE:\s*([^|\]]+)\|\s*([^\]]+)\]/g
  const figures = [...lecture.content.matchAll(figureRegex)]
  if (figures.length === 0) return   // guard: after swapping, there are none left

  ;(async () => {
    const urls = await Promise.all(
      figures.map(async (f) => {
        try {
          const res = await fetch(`/api/image?query=${encodeURIComponent(f[1].trim())}`)
          const { url } = await res.json()
          return url as string | null
        } catch { return null }
      })
    )
    let updated = lecture.content
    figures.forEach((f, i) => {
      updated = updated.replace(f[0], urls[i] ? `![${f[2].trim()}](${urls[i]})` : '')
    })
    setLecture({ ...lecture, content: updated })
    // cache the finished version back
    fetch('/api/lecture/save-images', { method: 'PATCH', /* … */ })
  })()
}, [lecture?.content])
```

The `/api/image` route itself is a thin wrapper around Unsplash — the point is that **the "AI" figure feature is 80% a plain keyword search.** The model's only job was to decide *where* a figure belongs and *what to search for*; a non-LLM API does the actual fetching.

This staged design — text now, images later, finished version cached — is also what made lectures fast. Originally the route generated text, then waited on every image, then returned everything; you stared at a spinner through the whole thing. Splitting the slow part off and streaming it in behind the already-visible text hid the wait.

---

## 4. Structured Output: Prove It, Don't Describe It

*Audience: coders. Job: make the single most important reliability technique concrete.*

The foundational reliability decision in StudySpark is this: **never ask the model for a data shape and hope it complies — force the shape and validate it.** The Vercel AI SDK's `generateObject` plus a Zod schema does exactly that.

Here is why it matters, shown rather than told. Without enforcement, asking a model to "return JSON with these fields" gets you output like this — technically an *attempt*, but unusable:

**Invalid example 1** — wrapped in a markdown fence with commentary, so `JSON.parse` throws immediately:

```
[INSERT REAL CAPTURE — approximate shape below]
Sure! Here's a roadmap for you:
```json
{ "topic": "calculus", "modules": [ ... ] }
```
Let me know if you'd like me to expand any module!
```

**Invalid example 2** — valid JSON, but the wrong shape (a field renamed, a required field missing), so your code crashes three screens later when it reaches for `submodules`:

```
[INSERT REAL CAPTURE — approximate shape below]
{ "topic": "calculus", "sections": [ { "name": "Limits" } ] }
```

*(To capture real versions of these, temporarily swap `generateObject` for a plain `generateText` call asking for JSON, and log what comes back a few times. A couple of real failures make this section land.)*

Against that, here is the entire fix — one schema, handed to `generateObject`:

```ts
const { object } = await generateObject({
  model: openrouter.chat('deepseek/deepseek-v4-flash'),
  schema: roadmapSchema,   // the strict shape from §3
  prompt,
})
```

The model's response is now validated against `roadmapSchema` *before your code ever touches it*. If it's malformed, it fails loudly and immediately, at the boundary, instead of quietly poisoning something downstream. The quiz route uses the same technique with harder constraints — `.length(4)` forces exactly four questions with exactly four options each, so the UI can never receive a five-option quiz.

The takeaway for anyone building this: **if the problem is about format, solve it in code with a schema, not in the prompt with polite instructions.** Don't ask the model to be well-behaved. Make well-behaved the only shape it's allowed to return.

---

## 5. The Iterations: Where It Went Wrong

*Audience: process/project people looking to take mistakes off their own to-do list, and impressive people who want to see genuine iteration. Job: show real failure states and the reasoning that fixed them.*

Every hard problem in this project I first tried to fix by writing a better prompt. I mostly lost. The fixes that worked came from changing the structure around the prompt. Here are the four that taught me the most.

### 5.1 — The Mermaid detour (a feature I removed)

For procedural lectures I wanted diagrams, so I had the model emit Mermaid (a text diagram syntax) and rendered it. It produced *valid* Mermaid maybe one time in four. The rest of the time a stray character broke the parser and the page showed an error.

**[INSERT SCREENSHOT: a lecture showing "Syntax error in text" where a diagram should be.** You have this from testing; recreate it by feeding the renderer a slightly malformed Mermaid block if needed.**]**

I tightened the prompt, gave examples, restricted the syntax. The hit rate improved and stayed unreliable. Eventually I cut the feature. The lesson: **some things a model simply isn't reliable enough to do, and no prompt fixes that.** Knowing when to stop tuning and walk away is part of the skill — a feature that works 25% of the time in a live demo is worse than no feature.

### 5.2 — The metaphor problem (the one that taught me the most)

When I added images, physical topics worked great. Then I opened a calculus lecture on L'Hôpital's rule and got a photo of a **balance scale**. The model had reasoned: L'Hôpital's rule resolves *ambiguous* limits, and a balance scale symbolizes ambiguity. Technically photographable. Useless for teaching.

**[INSERT SCREENSHOT: the L'Hôpital's-rule lecture with the balance-scale image.]**

So I added a rule: no abstract concepts, only concrete objects. The next abstract lecture — "the slope of a tangent line" — returned a photo of a **grassy hillside**. A hill has a slope. New loophole.

**[INSERT SCREENSHOT: the tangent-line lecture with the hillside image.]**

I could feel what was happening: I was playing whack-a-mole against a model that *wanted* to illustrate and would always find one more clever substitution. Every rule I wrote, it routed around.

The fix wasn't a better rule — it was realizing I was fighting at the wrong layer. Instead of trying to *catch* bad images after the model decided to make one, I moved the decision **upstream**. Roadmap generation now flags each submodule visual-or-not (§3, Stage 1), and the lecture prompt only mentions figures at all when that flag is true. A model never told figures exist cannot invent a metaphorical one. The entire class of problem vanished.

**[INSERT DIAGRAM: policing the output vs. constraining the input.** Two rows. Top row (the broken approach): *Lecture prompt always mentions figures* → *model invents a metaphor* → *rule tries to catch it* → *loophole* — draw this as a loop that never closes. Bottom row (the fix): *Roadmap decides visual/not* → *lecture prompt only offers figures when visual=true* → *no metaphor possible* — a clean straight line. The visual point is that the decision moved to an earlier box.**]**

### 5.3 — Judge before it generates

The scope problem (§3) is the same shape as the metaphor problem, in miniature. "How do I do addition" became a five-module course because the model generated structure without first assessing how much structure the request deserved. The fix was to insert a *judgment step in front of the generation step* — assess scope, then build to fit — rather than correcting the output afterward. Put a prejudgment before generative material, and you stop a whole category of bad output before it starts.

### 5.4 — Fail invisibly on purpose

AI-generated content will sometimes be broken — a bad diagram, an image search that returns nothing. The question is what the user sees when it happens. My answer, everywhere, became: nothing. A Mermaid diagram that won't parse renders as empty space, not an error. An image search that finds no match drops the figure silently, leaving clean prose instead of a broken-image icon (that's the `urls[i] ? … : ''` branch in the §3 code). The failure still happens; it just isn't *visible*. In a live demo, "one fewer picture" is invisible. "A red error box on screen" is not.

**[INSERT DIAGRAM: evaluate-before-output.** A small pipeline: *generated content* → *validation check* → branch: valid → *show it*; invalid → *show nothing*. The point is that a validation component sits between generation and display, and the failure path leads to silence, not an error.**]**

---

## 6. Principles

*Audience: process people (as reusable rules) and impressive people (as evidence of crystallized thinking). Job: state the general lessons the specific failures add up to.*

Two of these I only found by writing the first draft of this document — they were implicit in the work but I couldn't have stated them cleanly before.

**Trust, but verify.** This old software maxim turns out to unify most of what I learned. *Trust* is §5.2: you can't police the output, so you design constraints into the input and then trust the model to work within them. *Verify* is §5.4: even when you've built the system to be trustworthy, it will sometimes fail, so you always validate the output and handle the failure. And the schema work in §4 sits exactly between the two — it's how you make an output you can trust *and* verify at the same moment.

**Test the pipeline.** Nearly every failure above is really the same story: I thought it would work, I tested it, it didn't, I adjusted, I tested again. The Mermaid detour was test-driven discovery that a feature was unreliable. Judge-before-generate came from testing at the extremes ("how do I do addition") and watching it break. Fail-invisibly came from testing enough to notice a failure case existed. The lesson isn't "write careful prompts" — it's "assume you're wrong about the model's behavior until you've tested the actual pipeline end to end."

**A triage for prompting problems.** When something's wrong with generated output, ask which kind of problem it is:
- A **format** problem (wrong shape, invalid structure) → fix it with a schema, not words.
- A **content** problem (right shape, wrong substance) → *this* is where prompt wording earns its keep.
- A **"the model keeps finding loopholes"** problem → stop writing rules and move the decision upstream, so the model is never offered the choice.

Most of my time went into that third category, and every time I wasted a day on rule-writing before remembering the fix lived somewhere else.

---

## 7. What I'd Do Differently

*Audience: process people. Job: hand them mistakes to skip.*

- **Deploy and test in the deployed environment from day one, not just locally.** Several of my worst hours came from a green local build that failed in production — usually a missing environment variable or a case where the strict production build (`npm run build`) caught something the lenient dev server let slide. `npm run dev` and `npm run build` are different tools; I should have been running the strict one before every push much earlier.
- **Decide the "visual or not" style question (constrain input vs. police output) before building the feature, not after three evenings of prompt-patching.** The pattern is general enough that I'd now look for it at the start.
- **Establish the design system before styling any screen.** I restyled several pages individually before formalizing color tokens, then had to redo them. Tokens first, screens second.

---

## 8. What's Next — StudySpark 2

*Audience: me, and anyone funding a next phase. Job: the concrete to-do list.*

If I had another three months:

- **File uploads.** Let a learner upload their own notes or a syllabus and generate a roadmap from *their* material rather than a topic string. This is the biggest lever on the original research goal.
- **An AI tutor chat inside every lecture** — "explain this with a real-world analogy" — for the moment the formula clicks but the intuition doesn't.
- **Step-level visual aids for procedural topics.** Right now a figure illustrates a submodule; the harder, more valuable version matches an image to each *step* of a process. Stock photos can't do this well, so it likely means restructuring lecture generation into explicit steps.
- **Friends-only leaderboards.** The current board is global; a real social graph (add friends, friend-scoped rankings) would sharpen the "am I studying more than my friends" motivation the research pointed to.
- **Harder reliability guarantees on generated content** — an automated acceptance check that grades each lecture/quiz against criteria before it's shown, rather than my current manual spot-checks.

---

*StudySpark was built solo over one summer, from a research prototype to a deployed, working product. The hardest and most transferable part was not writing prompts — it was learning to architect the system around them so the model could be trusted to teach.*
