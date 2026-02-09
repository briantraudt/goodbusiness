

## Remove Padding Below Timezone in Calendly Widget

**The problem**: The blank space below "Central Time" lives inside Calendly's iframe, which we cannot style directly. The fix is to shorten the container height so the overflow is clipped away.

**What changes**:
- In `src/components/home/ContactSection.tsx`, reduce the widget container height from `580px` to approximately `520px` (may need fine-tuning)
- The existing `overflow: hidden` on the container will clip the extra space

**Risk**: If the height is too aggressive, the timezone row itself could get cut off. We may need to iterate on the exact pixel value (e.g., 530px vs 520px).

### Technical Detail
- File: `src/components/home/ContactSection.tsx`
- Change: `height: '580px'` to `height: '520px'`
- The `overflow: hidden` and `[&_iframe]:overflow-hidden` classes already handle clipping

