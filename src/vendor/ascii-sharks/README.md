# ascii-sharks (vendored)

Fish schools and sharks drawn as ASCII on a canvas — the background of the
figures card on /about.

- Source: https://github.com/stackedlol/ascii-sharks (src/), commit `a0074c16a106f0abc665fe9712ca445f8f98ad8e`
- License: MIT, © 2026 drewdi — see LICENSE in this folder, which has to stay
  with the code.

## Local changes

One addition, opt-in, so the original rendering is untouched when it's off:
a `pixel` render mode, a fixed `cell` size and a `ripples` switch
(`RenderOptions` in renderer.ts), passed through `OceanEngine` and
`AsciiOcean`. `ripples: false` skips drawing the wake field — the trails and
the rings a click sends out — while the simulation itself is unchanged;
`fishOpacity` scales how strongly the fish show; `light` puts the pixel ocean
on a light page, with the sharks blended toward it at that strength, and
`background` sets that page's colour as [r, g, b] (white by default). Pixel mode draws
each cell as a solid block — no glyphs, no grid lines, no gaps between cells —
with square cells, and keeps everything achromatic: sharks in their grey skin
shading only (no accent cells), and the wake and bite flashes in pale grey
instead of cyan and red. Every change is marked "Local addition" or
"Pixel mode" in the source.

One fix in engine.ts: the webfont `load()` is skipped in pixel mode (no text
is drawn) and its rejection is caught — upstream leaves it unhandled, which
surfaces as a "NetworkError" page error whenever a face in the inherited font
list can't load.

To update from upstream, re-copy `src/` and re-apply both.
Everything else site-specific belongs in the component that uses it
(src/app/about/page.tsx), not in these files.
