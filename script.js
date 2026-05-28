// script.js
const { Engine, Render, World, Bodies, Body, Mouse, MouseConstraint, Runner } = Matter;

let engine, render, letters = [], buttonBodies = [];

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

  // Create physics buttons (different sizes)
  buttonBodies = [];

  const createButton = (x, y, width, height, text, color = '#ffffff') => {
    const body = Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      restitution: 0.7,
      friction: 0.4,
      render: { visible: false }
    });
    World.add(engine.world, body);
    buttonBodies.push(body);

    // Visual button
    const btn = document.createElement('button');
    btn.className = 'button';
    btn.textContent = text;
    btn.style.left = (x - width/2) + 'px';
    btn.style.top = (y - height/2) + 'px';
    btn.style.width = width + 'px';
    btn.style.background = color;
    document.body.appendChild(btn);

    return body;
  };

  const centerY = window.innerHeight - 90;

  createButton(window.innerWidth * 0.18, centerY, 260, 158, "Reserve", "#D4A373");
  createButton(window.innerWidth * 0.42, centerY, 130, 52, "Menu");
  createButton(window.innerWidth * 0.65, centerY, 180, 62, "About NUE");
  createButton(window.innerWidth * 0.88, centerY, 110, 48, "Contact");

  // Letters
  letters = [];
  const centerX = window.innerWidth / 2;
  const scale = Math.min(1.05, window.innerWidth / 1200);
  const spacing = 280 * scale;

  const createLetter = (offset, texture, rotation = 0) => {
    const body = Bodies.rectangle(centerX + offset, 130, 135 * scale, 185 * scale, {
      restitution: 0.58,
      friction: 0.4,
      frictionAir: 0.018,
      angle: rotation,
      render: {
        sprite: { texture: texture, xScale: scale, yScale: scale }
      }
    });
    letters.push(body);
    World.add(engine.world, body);
  };

  createLetter(-spacing, 'assets/n.png', -0.25);
  createLetter(0,        'assets/u.png',  0.00);
  createLetter(spacing,  'assets/e.png', -0.20);

  // Mouse drag
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, { mouse: mouse });
  World.add(engine.world, mouseConstraint);

  Runner.run(engine);
  Render.run(render);
}

initPhysics();

// Initial drop
setTimeout(() => {
  letters.forEach((letter, i) => {
    Body.setVelocity(letter, { x: (i - 1) * 0.4, y: 9.2 });
  });
}, 200);

// Click push closest letter
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
  }
});

window.addEventListener('resize', initPhysics);