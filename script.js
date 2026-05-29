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

  buttonBodies = [];
  const baseY = window.innerHeight - 85;

  const createButton = (baseX, text, id) => {
    // Strong random variation
    const x = baseX + (Math.random() - 0.5) * 40;
    const y = baseY + (Math.random() - 0.5) * 30;
    const rotation = (Math.random() - 0.5) * 0.22;

    const wdth = 55 + Math.random() * 95;     // Very strong elongation/condensation
    const wght = 500 + Math.random() * 400;
    const fontSize = 1.05 + Math.random() * 0.65;

    const width = 130 + Math.random() * 110;
    const height = 48 + Math.random() * 28;

    const body = Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      restitution: 0.68,
      friction: 0.4,
      angle: rotation,
      render: { visible: false }
    });
    World.add(engine.world, body);
    buttonBodies.push(body);

    const btn = document.createElement('button');
    btn.id = id;
    btn.className = 'physics-button';
    btn.textContent = text;
    btn.style.left = (x - width/2) + 'px';
    btn.style.top = (y - height/2) + 'px';
    btn.style.width = width + 'px';
    btn.style.fontSize = fontSize + 'rem';
    btn.style.fontVariationSettings = `"wdth" ${wdth}, "wght" ${wght}`;
    btn.style.transform = `rotate(${rotation * 18}deg)`;
    document.body.appendChild(btn);

    return { body, element: btn };
  };

  createButton(window.innerWidth * 0.14, "TABLE", 'btn-table');
  createButton(window.innerWidth * 0.37, "VENUE", 'btn-venue');
  createButton(window.innerWidth * 0.60, "SOCIAL", 'btn-social');
  createButton(window.innerWidth * 0.83, "MENU", 'btn-menu');

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

// Click push closest
document.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') return;

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