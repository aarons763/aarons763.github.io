# Aaron Sun — engineering portfolio

Static HTML, CSS, and JavaScript site for GitHub Pages. No build step required. Preview with any HTTP server from the repository root (for example, `python -m http.server 4173`). The 3D viewer requires HTTP; browsers block module/model loading from file URLs.

## Content

- `index.html`: homepage, Experience section, project cards, and popup templates.
- `js/script.js`: dialogs, animation toggle, and lazy-loaded 3D viewer controls.
- `css/styles.css`: responsive layout and project media styles.
- `files/Aaron_Sun_Resume.pdf`: current résumé download.

## Project media

- `images/projects/cpu-datapath.svg`: editable implementation overview derived from `aarons763/riscv-cpu/rtl/cpu_top.sv`. It covers fetch/decode, operand selection, ALU, memory, writeback, and next-PC logic. Debug outputs are omitted for clarity.
- `images/projects/cpu-smoke-waveform.png`: actual screenshot from `https://github.com/aarons763/riscv-cpu/blob/main/docs/images/smoke-waveform.png`.
- `images/projects/stm32-board.glb`: web 3D export of the Altium design via a temporary KiCad import. Original PCB sources were not modified. The import reports an unrecognized layer mapping, so the web model is a visualization, not a manufacturing reference.
- `images/projects/pcb-3d.png`: rendered from that GLB using the same camera as the popup.
- `images/projects/pcb-top.svg` and `pcb-bottom.svg`: copper/silkscreen previews via the same import.

Embedded Altium component models were retained. Six missing bodies were substituted with standard KiCad package models: U2 (QFN-48, 7 × 7 mm), U3 (QFN-24, 4 × 4 mm), C13/C14 (0402 capacitors), and D1/D2 (0402 LEDs). These show package envelopes, not exact vendor geometry. KiCad model licensing is included in `images/projects/KiCad-models-LICENSE.md`.

## Interactive viewer

`js/vendor/model-viewer.min.js` is Google model-viewer 4.1.0, locally hosted under Apache 2.0 (see the adjacent license). It loads only when the PCB popup opens. The model supports drag/touch orbit, zoom, pan, top/bottom views, and reset. A static poster stays available when 3D loading fails. Model-viewer uses the browser's WebGL renderer; no external model service is needed.

The old CPU project page redirects to its popup. Add future content inside the two project templates. Google Fonts is optional; system fallbacks are provided.
