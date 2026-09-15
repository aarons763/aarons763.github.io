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
