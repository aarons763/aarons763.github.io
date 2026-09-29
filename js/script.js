const signalToggle = document.querySelector('#signal-toggle');
if (signalToggle) {
  function setSignal(active) {
    document.querySelector('.board-panel').classList.toggle('paused', !active);
    signalToggle.setAttribute('aria-pressed', String(active));
    signalToggle.setAttribute('aria-label', `${active ? 'Pause' : 'Resume'} circuit animation`);
    signalToggle.textContent = active ? 'Pause signal  Ⅱ' : 'Resume signal  ▷';
    document.querySelector('.live-label').textContent = active ? '● SYSTEM ACTIVE' : '○ SYSTEM PAUSED';
  }
  signalToggle.addEventListener('click', () => setSignal(signalToggle.getAttribute('aria-pressed') !== 'true'));
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setSignal(false);
}
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

// Native dialogs retain keyboard focus management and Escape support.
const projectDialog = document.querySelector('#project-dialog');
const projectContent = document.querySelector('#dialog-content');
let projectTrigger = null;
function openProject(id, trigger = null) {
  const template = document.getElementById(`${id}-content`);
  if (!template || !projectDialog) return;
  projectTrigger = trigger;
  projectContent.replaceChildren(template.content.cloneNode(true));
  if (!projectDialog.open) projectDialog.showModal();
  projectDialog.scrollTop = 0;
  document.body.classList.add('modal-open');
  initializeBoardViewer(projectContent);
}
document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => openProject(button.dataset.project, button));
});
if (projectDialog) {
  document.querySelector('#close-dialog').addEventListener('click', () => projectDialog.close());
  projectDialog.addEventListener('click', event => {
    const bounds = projectDialog.getBoundingClientRect();
    if (event.target === projectDialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) projectDialog.close();
  });
  projectDialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (['#riscv-cpu', '#stm32-board'].includes(location.hash)) history.replaceState(null, '', '#projects');
    projectTrigger?.focus();
  });
  const openFromHash = () => {
    if (['#riscv-cpu', '#stm32-board'].includes(location.hash)) openProject(location.hash.slice(1));
  };
  window.addEventListener('hashchange', openFromHash);
  openFromHash();
}

// The self-hosted viewer and model are only loaded when the PCB popup opens.
async function initializeBoardViewer(scope) {
  const viewer = scope.querySelector('model-viewer');
  if (!viewer) return;
  const wrapper = scope.querySelector('.board-viewer');
  const status = scope.querySelector('.viewer-status');
  const controls = [...scope.querySelectorAll('[data-view]')];
  controls.forEach(button => { button.disabled = true; });
  const fail = () => {
    if (!wrapper.isConnected) return;
    wrapper.setAttribute('aria-busy', 'false');
    status.textContent = '3D view unavailable. Static board preview shown.';
  };
  viewer.addEventListener('error', fail, { once: true });
  const ready = () => {
    if (!wrapper.isConnected) return;
    wrapper.classList.add('viewer-ready');
    wrapper.setAttribute('aria-busy', 'false');
    controls.forEach(button => { button.disabled = false; });
  };
  viewer.addEventListener('load', ready, { once: true });
  try {
    await import(new URL('js/vendor/model-viewer.min.js', document.baseURI).href);
    await customElements.whenDefined('model-viewer');
    if (!viewer.isConnected) return;
    if (viewer.loaded) ready();
    controls.forEach(button => button.addEventListener('click', () => {
      const action = button.dataset.view;
      if (action === 'in' || action === 'out') {
        const orbit = viewer.getCameraOrbit();
        viewer.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${orbit.radius * (action === 'in' ? .8 : 1.25)}m`;
      } else {
        viewer.cameraTarget = 'auto auto auto';
        viewer.cameraOrbit = action === 'top' ? '0deg 0deg 110%' : action === 'bottom' ? '0deg 180deg 110%' : '35deg 55deg 110%';
      }
    }));
  } catch (error) { fail(); }
}
