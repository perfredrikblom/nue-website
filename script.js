// script.js
const { Engine, Render, World, Bodies, Body, Mouse, MouseConstraint, Runner } = Matter;

let engine, render, letters = [];

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

  // Ground
  const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 45, window.innerWidth * 2, 100, {
    isStatic: true,
    restitution: 0.68,
    render: { visible: false }
  });
  World.add(engine.world, ground);

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
  createLetter(0, 'assets/u.png', 0.00);
  createLetter(spacing, 'assets/e.png', -0.20);

  // Buttons - safe slot layout
  const baseY = window.innerHeight - 95;
  const slotWidth = (window.innerWidth - 80) / 4;
  let currentX = 40;

  ["TABLE", "VENUE", "SOCIAL", "MENU"].forEach(text => {
    const widthVar = 0.7 + Math.random() * 1.6;
    const heightVar = 0.8 + Math.random() * 1.4;
    const fontSize = 36 + Math.random() * 28;

    const svgWidth = Math.min(slotWidth * 0.98, slotWidth * widthVar);
    const svgHeight = 76 * heightVar;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", svgHeight);
    svg.style.left = currentX + 'px';
    svg.style.top = (baseY - svgHeight/2 + (Math.random() - 0.5) * 25) + 'px';
    svg.style.position = 'absolute';

    svg.innerHTML = `
      <text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle"
            fill="#D4A373" font-family="Inter, sans-serif" 
            font-size="${fontSize}" font-weight="700"
            transform="scale(${widthVar}, ${heightVar})">
        ${text}
      </text>
    `;

    document.body.appendChild(svg);

    const body = Bodies.rectangle(currentX + svgWidth/2, baseY, svgWidth, svgHeight, {
      isStatic: true,
      restitution: 0.68,
      render: { visible: false }
    });
    World.add(engine.world, body);

    svg.addEventListener('click', () => {
      if (text === "TABLE") window.open('https://octotable.com/book/restaurant/1000969/booking/new', '_blank');
      if (text === "VENUE") window.open('https://maps.google.com/?q=Utara,+Jl.+Pantai+Batu+Mejan+No.126,+Canggu,+Bali', '_blank');
      if (text === "SOCIAL") window.open('https://instagram.com/nue.bali', '_blank');
      if (text === "MENU") window.open('https://secure.guestpro.net/nue', '_blank');
    });

    currentX += slotWidth + 30;
  });

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