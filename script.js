// script.js
let engine, render, letters = [], ground;

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

  // Ground - always at bottom
  ground = Bodies.rectangle(
    window.innerWidth / 2, 
    window.innerHeight - 40, 
    window.innerWidth * 2, 
    100, 
    { isStatic: true, restitution: 0.65, render: { visible: false } }
  );
  World.add(engine.world, ground);

  // Clear old letters
  letters.forEach(l => World.remove(engine.world, l));
  letters = [];

  const centerX = window.innerWidth / 2;
  const spacing = Math.min(160, window.innerWidth / 4);

  // Create / Recreate letters centered
  const createLetter = (offsetX, texture) => {
    const body = Bodies.rectangle(centerX + offsetX, 120, 130, 180, {
      restitution: 0.62,
      friction: 0.3,
      render: {
        sprite: { texture: texture, xScale: 1, yScale: 1 }
      }
    });
    letters.push(body);
    World.add(engine.world, body);
  };

  createLetter(-spacing, 'assets/n.png');
  createLetter(0, 'assets/u.png');
  createLetter(spacing, 'assets/e.png');

  // Mouse drag
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, { mouse: mouse });
  World.add(engine.world, mouseConstraint);

  Engine.run(engine);
  Render.run(render);
}

// Initial setup
initPhysics();

// Initial drop
setTimeout(() => {
  letters.forEach((letter, i) => {
    Body.setVelocity(letter, { 
      x: (i - 1) * 2, 
      y: 8 + Math.random() * 4 
    });
  });
}, 300);

// Click → push closest letter
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
      y: -0.21
    });
    Body.setAngularVelocity(closest, (Math.random() - 0.5) * 0.45);
  }
});

// Handle window resize properly
window.addEventListener('resize', () => {
  initPhysics();
});