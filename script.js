// script.js
let engine, render, letters = [], ground;

function initPhysics() {
  if (render) Render.stop(render);
  if (engine) Engine.clear(engine);

  engine = Engine.create();
  engine.gravity.y = 2.0;

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
  ground = Bodies.rectangle(
    window.innerWidth / 2, 
    window.innerHeight - 40, 
    window.innerWidth * 2, 
    100, 
    { isStatic: true, restitution: 0.65, render: { visible: false } }
  );
  World.add(engine.world, ground);

  letters = [];
  const centerX = window.innerWidth / 2;
  const scale = Math.min(1.0, window.innerWidth / 1400); // responsive scaling

  const createLetter = (offsetX, texture) => {
    const body = Bodies.rectangle(centerX + offsetX, 140, 130 * scale, 180 * scale, {
      restitution: 0.62,
      friction: 0.3,
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

  createLetter(-180 * scale, 'assets/n.png');
  createLetter(0, 'assets/u.png');
  createLetter(180 * scale, 'assets/e.png');

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
      x: (i - 1) * 2.5, 
      y: 9 
    });
  });
}, 300);

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
      x: (Math.random() - 0.5) * 0.13,
      y: -0.22
    });
  }
});

// Resize handling
window.addEventListener('resize', () => {
  initPhysics();
});