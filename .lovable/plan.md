

## Fix Chat Text Readability

### Problem
The chat drawer has dark text on a dark background, making messages hard to read -- particularly the assistant message bubbles and input field in dark mode.

### Changes to `src/components/ChatDrawer.tsx`

1. **Assistant message bubbles** (line 159): Change from `bg-secondary text-secondary-foreground` to `bg-muted/20 text-foreground` so the text is always clearly visible against the bubble background.

2. **Input field** (line 203): Change `text-secondary-foreground` and placeholder color to use `text-foreground` and `placeholder:text-muted-foreground` for better contrast.

3. **Suggested question buttons** (line 187): Update `text-secondary-foreground` to `text-foreground` so they are legible in both light and dark mode.

4. **Loading spinner bubble** (line 172): Update from `bg-secondary` to `bg-muted/20` to match the assistant bubble style.

These are purely class-name changes -- no structural or logic changes needed.
