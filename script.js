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
  const margin = 30;
  const totalWidth = window.innerWidth - margin * 2;
  const slotWidth = totalWidth / 4;
  const baseY = window.innerHeight - 95;

  const texts = ["TABLE", "VENUE", "SOCIAL", "MENU"];

  texts.forEach((text) => {
    let attempts = 0;
    let svgWidth, svgHeight, widthVar, heightVar;

    // Retry loop until it fits safely
    do {
      attempts++;
      widthVar = 0.65 + Math.random() * 2.1;   // very strong variation
      heightVar = 0.75 + Math.random() * 1.8;
      svgWidth = slotWidth * widthVar;
      svgHeight = 78 * heightVar;
    } while (svgWidth > slotWidth * 1.02 && attempts < 30);   // safety retry

    const x = margin + slotWidth * (texts.indexOf(text) + 0.5);
    const y = baseY + (Math.random() - 0.5) * 32;
    const rotation = (Math.random() - 0.5) * 0.32;
    const slant = (Math.random() - 0.5) * 32;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", svgHeight);
    svg.style.left = (x - svgWidth/2) + 'px';
    svg.style.top = (y - svgHeight/2) + 'px';
    svg.style.position = 'absolute';
    svg.style.transform = `rotate(${rotation * 18}deg)`;

    svg.innerHTML = `
      <text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle"
            fill="#D4A373" font-family="Inter, sans-serif" 
            font-size="${36 + Math.random() * 32}" font-weight="700"
            transform="scale(${widthVar}, ${heightVar}) skewX(${slant})">
        ${text}
      </text>
    `;

    document.body.appendChild(svg);

    const body = Bodies.rectangle(x, y, svgWidth, svgHeight, {
      isStatic: true,
      restitution: 0.68,
      friction: 0.4,
      angle: rotation,
      render: { visible: false }
    });
    World.add(engine.world, body);
    buttonBodies.push(body);

    svg.addEventListener('click', () => {
      if (text === "TABLE") window.open('https://octotable.com/book/restaurant/1000969/booking/new', '_blank');
      if (text === "VENUE") window.open('https://maps.google.com/?q=Utara,+Jl.+Pantai+Batu+Mejan+No.126,+Canggu,+Bali', '_blank');
      if (text === "SOCIAL") window.open('https://instagram.com/nue.bali', '_blank');
      if (text === "MENU") window.open('https://secure.guestpro.net/nue', '_blank');
    });
  });

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
      render: { sprite: { texture: texture, xScale: scale, yScale: scale } }
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
  if (e.target.closest('svg')) return;

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
    Body.applyForce(closest, closest.position, { x: (Math.random() - 0.5) * 0.13, y: -0.23 });
  }
});

window.addEventListener('resize', initPhysics);