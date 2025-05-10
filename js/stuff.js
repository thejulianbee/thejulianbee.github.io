document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-sidebar button');
  const contentItems = document.querySelectorAll('.content-grid .grid-item');
  const transitionDuration = 300; // Matches your CSS transition duration

  // --- Helper function to reliably trigger fade-in ---
  function showItem(item) {
      if (!item) return; // Guard against null items

      // Function to remove the 'is-hidden' class (triggers transitions)
      function triggerTransitions() {
          item.classList.remove('is-hidden');
      }

      // If it's completely gone from layout ('display: none')
      if (item.classList.contains('is-gone')) {
          item.classList.remove('is-gone'); // Make it 'display: block'

          // Use a minimal setTimeout to delay triggering transitions
          setTimeout(triggerTransitions, 30); // Delay allows display:block to process

      } else if (item.classList.contains('is-hidden')) {
          // If already display: block but hidden via class, maybe still need delay
          setTimeout(triggerTransitions, 30);
      }
      // If already visible, do nothing
  }

  // --- Helper function to reliably trigger fade-out and set display:none ---
  function hideItem(item) {
      if (!item || item.classList.contains('is-hidden')) return; // Guard / Already hiding

      // Clear any existing hide timeout for this item
      if (item.dataset.hideTimeout) {
          clearTimeout(item.dataset.hideTimeout);
      }

      // Add 'is-hidden' class to start the opacity/scale transition
      item.classList.add('is-hidden');

      // Set timeout to add 'is-gone' (display:none) after transition finishes
      item.dataset.hideTimeout = setTimeout(() => {
          // Ensure it's still meant to be hidden before setting display:none
          if (item.classList.contains('is-hidden')) {
              item.classList.add('is-gone');
          }
          delete item.dataset.hideTimeout; // Clear the stored timeout ID
      }, transitionDuration);
  }

  // --- Main filter function is removed, logic moved to click handler ---

  // --- Modified Click Handler for Two-Phase Filtering ---
  filterButtons.forEach(button => {
      button.addEventListener('click', () => {
          // If already active, do nothing
          if (button.classList.contains('active')) {
              return;
          }

          const selectedCategory = button.dataset.filter;

          // Update active button style immediately
          filterButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');

          // --- Phase 1: Hide ALL currently visible items ---
          let itemsToHide = [];
          contentItems.forEach(item => {
              // Check if item is currently visible (not hidden or gone)
              if (!item.classList.contains('is-hidden') && !item.classList.contains('is-gone')) {
                  itemsToHide.push(item); // Store items to hide
                  hideItem(item); // Start hide animation immediately
              }
              // Clear any pending show timeouts (if any were added)
              // (We removed the show timeout tracking, but good practice if added back)
          });

          // --- Phase 2: After fade-out, show the required items ---
          setTimeout(() => {
              contentItems.forEach(item => {
                  const itemCategory = item.dataset.category;
                  const shouldShow = (selectedCategory === 'all' || itemCategory === selectedCategory);

                  if (shouldShow) {
                      showItem(item); // Trigger fade-in animation
                  } else {
                      // Ensure items that shouldn't show ARE display:none
                      // hideItem would have set the timeout, but we can be explicit here
                      // to ensure they are gone if the hideItem timeout hasn't fired yet
                      // Or, rely on hideItem's timeout to eventually add 'is-gone'.
                      // Let's rely on hideItem's timeout for simplicity for now.
                      // If hideItem was called, it will eventually add 'is-gone'.
                      // If hideItem wasn't called (it was already hidden), it should remain hidden.
                  }
              });
          }, transitionDuration + 10); // Wait for fade-out plus a small buffer

      });
  });

  // --- Initial Page Load ---
  // Start all items hidden
  contentItems.forEach(item => {
     item.classList.add('is-hidden');
     item.classList.add('is-gone');
  });

  // Animate in the initial "ALL" items after a short delay
  setTimeout(() => {
      contentItems.forEach(item => {
          // No category check needed here, "all" means show everything initially
           showItem(item);
      });
  }, 50); // Delay allows initial hidden state to render

 // Ensure ALL button is active visually
 document.querySelector('.filter-sidebar button[data-filter="all"]').classList.add('active');

});