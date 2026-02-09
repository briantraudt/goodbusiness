

## Fix: Remove Gap Between Portfolio Card and Navigation Arrows

**Problem**: The card itself has large internal bottom padding (`p-8 md:p-12`), creating a big empty space between the tags and the card's bottom edge. Then the navigation arrows sit below that. The `mt-1` on the nav container is already minimal -- the real culprit is the card's generous bottom padding.

**Solution**: Replace the uniform padding with separate top/bottom values so the bottom of the card is tighter against the content, bringing the arrows much closer.

### Technical Change

**File: `src/components/home/Portfolio.tsx`**

Change the card's padding from:
```
p-8 md:p-12
```
to:
```
px-8 pt-8 pb-4 md:px-12 md:pt-12 md:pb-5
```

This keeps the top and side padding generous while drastically reducing the bottom padding, closing the visual gap between the card content and the navigation arrows below.

