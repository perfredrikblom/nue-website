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

  const createButton = (baseX, text, width, height, id) => {
    const x = baseX + (Math.random() - 0.5) * 60;
    const y = baseY + (Math.random() - 0.5) * 25;
    const rotation = (Math.random() - 0.5) * 0.22;

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
    document.body.appendChild(btn);

    return { body, element: btn };
  };

  // Final 4 buttons
  const tableBtn = createButton(window.innerWidth * 0.15, "TABLE", 195, 72, 'btn-table');
  tableBtn.element.onclick = () => window.open('https://octotable.com/book/restaurant/1000969/booking/new', '_blank');

  const venueBtn = createButton(window.innerWidth * 0.38, "VENUE", 145, 55, 'btn-venue');
  venueBtn.element.onclick = () => window.open('https://maps.google.com/?q=Utara,+Jl.+Pantai+Batu+Mejan+No.126,+Canggu,+Bali', '_blank');

  const socialBtn = createButton(window.innerWidth * 0.60, "SOCIAL", 155, 65, 'btn-social');
  socialBtn.element.onclick = () => window.open('https://instagram.com/nue.bali', '_blank');

  const menuBtn = createButton(window.innerWidth * 0.82, "MENU", 160, 58, 'btn-menu');
  menuBtn.element.onclick = () => window.open('https://secure.guestpro.net/nue', '_blank');

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