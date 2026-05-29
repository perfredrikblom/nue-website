// script.js
const { Engine, Render, World, Bodies, Body, Mouse, MouseConstraint, Runner } = Matter;

let engine, render;

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

  // Ground for letters
  const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 45, window.innerWidth * 2, 100, {
    isStatic: true,
    restitution: 0.68,
    render: { visible: false }
  });
  World.add(engine.world, ground);

  // === TABLE BUTTON DEBUG ===
  const buttonWidth = 220;
  const buttonHeight = 82;
  const marginBottom = 20;   // distance from window bottom

  // Calculation
  const x = window.innerWidth / 2;
  const y = window.innerHeight - marginBottom - buttonHeight / 2;   // align lower edge

  const debugText = `
    Window height: ${window.innerHeight}<br>
    Button height: ${buttonHeight}<br>
    Margin bottom: ${marginBottom}<br>
    Calculated y (center): ${y.toFixed(1)}<br>
    Lower edge should be at: ${y + buttonHeight/2} = window bottom - margin<br>
    → Should be perfectly aligned now
  `;

  document.getElementById('debug').innerHTML = debugText;

  // Visible frame (red border)
  const frame = document.createElement('div');
  frame.style.position = 'absolute';
  frame.style.left = (x - buttonWidth/2) + 'px';
  frame.style.top = (y - buttonHeight/2) + 'px';
  frame.style.width = buttonWidth + 'px';
  frame.style.height = buttonHeight + 'px';
  frame.style.border = '4px solid #ff3366';
  frame.style.boxSizing = 'border-box';
  frame.style.pointerEvents = 'none';
  document.body.appendChild(frame);

  // SVG text
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", buttonWidth);
  svg.setAttribute("height", buttonHeight);
  svg.style.left = (x - buttonWidth/2) + 'px';
  svg.style.top = (y - buttonHeight/2) + 'px';
  svg.style.position = 'absolute';

  svg.innerHTML = `
    <text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle"
          fill="#D4A373" font-family="Inter, sans-serif" 
          font-size="48" font-weight="700">
      TABLE
    </text>
  `;

  document.body.appendChild(svg);

  // Physics body
  const body = Bodies.rectangle(x, y, buttonWidth, buttonHeight, {
    isStatic: true,
    restitution: 0.68,
    render: { visible: false }
  });
  World.add(engine.world, body);

  // Letters
  const scale = Math.min(1.05, window.innerWidth / 1200);
  const spacing = 280 * scale;
  const n = Bodies.rectangle(window.innerWidth/2 - spacing, 130, 135 * scale, 185 * scale, { restitution: 0.58, render: { sprite: { texture: 'assets/n.png', xScale: scale, yScale: scale } } });
  const u = Bodies.rectangle(window.innerWidth/2, 130, 135 * scale, 185 * scale, { restitution: 0.58, render: { sprite: { texture: 'assets/u.png', xScale: scale, yScale: scale } } });
  const e = Bodies.rectangle(window.innerWidth/2 + spacing, 130, 135 * scale, 185 * scale, { restitution: 0.58, render: { sprite: { texture: 'assets/e.png', xScale: scale, yScale: scale } } });

  World.add(engine.world, [n, u, e]);

  Runner.run(engine);
  Render.run(render);

  log("✅ Button should now be aligned to bottom edge.");
}

function log(msg) {
  const d = document.getElementById('debug');
  d.innerHTML += msg + "<br>";
}

initPhysics();

window.addEventListener('resize', initPhysics);