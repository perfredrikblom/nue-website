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

  const createSvgButton = (baseX, text, id) => {
    const x = baseX + (Math.random() - 0.5) * 60;
    const y = baseY + (Math.random() - 0.5) * 30;
    const rotation = (Math.random() - 0.5) * 0.3;

    // Random strong distortion
    const scaleX = 0.6 + Math.random() * 1.8;   // horizontal stretch
    const scaleY = 0.7 + Math.random() * 1.4;   // vertical stretch
    const fontSize = 42 + Math.random() * 28;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "220");
    svg.setAttribute("height", "80");
    svg.setAttribute("class", "svg-button");
    svg.style.left = (x - 110) + 'px';
    svg.style.top = (y - 40) + 'px';
    svg.style.transform = `rotate(${rotation * 18}deg)`;

    svg.innerHTML = `
      <text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" 
            fill="#D4A373" font-family="Inter, sans-serif" 
            font-size="${fontSize}" font-weight="700"
            transform="scale(${scaleX}, ${scaleY})">
        ${text}
      </text>
    `;

    document.body.appendChild(svg);

    // Physics body (for collision)
    const body = Bodies.rectangle(x, y, 180, 65, {
      isStatic: true,
      restitution: 0.68,
      friction: 0.4,
      angle: rotation,
      render: { visible: false }
    });
    World.add(engine.world, body);
    buttonBodies.push(body);

    svg.addEventListener('click', () => {
      if (id === 'btn-table') window.open('https://octotable.com/book/restaurant/1000969/booking/new', '_blank');
      if (id === 'btn-venue') window.open('https://maps.google.com/?q=Utara,+Jl.+Pantai+Batu+Mejan+No.126,+Canggu,+Bali', '_blank');
      if (id === 'btn-social') window.open('https://instagram.com/nue.bali', '_blank');
      if (id === 'btn-menu') window.open('https://secure.guestpro.net/nue', '_blank');
    });
  };

  createSvgButton(window.innerWidth * 0.15, "TABLE", 'btn-table');
  createSvgButton(window.innerWidth * 0.38, "VENUE", 'btn-venue');
  createSvgButton(window.innerWidth * 0.60, "SOCIAL", 'btn-social');
  createSvgButton(window.innerWidth * 0.82, "MENU", 'btn-menu');

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
  if (e.target.tagName === 'BUTTON' || e.target.closest('svg')) return;

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