// script.js
const { Engine, Render, World, Bodies, Body, Mouse, MouseConstraint, Runner } = Matter;

let engine, render, letters = [];

function initPhysics() {
  if (render) Render.stop(render);
  if (engine) Engine.clear(engine);

  engine = Engine.create();
  engine.gravity.y = 2.15;

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
    restitution: 0.65,
    render: { visible: false }
  });
  World.add(engine.world, ground);

  letters = [];
  const centerX = window.innerWidth / 2;
  const scale = Math.min(1.05, window.innerWidth / 1200);

  const spacing = 280 * scale;        // Bigger spacing = less interaction

  const createLetter = (offset, texture, initialRotation = 0) => {
    const body = Bodies.rectangle(centerX + offset, 130, 135 * scale, 185 * scale, {
      restitution: 0.52,           // Less bouncy = cleaner
      friction: 0.4,
      frictionAir: 0.018,          // Balanced air resistance
      angle: initialRotation,
      render: {
        sprite: { texture: texture, xScale: scale, yScale: scale }
      }
    });
    letters.push(body);
    World.add(engine.world, body);
  };

  createLetter(-spacing, 'assets/n.png', -0.08);
  createLetter(0,        'assets/u.png',  0.03);
  createLetter(spacing,  'assets/e.png', -0.06);

  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, { mouse: mouse });
  World.add(engine.world, mouseConstraint);

  Engine.run(engine);
  Render.run(render);
}

initPhysics();

// Initial drop - very controlled
setTimeout(() => {
  letters.forEach((letter, i) => {
    Body.setVelocity(letter, { 
      x: (i - 1) * 0.3,      // Almost zero sideways movement
      y: 9.0 
    });
  });
}, 200);

// Click behavior
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
  }
});

window.addEventListener('resize', initPhysics);