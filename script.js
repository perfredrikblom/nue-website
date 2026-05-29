// script.js
const { Engine, Render, World, Bodies, Body, Mouse, MouseConstraint, Runner } = Matter;

let engine, render;

// Create debug text function
function log(message) {
  const debug = document.getElementById('debug');
  debug.innerHTML += message + "<br>";
  console.log(message);
}

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

  log("Window size: " + window.innerWidth + " x " + window.innerHeight);

  // Ground
  const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 45, window.innerWidth * 2, 100, {
    isStatic: true,
    restitution: 0.68,
    render: { visible: false }
  });
  World.add(engine.world, ground);

  // === TABLE BUTTON DEBUG ===
  const margin = 40;
  const totalWidth = window.innerWidth - margin * 2;
  const slotWidth = totalWidth * 0.4;   // only one button for debug

  let attempts = 0;
  let svgWidth, svgHeight, widthVar, heightVar;

  do {
    attempts++;
    widthVar = 0.6 + Math.random() * 2.4;
    heightVar = 0.7 + Math.random() * 1.8;
    svgWidth = slotWidth * widthVar;
    svgHeight = 82 * heightVar;

    log(`Attempt ${attempts}: widthVar=${widthVar.toFixed(2)}, svgWidth=${svgWidth.toFixed(0)} (max allowed ${slotWidth.toFixed(0)})`);
  } while (svgWidth > slotWidth * 1.05 && attempts < 20);

  const x = margin + slotWidth / 2;
  const y = window.innerHeight - 110;

  log(`Final position: x=${x.toFixed(0)}, y=${y.toFixed(0)}, size=${svgWidth.toFixed(0)}x${svgHeight.toFixed(0)}`);

  // Visible frame
  const frame = document.createElement('div');
  frame.className = 'button-frame';
  frame.style.left = (x - svgWidth/2) + 'px';
  frame.style.top = (y - svgHeight/2) + 'px';
  frame.style.width = svgWidth + 'px';
  frame.style.height = svgHeight + 'px';
  document.body.appendChild(frame);

  // SVG text
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", svgWidth);
  svg.setAttribute("height", svgHeight);
  svg.style.left = (x - svgWidth/2) + 'px';
  svg.style.top = (y - svgHeight/2) + 'px';
  svg.style.position = 'absolute';

  svg.innerHTML = `
    <text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle"
          fill="#D4A373" font-family="Inter, sans-serif" 
          font-size="42" font-weight="700"
          transform="scale(${widthVar}, ${heightVar})">
      TABLE
    </text>
  `;

  document.body.appendChild(svg);

  const body = Bodies.rectangle(x, y, svgWidth, svgHeight, {
    isStatic: true,
    restitution: 0.68,
    render: { visible: false }
  });
  World.add(engine.world, body);

  // Letters for reference
  const scale = Math.min(1.05, window.innerWidth / 1200);
  const spacing = 280 * scale;
  const n = Bodies.rectangle(window.innerWidth/2 - spacing, 130, 135 * scale, 185 * scale, { restitution: 0.58, render: { sprite: { texture: 'assets/n.png', xScale: scale, yScale: scale } } });
  const u = Bodies.rectangle(window.innerWidth/2, 130, 135 * scale, 185 * scale, { restitution: 0.58, render: { sprite: { texture: 'assets/u.png', xScale: scale, yScale: scale } } });
  const e = Bodies.rectangle(window.innerWidth/2 + spacing, 130, 135 * scale, 185 * scale, { restitution: 0.58, render: { sprite: { texture: 'assets/e.png', xScale: scale, yScale: scale } } });

  World.add(engine.world, [n, u, e]);

  Runner.run(engine);
  Render.run(render);

  log("✅ Finished. Look at the visible frame around TABLE and the debug text above.");
}

initPhysics();

window.addEventListener('resize', initPhysics);