---
name: figma-match-prototype
description: Convert or refine Figma Dev Mode/design links into code prototypes that visually match the source frame 1:1. Use when Codex is given a Figma dev link, Figma frame/node URL, screenshot, exported design, or existing prototype and is asked to implement, inspect, compare, tune, or pixel-match the UI in HTML/CSS/React or another frontend codebase.
---

# Figma Match Prototype

## Goal

Implement the referenced Figma frame as a working code prototype, then iteratively compare rendered screenshots against the design until layout, spacing, typography, color, imagery, and responsive behavior are as close as practical.

## Workflow

1. Capture the source of truth.
   - Open or inspect the Figma link with available Figma tools. If direct Figma access is unavailable, ask for an exported PNG or screenshot.
   - Identify the exact frame/node, target viewport size, interaction states, and whether the requested output is static, responsive, or interactive.
   - Export or screenshot the frame for visual comparison whenever possible.

2. Extract design facts before coding.
   - Record frame dimensions, grid/layout mode, major regions, component hierarchy, spacing, typography, color tokens, radii, borders, shadows, image assets, and icons.
   - Prefer exact values from Dev Mode or inspect APIs over estimating from screenshots.
   - Download or recreate assets only when needed for visual parity.

3. Build inside the existing codebase.
   - Follow the repo's framework, styling system, component conventions, and asset pipeline.
   - Match the Figma hierarchy with semantic, maintainable components. Avoid over-abstracting while the design is still being aligned.
   - Use exact dimensions, constraints, font families, weights, line heights, colors, border radii, shadows, and spacing from Figma when available.
   - If the Figma frame is a fixed desktop viewport, preserve the Figma look at that size while also adding responsive desktop safeguards for smaller laptop widths.
   - For icons, use existing icon libraries or exported SVGs. Do not approximate detailed brand or product artwork with CSS shapes.

4. Run and screenshot the prototype.
   - Start the local app if needed.
   - Use browser automation to capture screenshots at the Figma frame size and any requested breakpoints.
   - For fixed desktop Figma frames, also test common laptop widths such as 1440px, 1366px, and 1280px before delivery.
   - Keep screenshots and source exports named clearly, such as `figma-source.png` and `prototype-current.png`, in a temporary or task-local folder.

5. Compare and iterate.
   - Compare source and prototype visually first, then with pixel or image-diff tooling if useful.
   - Fix the largest visual differences before polishing small ones: layout geometry, then typography, then color/effects, then asset fidelity.
   - Repeat screenshot comparison after each meaningful pass.
   - Read `references/visual-qa.md` when preparing the final QA pass or when the match is still visibly off.

6. Deliver with evidence.
   - Summarize what was implemented, what was verified, and any known deviations from Figma.
   - Include the local URL when a dev server is running.
   - Mention screenshots/diff artifacts if they are useful for review.

## Matching Standards

- Treat the Figma frame as the visual contract, not merely inspiration.
- Preserve first-viewport composition, alignment, density, and scroll position.
- Text must fit its containers and match Figma wrapping. Do not silently substitute copy unless the user asks.
- Use real exported images for product, brand, avatar, photo, or illustration assets when possible.
- Match interactive states shown or implied by the design: hover, active, selected, disabled, focus, open menus, and empty/loading/error states.
- If the Figma design uses a font that is unavailable locally, use the closest installed or bundled alternative and report the substitution.

## Fixed Viewport Responsiveness

When a Figma frame is designed at a fixed desktop size, do not hard-code the prototype so tightly that it only works at that exact viewport. Keep the visual match at the source size, but add responsive desktop behavior so the screen remains usable on smaller laptop viewports.

- Support at least `1440px`, `1366px`, and `1280px` desktop/laptop widths unless the user specifies different breakpoints.
- Use an app shell pattern that prevents clipping: `h-screen overflow-hidden` on the shell, fixed/shrink header, `flex min-h-0` body, fixed sidebar where needed, and `flex-1 min-w-0 overflow-y-auto` for the main content.
- Add `min-w-0` to flex/grid children and `max-w-full` to large cards, widgets, tables, modals, and panels.
- Avoid viewport-breaking fixed widths. Prefer `minmax(0, 1fr)`, `clamp()`, percentages, proportional grid columns, and breakpoint-specific compact spacing.
- Prevent page-level horizontal scrolling. If a grid or table truly cannot fit, contain horizontal scrolling inside that component only.
- Preserve bottom content by using vertical scroll, not by hiding overflow on the main content area.
- For dense laptop widths, reduce padding/gaps moderately before reducing typography. Keep body text readable, generally no smaller than `13px` to `14px`.
- Keep modal overlays responsive with viewport-aware max width and height, for example `max-width: min(900px, calc(100vw - 48px))` and `max-height: calc(100vh - 64px)`, with scrollable modal bodies.
- Keep assistant/chat panels and floating pills from covering critical actions by using responsive widths such as `clamp(360px, 28vw, 420px)` and safe bottom/right spacing.
- Verify both empty/default states and populated/detail states, because selected cards, expanded accordions, chat panels, and recommendation widgets often create overflow that the default state does not show.

## Tool Guidance

- Use Figma tools for node inspection, exports, variables, and styles when available.
- Use Browser or Playwright-style automation for local rendering, screenshots, viewport checks, and interaction verification.
- Use image diff tooling when visual inspection is ambiguous, but do not chase noisy antialiasing differences before fixing structural mismatches.
- Use generated bitmap assets only for missing non-brand illustrative content. Do not generate replacements for exact product UI, logos, or known brand assets.

## Escalation Points

Ask the user for the missing artifact or decision only when blocked by one of these:

- The Figma link is inaccessible and no screenshot/export is available.
- Multiple frames could match the request and choosing one would risk implementing the wrong screen.
- Required proprietary fonts or image assets are missing and cannot be exported.
- The user asks for a production implementation but the design contains unresolved states, data behavior, or routing decisions.
