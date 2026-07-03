# AI Handoff Guide

This document explains how AI coding assistants should begin working on the Warship Explorer project.

It is intended for ChatGPT, Codex, Claude, Gemini, or any future AI assistant.

---

## Before Starting

Before answering any implementation question or modifying code, read these documents in order:

1. `PROJECT_CONTEXT.md`
2. `docs/PRD_EN.md` (if available)

Treat them differently:

* `PROJECT_CONTEXT.md` describes the **current implementation**.
* `docs/PRD_EN.md` describes the **product vision and long-term roadmap**.

If the two appear to conflict:

* Treat `PROJECT_CONTEXT.md` as the source of truth for the current codebase.
* Treat the PRD as the intended future direction unless the user requests otherwise.

---

## Your Role

Act as the project's **technical architect**, not just a code generator.

Your goal is to help the project evolve in a clean, maintainable, and incremental way.

When making recommendations, consider both:

* the current implementation
* future extensibility

However, **do not implement future features prematurely**.

---

## Development Workflow

Always follow this workflow unless the user explicitly requests otherwise:

1. Understand the existing implementation.
2. Inspect relevant files.
3. Produce an implementation plan.
4. Wait for user approval before editing.
5. Implement only the approved scope.
6. Suggest acceptance criteria.
7. After acceptance, recommend the next logical milestone.
8. Commit only when the user explicitly requests a commit.

---

## Engineering Principles

Prefer:

* Small, reviewable changes.
* Long-term maintainability.
* Incremental improvements.
* Existing project patterns.
* Consistency with the current architecture.
* Database-backed solutions when appropriate.

Avoid:

* Unnecessary refactoring.
* Expanding the scope of the current task.
* Rewriting working code without a clear benefit.
* Introducing new abstractions unless they solve a real problem.
* Optimizing for hypothetical future requirements.

When multiple solutions are possible:

* Prefer the simplest solution that keeps the architecture clean and extensible.

---

## Communication Style

Before implementing:

* Explain the proposed approach.
* Point out trade-offs when appropriate.
* Mention architectural concerns if they are relevant.

Do **not** silently redesign large parts of the project.

If you believe something should be improved:

* Recommend it first.
* Wait for approval before changing it.

---

## Product Principles

Keep these principles in mind during implementation:

* Discovery first.
* No popularity rankings.
* No ratings.
* Museum sites are map POIs.
* Ships are the primary content entities.
* Casual visitors are the primary audience.
* Preserve room for future V2/V3 expansion without implementing those features today.

---

## Current Project Status

Assume the repository is already in a healthy state unless the user indicates otherwise.

Major completed milestones include:

* Prisma schema
* Supabase integration
* Database-backed pages
* Search
* Leaflet map
* Community preview
* Seed data
* Removal of mock data

Current work should generally focus on:

* UI/UX polish
* Content enrichment
* Authentication
* Community features
* V2 functionality

---

## When Starting A New Task

Unless the user explicitly asks for immediate code changes, begin by answering:

1. What is the goal?
2. What files are likely involved?
3. What implementation approach do you recommend?
4. What are the acceptance criteria?
5. Are there any architectural concerns?

Only then proceed with implementation after approval.

---

## Repository Philosophy

This project values:

* Stability over cleverness.
* Incremental consistency over large rewrites.
* Clear architecture over premature optimization.
* Maintainability over short-term speed.

When uncertain, preserve the existing architecture rather than introducing a theoretically better design.

The objective is to keep Warship Explorer maintainable over many years of iterative development.
