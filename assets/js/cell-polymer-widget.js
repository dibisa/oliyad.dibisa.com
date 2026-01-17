/**
 * Cell ↔ Polymer Widget Interactive JS
 * Features:
 * - Click organelles to show info panel
 * - Keyboard accessibility (Enter/Space)
 * - Auto-demo: cycles through organelles every 5s when idle
 * - Stops auto-demo when user interacts
 */

(function() {
  'use strict';

  const widget = document.getElementById('cell-polymer-widget');
  if (!widget) return;

  const panel = document.getElementById('cell-info-panel');
  const closeBtn = document.getElementById('cell-info-close');
  const titleEl = document.getElementById('cell-info-title');
  const functionEl = document.getElementById('cell-info-function');
  const polymerEl = document.getElementById('cell-info-polymer');
  const justificationEl = document.getElementById('cell-info-justification');

  const organelles = widget.querySelectorAll('.organelle');
  const data = window.cellPolymerData || [];

  let activeOrganelle = null;
  let autoDemoInterval = null;
  let autoDemoIndex = 0;
  let userHasInteracted = false;
  let isReading = false;

  // Find data by id
  function findData(id) {
    return data.find(d => d.id === id);
  }

  // Show info panel for an organelle
  function showInfo(organelleEl, fromAutoDemo = false) {
    const id = organelleEl.dataset.id;
    const info = findData(id);
    
    if (!info) return;

    // Remove active from previous
    if (activeOrganelle) {
      activeOrganelle.classList.remove('active');
    }

    // Set new active
    activeOrganelle = organelleEl;
    organelleEl.classList.add('active');

    // Update panel content
    titleEl.textContent = info.name;
    functionEl.textContent = info.function;
    polymerEl.textContent = info.polymer_analogy;
    justificationEl.textContent = info.justification;

    // Show panel
    panel.classList.add('open');

    // If user triggered, mark as reading
    if (!fromAutoDemo) {
      isReading = true;
    }
  }

  // Close panel
  function closePanel() {
    panel.classList.remove('open');
    if (activeOrganelle) {
      activeOrganelle.classList.remove('active');
      activeOrganelle = null;
    }
    isReading = false;
  }

  // Handle organelle click
  function handleOrganelleClick(e) {
    userHasInteracted = true;
    stopAutoDemo();
    showInfo(e.currentTarget, false);
  }

  // Handle keyboard
  function handleOrganelleKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      userHasInteracted = true;
      stopAutoDemo();
      showInfo(e.currentTarget, false);
    }
  }

  // Attach event listeners to organelles
  organelles.forEach(org => {
    org.addEventListener('click', handleOrganelleClick);
    org.addEventListener('keydown', handleOrganelleKeydown);
  });

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', closePanel);
  }

  // Auto-demo: highlight organelles in sequence
  function runAutoDemo() {
    if (userHasInteracted || isReading) return;

    const organelleArray = Array.from(organelles);
    if (organelleArray.length === 0) return;

    // Remove previous demo highlight
    organelleArray.forEach(org => org.classList.remove('demo-highlight'));

    // Add highlight to current
    const currentOrg = organelleArray[autoDemoIndex];
    currentOrg.classList.add('demo-highlight');

    // Show info briefly (auto-demo mode)
    showInfo(currentOrg, true);

    // Move to next
    autoDemoIndex = (autoDemoIndex + 1) % organelleArray.length;
  }

  function startAutoDemo() {
    if (autoDemoInterval) return;
    
    // Start after 3 seconds initial delay
    setTimeout(() => {
      if (userHasInteracted) return;
      
      runAutoDemo();
      autoDemoInterval = setInterval(() => {
        if (userHasInteracted || isReading) {
          stopAutoDemo();
          return;
        }
        runAutoDemo();
      }, 5000);
    }, 3000);
  }

  function stopAutoDemo() {
    if (autoDemoInterval) {
      clearInterval(autoDemoInterval);
      autoDemoInterval = null;
    }
    // Remove all demo highlights
    organelles.forEach(org => org.classList.remove('demo-highlight'));
  }

  // Stop auto-demo on any interaction with widget
  widget.addEventListener('mouseenter', () => {
    if (!userHasInteracted) {
      // Don't stop yet, but pause
    }
  });

  widget.addEventListener('click', () => {
    userHasInteracted = true;
    stopAutoDemo();
  });

  // Detect if user is actively reading (mouse over panel)
  if (panel) {
    panel.addEventListener('mouseenter', () => {
      isReading = true;
    });
    panel.addEventListener('mouseleave', () => {
      // Keep reading state until closed
    });
  }

  // Start auto-demo on page load
  startAutoDemo();

})();
