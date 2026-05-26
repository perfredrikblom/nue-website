// script.js
let engine, render, letters = [], ground;

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

  // Ground at bottom
  ground = Bodies.rectangle(
    window.innerWidth / 2, 
    window.innerHeight - 45, 
    window.innerWidth * 2, 
    100, 
    { isStatic: true, restitution: 0.68, render: { visible: false } }
  );
  World.add(engine.world, ground);

  letters = [];
  const centerX = window.innerWidth / 2;
  const scale = Math.min(1.1, window.innerWidth / 1100);   // responsive scaling

  const createLetter = (offsetX, texture) => {
    const body = Bodies.rectangle(centerX + offsetX * scale, 130, 130 * scale, 180 * scale, {
      restitution: 0.65,
      friction: 0.28,
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

  createLetter(-190, 'assets/n.png');
  createLetter(0, 'assets/u.png');
  createLetter(190, 'assets/e.png');

  // Mouse / touch drag
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, { mouse: mouse });
  World.add(engine.world, mouseConstraint);

  Engine.run(engine);
  Render.run(render);
}

// Start
initPhysics();

// Initial natural drop
setTimeout(() => {
  letters.forEach((letter, i) => {
    Body.setVelocity(letter, { 
      x: (i - 1) * 2.2, 
      y: 7.5 
    });
  });
}, 300);

// Click → push only closest letter
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
      y: -0.23
    });
    Body.setAngularVelocity(closest, (Math.random() - 0.5) * 0.4);
  }
});

// Resize support
window.addEventListener('resize', initPhysics);