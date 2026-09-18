# Authoring Cards

Each card is two files in a language folder: `{n}.diff` and `{n}.json`. The Vite build auto-discovers all cards — no index or count to maintain.

```
public/diffs/
  go/
    1.diff    1.json
    2.diff    2.json
  react/
    1.diff    1.json
    ...
```

URL format: `#go/3`, `#react/1`

## Adding a Card

1. Pick the language folder (or create a new one).
2. Name your files with the next available number: if `go/` has 1–10, add `11.diff` and `11.json`.
3. That's it — the build picks it up automatically.

## What Makes a Good Card

A good card teaches a pattern the player will recognize forever after. The best cards are built around bugs and anti-patterns that show up constantly in real codebases — the kind of thing where once you've been burned once, you spot it immediately in every future PR.

### The diff should feel real

- Write it like an actual PR — multiple added lines, realistic variable names, plausible file paths. Not a toy snippet, but a change someone would actually submit.
- 10–40 lines is the sweet spot. Enough context to read naturally, short enough to review in one screen.
- Include surrounding unchanged lines so the player sees where the change lives.

### The flaw should teach a transferable lesson

Good reject cards are built around patterns like:
- **Missing authorization/ownership checks** (IDOR, privilege escalation)
- **Blocking the event loop** (sync I/O in async contexts)
- **Stale closures / incorrect dependency arrays** in React hooks
- **N+1 queries** hidden behind clean-looking resolver code
- **Lost idempotency** when retry logic is stripped
- **Race conditions** in concurrent code
- **SQL injection** through string concatenation
- **Unchecked error returns** that silently swallow failures

The flaw should be the kind of thing a senior engineer catches in review — subtle enough to miss on a quick scan, obvious once pointed out. Avoid obscure language trivia.

### The answer should click

After revealing, the player should think "of course" — not "I guess." The explanation names the specific bug, why it matters in production, and the one-line fix.

### Merge cards must be genuinely correct

About 1 in 4 cards should be merge. These are clean, correct changes — not tricks. The explanation confirms why it's safe. This keeps players honest; always-reject is not a winning strategy.

### Fair play

The bug must be visible in the diff itself. Don't require knowledge of code not shown. If the reasoning depends on context the player can't see (scale, caller behavior, threading model), put that in the `context` field.

## The Diff File (`{n}.diff`)

Raw unified diff — the output of `git diff`. No JSON, no markdown fences.

Requirements:
- Standard `diff --git a/... b/...` header, `--- a/...` / `+++ b/...` lines, and `@@ hunk headers` with correct line counts.
- Line prefixes: `+` added, `-` removed, single leading space for context.
- Empty context lines need a single leading space character, not a truly blank line.

Easiest way to create one:
```sh
git diff --no-index before.ext after.ext > {n}.diff
```

## The Metadata File (`{n}.json`)

```json
{
  "id": 1,
  "answer": "reject",
  "context": "One line of context shown above the diff.",
  "explanation": "Shown after answering. Name the flaw, consequence, and fix.",
  "language": "go",
  "category": "auth",
  "difficulty": 3
}
```

- `id`: matches the file number.
- `answer`: `"merge"` or `"reject"`.
- `context`: shown above the diff. Give just enough to judge the change fairly. Don't give away the answer.
- `explanation`: shown after answering. For reject: name the flaw, real-world consequence, and fix. For merge: confirm why it's safe.
- `language`: must match the folder name. Determines syntax highlighting and the label badge.
- `category`: free-form tag (e.g. `auth`, `performance`, `correctness`, `security`, `concurrency`).
- `difficulty`: 1 (obvious once you know the pattern) to 5 (requires deep domain knowledge).

## Supported Languages

| Folder    | Label   | Syntax highlighting |
|-----------|---------|-------------------|
| `go`      | Go      | go                |
| `node`    | Node.js | javascript        |
| `react`   | React   | jsx               |
| `python`  | Python  | python            |
| `csharp`  | C#      | csharp            |
| `graphql` | GraphQL | graphql           |
| `ci`      | CI/CD   | yaml              |
| `javascript` | JavaScript | javascript   |
| `typescript` | TypeScript | typescript   |
| `rust`    | Rust    | rust              |
| `sql`     | SQL     | sql               |
| `ruby`    | Ruby    | ruby              |

To add a new language: create the folder, add cards, and register the refractor language in `DiffCard.jsx` + add the label in `src/cards.js`.
