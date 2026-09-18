# Authoring cards

Each card is a raw unified diff plus a metadata entry. The two are linked by numeric ID.

## Files

- Diffs live here as `{id}.diff` — `1.diff`, `2.diff`, `3.diff`, and so on, sequential, one per card.
- Each `{id}.diff` must have a matching entry `CARDS[id]` in `src/cards.js`, and `CARD_COUNT` in that file must equal the highest ID in use.
- A `.diff` file holds **raw unified diff text** — literally the output of `git diff`. No JSON wrapping, no escaping, no markdown fences.

## Writing the diff itself

The easiest way to get a valid, realistic diff:

1. Create two real files on disk (or two versions of the same file) that show the change you want to test.
2. Run `git diff` (or `git diff --no-index old.js new.js`) and paste the raw output into `{id}.diff`.

Keep it short — ideally a single hunk, roughly 5–40 lines. It needs to be readable on a phone screen without scrolling forever. If the real change is bigger, trim it down to the smallest diff that still contains the full flaw (or the full reasoning, for a merge card).

Requirements for a valid diff file:

- A standard `diff --git a/... b/...` header, `--- a/...` / `+++ b/...` lines, and at least one valid `@@ -start,count +start,count @@` hunk header. The line counts in the hunk header must match the number of context/removed and context/added lines that follow it.
- Line prefixes inside the hunk: `+` for an added line, `-` for a removed line, a single leading space for an unchanged context line. Every line in the hunk body needs one of these three prefixes.
- Include a little surrounding context (a few unchanged lines before/after the change) so the diff reads fairly — enough to see where the change sits, not just the bare `+`/`-` lines.

## The flaw (or the fix) must be visible in the diff

For a **reject** card, the bug must be spottable from the lines actually shown in the diff — don't rely on some other file the player can't see. If the reasoning depends on surrounding context (e.g. "this handler runs on every request" or "the caller already validated X"), put that in the `context` field of the metadata, not in a file that isn't rendered.

For a **merge** card, the diff should be a genuinely clean, correct change — not a trick. The explanation should confirm why it's safe, not merely absence of an obvious bug.

## Metadata (`src/cards.js`)

```js
export const CARDS = {
  1: {
    id: 1,
    answer: 'reject',            // 'merge' | 'reject'
    context: 'Returns an order by ID. User is authenticated.',
    explanation: 'No ownership check — any logged-in user can read any order (IDOR). Fix: verify order.UserID === session.UserID before returning.',
    language: 'go',              // 'react' | 'vue' | 'angular' | 'go' | 'node' | 'python' | 'csharp' | 'graphql' | 'rest' | 'auth'
    category: 'auth',            // free-form tag, e.g. 'auth', 'performance', 'correctness'
    difficulty: 3,               // 1 (easy) to 5 (hard)
  },
  // ...
};

export const CARD_COUNT = 6; // bump this whenever a new card is added
```

- `context`: one short, muted line shown above the diff. Give only what's needed to judge the change fairly — who's calling it, what runs before/after, scale, etc.
- `explanation`: shown after the player answers, for **every** card regardless of outcome. For a `reject` card, name the specific flaw and the fix. For a `merge` card, say why the change is safe/correct — the game should sometimes reward "Merge," not just "Reject."

## Annotated example

`public/cards/1.diff`:

```diff
diff --git a/internal/handlers/order.go b/internal/handlers/order.go
index 4f3c9d2..a91e7c1 100644
--- a/internal/handlers/order.go
+++ b/internal/handlers/order.go
@@ -8,3 +8,20 @@ func NewOrderHandler(db *sql.DB) *OrderHandler {
 func NewOrderHandler(db *sql.DB) *OrderHandler {
 	return &OrderHandler{db: db}
 }
+
+func (h *OrderHandler) GetOrder(w http.ResponseWriter, r *http.Request) {
+	session, ok := auth.FromContext(r.Context())
+	if !ok {
+		http.Error(w, "unauthorized", http.StatusUnauthorized)
+		return
+	}
+
+	orderID := chi.URLParam(r, "id")
+	order, err := h.db.FindOrderByID(r.Context(), orderID)
+	if err != nil {
+		http.Error(w, "order not found", http.StatusNotFound)
+		return
+	}
+
+	json.NewEncoder(w).Encode(order)
+}
```

Matching `src/cards.js` entry:

```js
1: {
  id: 1,
  answer: 'reject',
  context: 'New endpoint to fetch a single order by ID. `session` is the authenticated user from the request context; the returned order has a `UserID` field.',
  explanation: 'No ownership check — any logged-in user can read any other user\'s order just by changing the ID in the URL (IDOR). Fix: after loading the order, compare order.UserID against session.UserID and return 403 on mismatch before encoding the response.',
  language: 'go',
  category: 'auth',
  difficulty: 3,
},
```

The flaw (missing ownership check) is fully visible in the `+` lines — no outside knowledge required beyond what `context` states.
