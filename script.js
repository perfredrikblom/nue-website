// script.js
const { Engine, Render, World, Bodies, Body, Mouse, MouseConstraint, Runner } = Matter;

let engine, render, letters = [];

function initPhysics() {
  if (render) Render.stop(render);
  if (engine) Engine.clear(engine);

  engine = Engine.create();
  engine.gravity.y = 2.1;

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
    restitution: 0.65,
    render: { visible: false }
  });
  World.add(engine.world, ground);

  letters = [];
  const centerX = window.innerWidth / 2;
  const scale = Math.min(1.05, window.innerWidth / 1200);

  const spacing = 220 * scale;      // Increased spacing to reduce interaction
  const startHeight = 130;

  const createLetter = (offset, texture, initialRotation = 0) => {
    const body = Bodies.rectangle(centerX + offset, startHeight, 135 * scale, 185 * scale, {
      restitution: 0.58,           // Slightly less bouncy
      friction: 0.4,               // More friction
      frictionAir: 0.015,          // Air resistance → straighter fall
      angle: initialRotation,
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

  createLetter(-spacing, 'assets/n.png', -0.12);
  createLetter(0,        'assets/u.png',  0.05);
  createLetter(spacing,  'assets/e.png', -0.08);

  // Mouse drag
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, { mouse: mouse });
  World.add(engine.world, mouseConstraint);

  Engine.run(engine);
  Render.run(render);
}

// Initialize
initPhysics();

// Initial drop - much straighter down
setTimeout(() => {
  letters.forEach((letter, i) => {
    Body.setVelocity(letter, { 
      x: (i - 1) * 0.8,     // Reduced horizontal velocity
      y: 9.5 
    });
  });
}, 200);

// Click → push closest
document.addEventListener('click', (e) => {
  let closest = null;
  let minDist = Infinity;

  letters.forEach(letter => {
    const dx = letter.position.x - e.clientX;
    const dy = letter.position.y - e.clientY;
    const dist = dx*dx + dy*dy;
    if (dist < minDist) {
      minDist = dist;
      closest = letter;
    }
  });

  if (closest) {
    Body.applyForce(closest, closest.position, {
      x: (Math.random() - 0.5) * 0.12,
      y: -0.22
    });
    Body.setAngularVelocity(closest, (Math.random() - 0.5) * 0.35);
  }
});

// Resize
window.addEventListener('resize', initPhysics);