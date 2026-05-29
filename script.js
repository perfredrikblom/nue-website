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
  const buttons = [
    { text: "TABLE",   id: "btn-table",   baseWidth: 195 },
    { text: "VENUE",   id: "btn-venue",   baseWidth: 145 },
    { text: "SOCIAL",  id: "btn-social",  baseWidth: 155 },
    { text: "MENU",    id: "btn-menu",    baseWidth: 160 }
  ];

  let currentX = window.innerWidth * 0.08;   // start from left with margin

  buttons.forEach(btnData => {
    // Strong random typography
    const widthVar = 55 + Math.random() * 85;     // strong elongation / condensation
    const weight = 500 + Math.random() * 400;
    const fontSize = 1.1 + Math.random() * 0.55;
    const yOffset = (Math.random() - 0.5) * 38;
    const rotation = (Math.random() - 0.5) * 0.25;

    const width = btnData.baseWidth * (0.8 + Math.random() * 0.6);
    const height = 58 + Math.random() * 22;

    // Create physics body
    const body = Bodies.rectangle(currentX + width/2, baseY + yOffset, width, height, {
      isStatic: true,
      restitution: 0.68,
      friction: 0.4,
      angle: rotation,
      render: { visible: false }
    });
    World.add(engine.world, body);
    buttonBodies.push(body);

    // Visual button
    const btn = document.createElement('button');
    btn.id = btnData.id;
    btn.className = 'physics-button';
    btn.textContent = btnData.text;
    btn.style.left = (currentX) + 'px';
    btn.style.top = (baseY + yOffset - height/2) + 'px';
    btn.style.width = width + 'px';
    btn.style.fontSize = fontSize + 'rem';
    btn.style.fontVariationSettings = `"wght" ${weight}, "wdth" ${widthVar}`;
    btn.style.transform = `rotate(${rotation * 18}deg)`;
    document.body.appendChild(btn);

    // Move to next position
    currentX += width + 25;   // spacing between buttons
  });

  // Letters (unchanged)
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