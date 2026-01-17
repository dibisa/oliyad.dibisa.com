/**
 * Elastomer Demo - Interactive stress-strain visualization
 * Shows macro tensile test, micro chain ordering, and stress-strain curve
 */

(function() {
  'use strict';

  // DOM Elements
  const demo = document.getElementById('elastomer-demo');
  if (!demo) return;

  const playBtn = document.getElementById('elastomer-play');
  const strainSlider = document.getElementById('elastomer-strain');
  const modeToggle = document.getElementById('elastomer-mode');
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
    isCompression: false,
    isPlaying: false,
    time: 0,
    direction: 1        // 1 = stretching, -1 = relaxing
  };

  // Micro balls
  const NUM_BALLS = 40;
  let balls = [];

  // Initialize balls with random positions
  function initBalls() {
    balls = [];
    for (let i = 0; i < NUM_BALLS; i++) {
      balls.push({
        x: 0.2 + Math.random() * 0.6,  // normalized 0-1
        y: 0.15 + Math.random() * 0.7,
        baseX: 0,
        baseY: 0,
        targetX: 0,
        targetY: 0,
        jitter: Math.random() * 0.02
      });
    }
    // Store base positions
    balls.forEach(b => {
      b.baseX = b.x;
      b.baseY = b.y;
    });
  }

  // Calculate stress from strain (conceptual S-curve)
  function calculateStress(strain) {
    const s = Math.abs(strain);
    
    if (s < 1.5) {
      // Initial modulus region: E ≈ 0.6 MPa
      return 0.6 * s;
    } else if (s < 5.5) {
      // Plateau region: gradual rise
      const base = 0.6 * 1.5; // ~0.9
      return base + 0.08 * (s - 1.5);
    } else {
      // Strain-induced crystallization upturn
      const base = 0.6 * 1.5 + 0.08 * 4; // ~1.22
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
    const h = Math.round(w * 0.75); // 4:3 aspect

    setupCanvas(macroCanvas, macroCtx, w, h);
    setupCanvas(microCanvas, microCtx, w, h);
    setupCanvas(curveCanvas, curveCtx, w, h);
  }

  // Draw Macro Canvas (tensile tester)
  function drawMacro(w, h) {
    const ctx = macroCtx;
    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, w, h);

    const strainFactor = state.isCompression ? -state.strain / 10 : state.strain / 10;
    
    // Grips
    const gripW = w * 0.15;
    const gripH = h * 0.12;
    const gripY = h * 0.4;
    
    // Top grip
    ctx.fillStyle = '#555';
    ctx.fillRect(w * 0.1, h * 0.08, gripW, gripH);
    
    // Bottom grip
    ctx.fillRect(w * 0.1, h * 0.8, gripW, gripH);

    // Specimen
    const specX = w * 0.1 + gripW * 0.25;
    const specW = gripW * 0.5;
    const specTopY = h * 0.08 + gripH;
    const specBottomY = h * 0.8;
    
    // Stretch/compress the specimen
    const baseHeight = specBottomY - specTopY;
    const stretchedHeight = baseHeight * (1 + strainFactor * 0.6);
    const newBottomY = specTopY + stretchedHeight;
    
    // Width changes inversely (Poisson effect)
    const widthFactor = 1 - strainFactor * 0.15;
    const newSpecW = specW * widthFactor;
    const specXOffset = (specW - newSpecW) / 2;

    // Specimen body
    ctx.fillStyle = state.isCompression ? '#e67e22' : '#3498db';
    ctx.fillRect(specX + specXOffset, specTopY, newSpecW, stretchedHeight);

    // Gauge section highlight
    const gaugeY = specTopY + stretchedHeight * 0.35;
    const gaugeH = stretchedHeight * 0.3;
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 2]);
    ctx.strokeRect(specX + specXOffset - 2, gaugeY, newSpecW + 4, gaugeH);
    ctx.setLineDash([]);

    // Zoom callout line to micro canvas
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(specX + specXOffset + newSpecW + 5, gaugeY + gaugeH / 2);
    ctx.lineTo(w * 0.85, gaugeY + gaugeH / 2);
    ctx.stroke();
    
    // Arrow
    ctx.beginPath();
    ctx.moveTo(w * 0.85, gaugeY + gaugeH / 2);
    ctx.lineTo(w * 0.82, gaugeY + gaugeH / 2 - 4);
    ctx.lineTo(w * 0.82, gaugeY + gaugeH / 2 + 4);
    ctx.closePath();
    ctx.fillStyle = '#e74c3c';
    ctx.fill();

    // Labels
    ctx.fillStyle = '#333';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Grip', w * 0.1 + gripW / 2, h * 0.06);
    ctx.fillText('Grip', w * 0.1 + gripW / 2, h * 0.96);
    
    // Force arrows
    const arrowX = w * 0.35;
    ctx.strokeStyle = '#2ecc71';
    ctx.lineWidth = 2;
    
    if (state.strain > 0.1) {
      // Top arrow (down force)
      ctx.beginPath();
      ctx.moveTo(arrowX, h * 0.05);
      ctx.lineTo(arrowX, h * 0.12);
      ctx.stroke();
      drawArrowHead(ctx, arrowX, h * 0.12, 'down');
      
      // Bottom arrow (up force in tension) or down in compression
      ctx.beginPath();
      ctx.moveTo(arrowX, h * 0.95);
      ctx.lineTo(arrowX, h * 0.88);
      ctx.stroke();
      drawArrowHead(ctx, arrowX, h * 0.88, 'up');
    }
  }

  function drawArrowHead(ctx, x, y, dir) {
    const size = 5;
    ctx.beginPath();
    if (dir === 'down') {
      ctx.moveTo(x, y);
      ctx.lineTo(x - size, y - size);
      ctx.lineTo(x + size, y - size);
    } else {
      ctx.moveTo(x, y);
      ctx.lineTo(x - size, y + size);
      ctx.lineTo(x + size, y + size);
    }
    ctx.closePath();
    ctx.fillStyle = '#2ecc71';
    ctx.fill();
  }

  // Draw Micro Canvas (balls representing polymer chains)
  function drawMicro(w, h) {
    const ctx = microCtx;
    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, w, h);

    // Border
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 2;
    ctx.strokeRect(5, 5, w - 10, h - 10);

    const strainFactor = state.isCompression ? -state.strain / 10 : state.strain / 10;
    const order = state.order;

    // Update ball positions
    balls.forEach((ball, i) => {
      // Affine deformation
      const deformedX = ball.baseX + (ball.baseX - 0.5) * strainFactor * 0.8;
      
      // As order increases, align into lanes
      const laneCount = 5;
      const laneY = (Math.floor(i / (NUM_BALLS / laneCount)) + 0.5) / laneCount;
      const targetY = ball.baseY * (1 - order) + laneY * order;
      
      // Jitter decreases with order
      const jitterAmount = ball.jitter * (1 - order * 0.9);
      const jitterX = Math.sin(state.time * 3 + i) * jitterAmount;
      const jitterY = Math.cos(state.time * 2.5 + i * 1.3) * jitterAmount;
      
      ball.x = deformedX + jitterX;
      ball.y = targetY + jitterY;
    });

    // Draw balls
    const ballRadius = Math.max(4, w * 0.025);
    balls.forEach((ball, i) => {
      const x = ball.x * (w - 20) + 10;
      const y = ball.y * (h - 20) + 10;
      
      // Color gradient based on order
      const hue = 200 + order * 60; // blue to purple
      ctx.fillStyle = `hsl(${hue}, 70%, 55%)`;
      
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw connecting lines at high order (chain segments)
      if (order > 0.5 && i > 0 && i % 8 !== 0) {
        const prevBall = balls[i - 1];
        const px = prevBall.x * (w - 20) + 10;
        const py = prevBall.y * (h - 20) + 10;
        ctx.strokeStyle = `hsla(${hue}, 70%, 45%, ${order * 0.5})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    });
  }

  // Draw Curve Canvas (stress-strain)
  function drawCurve(w, h) {
    const ctx = curveCtx;
    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);

    const padding = { left: 35, right: 10, top: 15, bottom: 30 };
    const plotW = w - padding.left - padding.right;
    const plotH = h - padding.top - padding.bottom;

    // Axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, h - padding.bottom);
    ctx.lineTo(w - padding.right, h - padding.bottom);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#333';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Strain (%)', w / 2, h - 5);
    
    ctx.save();
    ctx.translate(10, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Stress (MPa)', 0, 0);
    ctx.restore();

    // X-axis ticks (0, 250, 500, 750, 1000%)
    const xTicks = [0, 250, 500, 750, 1000];
    ctx.font = '8px sans-serif';
    xTicks.forEach(val => {
      const x = padding.left + (val / 1000) * plotW;
      ctx.fillText(val.toString(), x, h - padding.bottom + 12);
      ctx.beginPath();
      ctx.moveTo(x, h - padding.bottom);
      ctx.lineTo(x, h - padding.bottom + 3);
      ctx.stroke();
    });

    // Y-axis ticks (0, 1, 2, 3, 4 MPa)
    const yTicks = [0, 1, 2, 3, 4];
    ctx.textAlign = 'right';
    yTicks.forEach(val => {
      const y = h - padding.bottom - (val / 4) * plotH;
      ctx.fillText(val.toString(), padding.left - 5, y + 3);
      ctx.beginPath();
      ctx.moveTo(padding.left - 3, y);
      ctx.lineTo(padding.left, y);
      ctx.stroke();
    });

    // Draw the curve
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let s = 0; s <= 10; s += 0.1) {
      const stress = calculateStress(s);
      const x = padding.left + (s / 10) * plotW;
      const y = h - padding.bottom - (stress / 4) * plotH;
      
      if (s === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Current point
    const currentX = padding.left + (state.strain / 10) * plotW;
    const currentY = h - padding.bottom - (state.stress / 4) * plotH;
    
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Region labels
    ctx.font = '8px sans-serif';
    ctx.fillStyle = '#888';
    ctx.textAlign = 'center';
    
    // Initial modulus region
    ctx.fillText('Initial', padding.left + plotW * 0.08, padding.top + 15);
    ctx.fillText('modulus', padding.left + plotW * 0.08, padding.top + 24);
    
    // Plateau
    ctx.fillText('Plateau', padding.left + plotW * 0.35, padding.top + 45);
    
    // SIC region
    ctx.fillText('Strain-induced', padding.left + plotW * 0.78, padding.top + 20);
    ctx.fillText('crystallization', padding.left + plotW * 0.78, padding.top + 29);
  }

  // Animation loop
  let animationId = null;
  let lastTime = 0;

  function animate(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    if (state.isPlaying) {
      state.time += dt;
      
      // Auto-cycle strain
      state.strain += state.direction * dt * 1.2;
      
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
    const h = Math.round(w * 0.75);

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
    state.isPlaying = false;
    playBtn.textContent = '▶ Play';
  });

  modeToggle.addEventListener('change', (e) => {
    state.isCompression = e.target.checked;
    e.target.nextElementSibling.textContent = state.isCompression ? 'Compression' : 'Tension';
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
