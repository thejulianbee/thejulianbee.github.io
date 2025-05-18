// accordion.js — final
document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('ol.collapsible li').forEach(li => {
    const sub = li.querySelector(':scope > ol');
    if (!sub) return;

    li.classList.add('has-sublist');
    sub.style.maxHeight = '0';     // collapsed at start
    sub.hidden = true;

    const btn = document.createElement('button');
    btn.className = 'toggle';
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = '▸';
    li.prepend(btn);

    btn.addEventListener('click', () => {

      /* open or close this sub‑list */
      const opening = sub.hidden;
      sub.hidden = !opening;
      li.classList.toggle('open', opening);
      btn.textContent = opening ? '▾' : '▸';
      btn.setAttribute('aria-expanded', opening);

      if (opening) {
        // let browser recalc, then set explicit height so it’ll animate
        sub.style.maxHeight = sub.scrollHeight + 'px';
      } else {
        // collapsing: go from current pixel height down to 0
        sub.style.maxHeight = sub.scrollHeight + 'px';   // start height
        requestAnimationFrame(() => sub.style.maxHeight = '0');
      }
    });

    /* whenever a transition finishes, clear inline height so parents can grow naturally */
    sub.addEventListener('transitionend', e => {
      if (e.propertyName !== 'max-height') return;
      if (!li.classList.contains('open')) return;
      sub.style.maxHeight = 'none';   // let it be auto‑height from now on
    });
  });
});
