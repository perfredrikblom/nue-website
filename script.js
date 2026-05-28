// script.js
const { Engine, Render, World, Bodies, Body, Mouse, MouseConstraint, Runner } = Matter;

let engine, render, letters = [];

function initPhysics() {
  if (render) Render.stop(render);
  if (engine) Engine.clear(engine);

  engine = Engine.create();
  engine.gravity.y = 2.05;

  render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: window.innerWidth,
      height: window.innerHeight,
      wireframes: false,
      background: '#0A3D2B'
    }
  });

  // Ground
  const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 45, window.innerWidth * 2, 100, {
    isStatic: true,
    restitution: 0.68,
    render: { visible: false }
  });
  World.add(engine.world, ground);

  letters = [];
  const centerX = window.innerWidth / 2;
  const scale = Math.min(1.05, window.innerWidth / 1200);

  // ================== CONTROLS ==================
  const spacing = 195 * scale;           // ← Change this to control horizontal spacing
  const startHeight = 130;               // ← Vertical starting height
  // =============================================

  const createLetter = (offset, texture, initialRotation = 0) => {
    const body = Bodies.rectangle(centerX + offset, startHeight, 135 * scale, 185 * scale, {
      restitution: 0.66,
      friction: 0.32,
      angle: initialRotation,               // Initial rotation in radians
      render: {
        sprite: {
          texture: texture,
          xScale: scale,
          yScale: scale
        }
      }
    });
    letters.push(body);
    World.add(engine.world, body);
    return body;
  };

  // Create letters with individual starting rotation
  createLetter(-spacing, 'assets/n.png', -0.15);   // N slightly rotated left
  createLetter(0,        'assets/u.png',  0.08);   // U slightly rotated right
  createLetter(spacing,  'assets/e.png', -0.10);   // E slightly rotated left

  // Mouse drag
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, { mouse: mouse });
  World.add(engine.world, mouseConstraint);

  Engine.run(engine);
  Render.run(render);
}

// Initialize
initPhysics();

// Initial drop
setTimeout(() => {
  letters.forEach((letter, i) => {
    Body.setVelocity(letter, { 
      x: (i - 1) * 2.8, 
      y: 8.5 
    });
  });
}, 200);

// Click → push closest
document.addEventListener('click', (e) => {
  let closest = null;
  let minDist = Infinity;

  letters.forEach