# Chat Startup Checklist

This checklist is for starting a new AI conversation on the Warship Explorer project.

The goal is to quickly determine whether the AI has correctly understood the project before beginning implementation.

---

# Ready-to-Use Chat Prompt

Copy the following prompt into a new AI conversation after uploading the project documents.

```
We're continuing development of my long-term project, Warship Explorer.

Please read AI_HANDOFF.md and PROJECT_CONTEXT.md first.

If the task involves product direction or future planning, also read docs/PRD_EN.md.

Do not begin implementation yet.

First, summarize your understanding of the project.

Please answer these questions briefly:

1. What is the current development phase?

2. What major milestones have already been completed?

3. What do you recommend as the next development milestone?

4. What architectural rules should never be violated?

5. How should we work together on future tasks?

6. If you were taking over this project as the lead engineer today, what development strategy would you recommend for the next few milestones?

7. Do you disagree with any current architectural decisions? If yes, explain why. If no, explain why the current architecture is appropriate.

8. Did you notice any inconsistencies, missing information, or documentation that should be updated before future development?

Keep the response concise (about one page). Do not simply summarize the documents. Demonstrate that you understand the current implementation, architecture, and roadmap.

If everything is clear, we will continue development using the workflow:

Plan → Review → Implement → Verify → Accept → Commit
```

---

## Step 1 — Provide Context

At the beginning of a new conversation:

1. Upload `AI_HANDOFF.md`.
2. Upload `PROJECT_CONTEXT.md`.
3. Upload `docs/PRD_EN.md` if the task involves product direction or future planning.
4. Ask the AI to read the documents before answering.

Suggested prompt:

> Please read AI_HANDOFF.md and PROJECT_CONTEXT.md first.
>
> If needed, also read docs/PRD_EN.md.
>
> Do not begin implementation yet.
>
> First, summarize your understanding of the project.

---

## Step 2 — Verify Understanding

Ask the AI to answer the following questions.

Keep the response concise.

### Project Status

1. What is the current development phase?

2. What major milestones have already been completed?

3. What do you believe should be the next milestone?

---

### Architecture

4. What architectural rules should never be violated?

Examples include:

* Prisma server-side only
* Client Components never import Prisma
* Search uses API routes
* Museum sites are map markers
* Ships belong to museum sites

---

### Workflow

5. Describe the expected development workflow.

The answer should roughly match:

Plan → Review → Implement → Verify → Accept → Commit

---

### Understanding

6. If you were taking over this project as the lead engineer today, what development strategy would you recommend for the next few milestones?

This question measures understanding rather than memorization.

---

### Architecture Review

7. Do you disagree with any current architectural decisions?

If yes:

* explain why

If no:

* explain why the current architecture is appropriate

---

### Documentation Review

8. Did you notice any inconsistencies, missing information, or documentation that should be updated before future development?

The AI should point out problems rather than silently making assumptions.

---

## Step 3 — Decide Whether To Continue

If the answers correctly describe:

* the current implementation,
* architecture,
* workflow,
* and roadmap,

then continue development.

If the answers indicate misunderstandings, clarify them before any implementation begins.

---

## Step 4 — Start Development

Only after the AI demonstrates sufficient understanding should implementation begin.

From this point forward, follow the standard workflow:

Plan → Review → Implement → Verify → Accept → Commit

---

## Notes

Do not require the AI to repeat the contents of PROJECT_CONTEXT.md.

The purpose of these questions is to verify understanding, not memory.

A good AI should demonstrate reasoning about the project rather than simply summarizing the documents.
