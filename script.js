// script.js
const { Engine, Render, World, Bodies, Body, Mouse, MouseConstraint } = Matter;

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
  const ground = Bodies.rectangle(
    window.innerWidth / 2, 
    window.innerHeight - 45, 
    window.innerWidth * 2, 
    100, 
    { isStatic: true, restitution: 0.68, render: { visible: false } }
  );
  World.add(engine.world, ground);

  letters = [];
  const centerX = window.innerWidth / 2;
  const scale = Math.min(1.05, window.innerWidth / 1200);

  const createLetter = (offset, texture) => {
    const body = Bodies.rectangle(centerX + offset * scale, 140, 135 * scale, 185 * scale, {
      restitution: 0.66,
      friction: 0.32,
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
  };

  createLetter(-195, 'assets/n.png');
  createLetter(0, 'assets/u.png');
  createLetter(195, 'assets/e.png');

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
      x: (Math.random() - 0.5) * 0.14,
      y: -0.24
    });
    Body.setAngularVelocity(closest, (Math.random() - 0.5) * 0.4);
  }
});

// Resize support
window.addEventListener('resize', initPhysics);