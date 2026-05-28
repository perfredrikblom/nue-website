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

  const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 45, window.innerWidth * 2, 100, {
    isStatic: true,
    restitution: 0.68,
    render: { visible: false }
  });
  World.add(engine.world, ground);

  letters = [];
  const centerX = window.innerWidth / 2;
  const scale = Math.min(1.05, window.innerWidth / 1200);

  const spacing = 260 * scale;        // ← Increased spacing to reduce collisions
  const startHeight = 130;

  const createLetter = (offset, texture, initialRotation = 0) => {
    const body = Bodies.rectangle(centerX + offset, startHeight, 135 * scale, 185 * scale, {
      restitution: 0.55,            // Lowered for cleaner fall
      friction: 0.35,
      frictionAir: 0.025,           // Higher air resistance = straighter fall
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

  createLetter(-spacing, 'assets/n.png', -0.10);
  createLetter(0,        'assets/u.png',  0.04);
  createLetter(spacing,  'assets/e.png', -0.07);

  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, { mouse: mouse });
  World.add(engine.world, mouseConstraint);

  Engine.run(engine);
  Render.run(render);
}

initPhysics();

// Initial drop - very straight down
setTimeout(() => {
  letters.forEach((letter, i) => {
    Body.setVelocity(letter, { 
      x: (i - 1) * 0.4,     // Almost zero horizontal velocity
      y: 9.2 
    });
  });
}, 200);

// Click behavior unchanged
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
      x: (Math.random() - 0.5) * 0.13,
      y: -0.23
    });
    Body.setAngularVelocity(closest, (Math.random() - 0.5) * 0.4);
  }
});

window.addEventListener('resize', initPhysics);