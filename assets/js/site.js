/* Footer toggle functionality */
(function() {
  const footer = document.getElementById('sticky-footer');
  const toggle = document.getElementById('footer-toggle');
  
  if (!footer || !toggle) return;

  const isMobile = window.innerWidth < 768;

  // Default collapsed on mobile
  if (isMobile) {
    footer.classList.add('collapsed');
  }

  // Toggle on click
  toggle.addEventListener('click', function() {
    footer.classList.toggle('collapsed');
    updateFooterHeight();
  });

  function updateFooterHeight() {
    const h = footer.offsetHeight;
    document.documentElement.style.setProperty('--footer-h', h + 'px');
  }

  // Update on load and resize
  window.addEventListener('load', updateFooterHeight);
  window.addEventListener('resize', updateFooterHeight);
  updateFooterHeight();
})();
