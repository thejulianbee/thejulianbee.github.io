document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-sidebar button');
  const contentItems  = document.querySelectorAll('.content-grid .grid-item');
  const transitionDuration = 300; // matches CSS

  /* ---------------- helper: fade‑in ---------------- */
  function showItem(item) {
    if (!item) return;

    const trigger = () => item.classList.remove('is-hidden');

    if (item.classList.contains('is-gone')) {
      item.classList.remove('is-gone');
      setTimeout(trigger, 30);            // allow display:block to register
    } else if (item.classList.contains('is-hidden')) {
      setTimeout(trigger, 30);            // still need the delay
    }
  }

  /* ---------------- helper: fade‑out ---------------- */
  function hideItem(item) {
    if (!item || item.classList.contains('is-hidden')) return;

    if (item.dataset.hideTimeout) clearTimeout(item.dataset.hideTimeout);

    item.classList.add('is-hidden');
    item.dataset.hideTimeout = setTimeout(() => {
      if (item.classList.contains('is-hidden')) item.classList.add('is-gone');
      delete item.dataset.hideTimeout;
    }, transitionDuration);
  }

  /* ---------------- click handler ------------------ */
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (button.classList.contains('active')) return;

      const selected = button.dataset.filter;

      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      /* phase 1: hide everything currently visible */
      const toHide = [];
      contentItems.forEach(item => {
        if (!item.classList.contains('is-hidden') &&
            !item.classList.contains('is-gone')) {
          toHide.push(item);
          hideItem(item);
        }
      });

      /* phase 2: after fade‑out, show the ones we need */
      setTimeout(() => {
        contentItems.forEach(item => {
          const cat = item.dataset.category;
          const shouldShow = (selected === 'all' || cat === selected);
          if (shouldShow) showItem(item);
        });
      }, transitionDuration);
    });
  });

  /* initial fade‑in so grid doesn’t flash */
  contentItems.forEach(it => it.classList.add('is-hidden'));
  setTimeout(() => contentItems.forEach(showItem), 50);
});
