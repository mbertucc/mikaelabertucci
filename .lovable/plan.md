
# Add Grain Texture to Dark Mode

## Current State
The light mode has a grain/noise texture overlay via `body::before` at `opacity: 0.02`. This same overlay applies in dark mode but is invisible because the SVG noise filter renders as dark noise on a dark background.

## Fix
Update the `body::before` grain overlay in `src/index.css` to adjust for dark mode:

- Add a `.dark body::before` rule that increases opacity to `0.03` (slightly more visible since dark backgrounds absorb more) and applies an `invert(1)` filter so the noise renders as light speckles on the dark surface.

**File: `src/index.css`** -- append after the existing `body::before` block (after line 169):

```css
.dark body::before {
  opacity: 0.03;
  filter: invert(1);
}
```

This is a 3-line addition. The `invert(1)` flips the dark noise pattern to light, making it visible against the dark background. The slightly higher opacity (0.03 vs 0.02) compensates for the lower perceived contrast on dark surfaces while keeping it subtle and organic.
