/**
 * Elastomer Demo - Interactive stress-strain visualization
 * Shows macro tensile test, micro chain behavior, and progressive stress-strain curve
 */

(function() {
  'use strict';

  // DOM Elements
  const demo = document.getElementById('elastomer-demo');
  if (!demo) return;

  const playBtn = document.getElementById('elastomer-play');
  const strainSlider = document.getElementById('elastomer-strain');
  const readoutStrain = document.getElementById('readout-strain');
  const readoutStress = document.getElementById('readout-stress');
  const readoutOrder = document.getElementById('readout-order');

  const macroCanvas = document.getElementById('macroCanvas');
  const microCanvas = document.getElementById('microCanvas');
  const curveCanvas = document.getElementById('curveCanvas');

  const macroCtx = macroCanvas.getContext('2d');
  const microCtx = microCanvas.getContext('2d');
  const curveCtx = curveCanvas.getContext('2d');

  // State
  let state = {
    strain: 0,          // 0 to 10 (0% to 1000%)
    stress: 0,          // MPa
    order: 0,           // 0 to 1
    isPlaying: false,
    time: 0,
    direction: 1,       // 1 = stretching, -1 = relaxing
    maxStrainReached: 0 // For progressive curve drawing
  };

  // Micro balls (polymer chain segments)
  const NUM_BALLS = 30;
  let balls = [];
  let bonds = []; // Cohesive bonds between nearby balls

  // Initialize balls with random positions
  function initBalls() {
    balls = [];
    for (let i = 0; i < NUM_BALLS; i++) {
      balls.push({
        x: 0.15 + Math.random() * 0.7,
        y: 0.15 + Math.random() * 0.7,
        baseX: 0,
        baseY: 0,
        vx: (Math.random() - 0.5) * 0.002,
        vy: (Math.random() - 0.5) * 0.002
      });
    }
    balls.forEach(b => {
      b.baseX = b.x;
      b.baseY = b.y;
    });
    
    // Create initial bonds between nearby balls
    createBonds();
  }

  function createBonds() {
    bonds = [];
    const bondDist = 0.25;
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        const dx = balls[i].baseX - balls[j].baseX;
        const dy = balls[i].baseY - balls[j].baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < bondDist) {
          bonds.push({
            i: i,
            j: j,
            restLength: dist,
            broken: false,
            breakStrain: 1.5 + Math.random() * 2 // Breaks between strain 1.5-3.5
          });
        }
      }
    }
  }

  // Calculate stress from strain (conceptual S-curve)
  function calculateStress(strain) {
    const s = Math.abs(strain);
    
    if (s < 1.5) {
      // Initial modulus region: cohesive network provides stiffness
      return 0.6 * s;
    } else if (s < 5.5) {
      // Plateau region: bonds broken, entropic elasticity dominates
      const base = 0.6 * 1.5;
      return base + 0.08 * (s - 1.5);
    } else {
      // Strain-induced crystallization upturn
      const base = 0.6 * 1.5 + 0.08 * 4;
      const upturn = Math.pow((s - 5.5) / 4.5, 1.8) * 2.8;
      return base + upturn;
    }
  }

  // Calculate order parameter (0-1)
  function calculateOrder(strain) {
    const s = Math.abs(strain);
    if (s < 4) return 0;
    if (s > 9) return 1;
    return (s - 4) / 5;
  }

  // Setup canvas with devicePixelRatio
  function setupCanvas(canvas, ctx, width, height) {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
    return { width, height };
  }

  // Resize all canvases
  function resizeCanvases() {
    const wrapper = macroCanvas.parentElement;
    const w = wrapper.clientWidth || 200;
    const h = Math.round(w * 0.8);

    setupCanvas(macroCanvas, macroCtx, w, h);
    setupCanvas(microCanvas, microCtx, w, h);
    setupCanvas(curveCanvas, curveCtx, w, h);
  }

  // Draw Macro Canvas (tensile tester with moving top grip)
  function drawMacro(w, h) {
    const ctx = macroCtx;
    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, w, h);

    const strainFactor = state.strain / 10;
    
    // Fixed positions
    const gripW = w * 0.25;
    const gripH = h * 0.08;
    const centerX = w * 0.5;
    
    // Bottom grip - FIXED at bottom
    const bottomGripY = h * 0.85;
    ctx.fillStyle = '#444';
    ctx.fillRect(centerX - gripW/2, bottomGripY, gripW, gripH);
    
    // Top grip - MOVES UP with strain
    const topGripBaseY = h * 0.15;
    const topGripY = topGripBaseY - strainFactor * h * 0.35;
    ctx.fillStyle = '#444';
    ctx.fillRect(centerX - gripW/2, topGripY - gripH, gripW, gripH);

    // Specimen - connected to both grips
    const specW = gripW * 0.4;
    const specTopY = topGripY;
    const specBottomY = bottomGripY;
    
    // Poisson effect - width decreases as length increases
    const widthFactor = 1 / Math.sqrt(1 + strainFactor * 0.6);
    const currentSpecW = specW * widthFactor;

    // Draw specimen with gradient
    const grad = ctx.createLinearGradient(centerX - currentSpecW/2, 0, centerX + currentSpecW/2, 0);
    grad.addColorStop(0, '#5dade2');
    grad.addColorStop(0.5, '#3498db');
    grad.addColorStop(1, '#5dade2');
    ctx.fillStyle = grad;
    ctx.fillRect(centerX - currentSpecW/2, specTopY, currentSpecW, specBottomY - specTopY);

    // Gauge section highlight (middle third)
    const gaugeY = specTopY + (specBottomY - specTopY) * 0.35;
    const gaugeH = (specBottomY - specTopY) * 0.3;
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.strokeRect(centerX - currentSpecW/2 - 3, gaugeY, currentSpecW + 6, gaugeH);
    ctx.setLineDash([]);

    // Zoom callout arrow
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(centerX + currentSpecW/2 + 8, gaugeY + gaugeH/2);
    ctx.lineTo(w * 0.9, gaugeY + gaugeH/2);
    ctx.stroke();
    
    // Arrow head
    ctx.beginPath();
    ctx.moveTo(w * 0.9, gaugeY + gaugeH/2);
    ctx.lineTo(w * 0.87, gaugeY + gaugeH/2 - 5);
    ctx.lineTo(w * 0.87, gaugeY + gaugeH/2 + 5);
    ctx.closePath();
    ctx.fillStyle = '#e74c3c';
    ctx.fill();

    // Labels
    ctx.fillStyle = '#333';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Moving Grip', centerX, topGripY - gripH - 5);
    ctx.fillText('Fixed Grip', centerX, bottomGripY + gripH + 12);
    
    // Force arrow on top grip
    if (state.strain > 0.1) {
      ctx.strokeStyle = '#27ae60';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(centerX, topGripY - gripH - 15);
      ctx.lineTo(centerX, topGripY - gripH - 35);
      ctx.stroke();
      
      // Arrow head pointing up
      ctx.beginPath();
      ctx.moveTo(centerX, topGripY - gripH - 35);
      ctx.lineTo(centerX - 6, topGripY - gripH - 25);
      ctx.lineTo(centerX + 6, topGripY - gripH - 25);
      ctx.closePath();
      ctx.fillStyle = '#27ae60';
      ctx.fill();
      
      ctx.font = '9px sans-serif';
      ctx.fillStyle = '#27ae60';
      ctx.fillText('F', centerX + 12, topGripY - gripH - 25);
    }
  }

  // Draw Micro Canvas with bonds
  function drawMicro(w, h) {
    const ctx = microCtx;
    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, w, h);

    // Border (zoom from macro)
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, w - 8, h - 8);

    const strainFactor = state.strain / 10;
    const order = state.order;

    // Update ball positions
    balls.forEach((ball, i) => {
      // Affine deformation in x direction
      const deformedX = 0.5 + (ball.baseX - 0.5) * (1 + strainFactor * 1.2);
      
      // At high order, align into horizontal lanes
      const laneCount = 5;
      const laneIndex = Math.floor(i / (NUM_BALLS / laneCount));
      const laneY = (laneIndex + 0.5) / laneCount;
      const targetY = ball.baseY * (1 - order) + laneY * order;
      
      // Random jitter decreases with order
      const jitterScale = (1 - order * 0.95);
      ball.vx += (Math.random() - 0.5) * 0.001 * jitterScale;
      ball.vy += (Math.random() - 0.5) * 0.001 * jitterScale;
      ball.vx *= 0.95;
      ball.vy *= 0.95;
      
      ball.x = deformedX + ball.vx * 10;
      ball.y = targetY + ball.vy * 10;
      
      // Keep in bounds
      ball.x = Math.max(0.08, Math.min(0.92, ball.x));
      ball.y = Math.max(0.08, Math.min(0.92, ball.y));
    });

    // Update bond states
    bonds.forEach(bond => {
      if (!bond.broken && state.strain > bond.breakStrain) {
        bond.broken = true;
      }
      // Bonds can reform at high order (crystallization)
      if (bond.broken && order > 0.6) {
        bond.broken = false;
      }
    });

    // Draw bonds first (behind balls)
    bonds.forEach(bond => {
      const b1 = balls[bond.i];
      const b2 = balls[bond.j];
      const x1 = b1.x * (w - 16) + 8;
      const y1 = b1.y * (h - 16) + 8;
      const x2 = b2.x * (w - 16) + 8;
      const y2 = b2.y * (h - 16) + 8;
      
      if (!bond.broken) {
        // Active bond - solid line
        const bondColor = order > 0.5 ? '#8e44ad' : '#3498db';
        ctx.strokeStyle = bondColor;
        ctx.lineWidth = order > 0.5 ? 2 : 1.5;
        ctx.globalAlpha = order > 0.5 ? 0.8 : 0.6;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    });

    // Draw balls
    const ballRadius = Math.max(5, w * 0.028);
    balls.forEach((ball, i) => {
      const x = ball.x * (w - 16) + 8;
      const y = ball.y * (h - 16) + 8;
      
      // Color based on state
      let hue = 200; // blue
      if (order > 0.3) {
        hue = 200 + order * 80; // shift toward purple
      }
      
      ctx.fillStyle = `hsl(${hue}, 65%, 50%)`;
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Subtle outline
      ctx.strokeStyle = `hsl(${hue}, 65%, 35%)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Phase labels
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#666';
    
    if (state.strain < 1.5) {
      ctx.fillText('Cohesive network', 8, h - 8);
    } else if (state.strain < 5) {
      ctx.fillText('Bonds breaking...', 8, h - 8);
    } else if (order > 0.3) {
      ctx.fillText('Crystallizing!', 8, h - 8);
    } else {
      ctx.fillText('Entropic regime', 8, h - 8);
    }
  }

  // Draw Curve Canvas - PROGRESSIVE drawing
  function drawCurve(w, h) {
    const ctx = curveCtx;
    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);

    const padding = { left: 40, right: 15, top: 20, bottom: 35 };
    const plotW = w - padding.left - padding.right;
    const plotH = h - padding.top - padding.bottom;

    // Axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, h - padding.bottom);
    ctx.lineTo(w - padding.right, h - padding.bottom);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#333';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Strain (%)', w / 2, h - 5);
    
    ctx.save();
    ctx.translate(12, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Stress (MPa)', 0, 0);
    ctx.restore();

    // X-axis ticks
    ctx.font = '8px sans-serif';
    const xTicks = [0, 250, 500, 750, 1000];
    xTicks.forEach(val => {
      const x = padding.left + (val / 1000) * plotW;
      ctx.fillStyle = '#333';
      ctx.fillText(val.toString(), x, h - padding.bottom + 14);
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, h - padding.bottom);
      ctx.stroke();
    });

    // Y-axis ticks
    const yTicks = [0, 1, 2, 3, 4];
    ctx.textAlign = 'right';
    yTicks.forEach(val => {
      const y = h - padding.bottom - (val / 4) * plotH;
      ctx.fillStyle = '#333';
      ctx.fillText(val.toString(), padding.left - 6, y + 3);
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
    });

    // Draw curve ONLY up to current max strain reached
    const maxStrain = Math.max(state.strain, state.maxStrainReached);
    state.maxStrainReached = maxStrain;

    if (maxStrain > 0.05) {
      ctx.strokeStyle = '#3498db';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      
      let firstPoint = true;
      for (let s = 0; s <= maxStrain; s += 0.05) {
        const stress = calculateStress(s);
        const x = padding.left + (s / 10) * plotW;
        const y = h - padding.bottom - (stress / 4) * plotH;
        
        if (firstPoint) {
          ctx.moveTo(x, y);
          firstPoint = false;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    // Current point (red dot)
    if (state.strain > 0.02) {
      const currentX = padding.left + (state.strain / 10) * plotW;
      const currentY = h - padding.bottom - (state.stress / 4) * plotH;
      
      ctx.fillStyle = '#e74c3c';
      ctx.beginPath();
      ctx.arc(currentX, currentY, 7, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Region labels (only show if we've reached that region)
    ctx.font = '8px sans-serif';
    ctx.fillStyle = '#888';
    ctx.textAlign = 'center';
    
    if (maxStrain > 0.5) {
      ctx.fillText('Initial', padding.left + plotW * 0.07, padding.top + 20);
      ctx.fillText('modulus', padding.left + plotW * 0.07, padding.top + 30);
    }
    
    if (maxStrain > 3) {
      ctx.fillText('Plateau', padding.left + plotW * 0.35, padding.top + 50);
    }
    
    if (maxStrain > 6) {
      ctx.fillText('Strain-induced', padding.left + plotW * 0.78, padding.top + 25);
      ctx.fillText('crystallization', padding.left + plotW * 0.78, padding.top + 35);
    }
  }

  // Animation loop
  let animationId = null;
  let lastTime = 0;

  function animate(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    state.time += dt;

    if (state.isPlaying) {
      // Auto-cycle strain
      state.strain += state.direction * dt * 1.5;
      
      if (state.strain >= 10) {
        state.strain = 10;
        state.direction = -1;
      } else if (state.strain <= 0) {
        state.strain = 0;
        state.direction = 1;
      }
      
      strainSlider.value = state.strain;
    }

    // Update derived state
    state.stress = calculateStress(state.strain);
    state.order = calculateOrder(state.strain);

    // Update readouts
    readoutStrain.textContent = Math.round(state.strain * 100) + '%';
    readoutStress.textContent = state.stress.toFixed(2) + ' MPa';
    readoutOrder.textContent = state.order.toFixed(2);

    // Get canvas dimensions
    const wrapper = macroCanvas.parentElement;
    const w = wrapper.clientWidth || 200;
    const h = Math.round(w * 0.8);

    // Draw all canvases
    drawMacro(w, h);
    drawMicro(w, h);
    drawCurve(w, h);

    animationId = requestAnimationFrame(animate);
  }

  // Event handlers
  playBtn.addEventListener('click', () => {
    state.isPlaying = !state.isPlaying;
    playBtn.textContent = state.isPlaying ? '⏸ Pause' : '▶ Play';
  });

  strainSlider.addEventListener('input', (e) => {
    state.strain = parseFloat(e.target.value);
    // Don't stop playing, just update position
  });

  // Handle resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvases();
    }, 100);
  });

  // Initialize
  initBalls();
  resizeCanvases();
  animate(0);

})();
