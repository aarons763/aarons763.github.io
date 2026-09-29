# Aaron Sun — engineering portfolio

Static HTML, CSS, and JavaScript portfolio for GitHub Pages. No build step required.

- `index.html`: homepage, project cards, and project detail templates.
- `js/script.js`: accessible native project dialogs, circuit animation, and footer year.
- `css/styles.css`: layout and responsive styles.
- `files/Aaron_Sun_Resume.pdf`: current résumé.
- `images/projects/cpu-smoke-waveform.png`: actual simulation screenshot from https://github.com/aarons763/riscv-cpu/blob/main/docs/images/smoke-waveform.png.
- `images/projects/pcb-top.svg` and `pcb-bottom.svg`: layout previews exported via a temporary KiCad import of the original Altium PcbDoc. Original design files were not modified. The import reported an unrecognized layer mapping, so these are visual previews, not fabrication outputs.

Edit the `riscv-cpu-content` and `stm32-board-content` templates to add project details or images. Images in dialogs open at full size. The former CPU page redirects to its popup for compatibility.

Run any static server in the repository root to preview. Google Fonts is optional, with system fallbacks. Keyboard navigation and reduced motion are supported.
