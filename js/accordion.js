// accordion.js — original, un‑modified
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
      const opening = sub.hidden;
      sub.hidden = !opening;
      li.classList.toggle('open', opening);
      btn.textContent = opening ? '▾' : '▸';
      btn.setAttribute('aria-expanded', opening);

      if (opening) {
        // expanding: let the browser recalc, then set explicit height so it animates
        sub.style.maxHeight = sub.scrollHeight + 'px';
      } else {
        // collapsing: go from current height to 0
        sub.style.maxHeight = sub.scrollHeight + 'px'; // force start height
        /* allow repaint */
        requestAnimationFrame(() => (sub.style.maxHeight = '0'));
      }
    });

    /* after the expand animation finishes, let the list size naturally */
    sub.addEventListener('transitionend', () => {
      if (li.classList.contains('open')) sub.style.maxHeight = 'none';
    });
  });
});
