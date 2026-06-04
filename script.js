// script.js - NUE (clean version)
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
      background: '#f8f9fa'
    }
  });

  // Thin safety ground at very bottom
  const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 26, window.innerWidth * 2, 52, {
    isStatic: true,
    restitution: 0.55,
    render: { visible: false }
  });
  World.add(engine.world, ground);

  // === 4 BUTTONS ===
  const margin = 20;
  const totalWidth = window.innerWidth - margin * 2;

  const buttonsData = [
    { text: "VENUE",  link: "https://instagram.com/nue.bali" },
    { text: "TABLE",  link: "https://octotable.com/book/restaurant/1000969/booking/new" },
    { text: "SOCIAL", link: "https://instagram.com/nue.bali" },
    { text: "MENU",   link: "https://secure.guestpro.net/nue" }
  ];

  // Proportional widths with small random variation
  let proportions = [0.245, 0.235, 0.265, 0.255];
  proportions = proportions.map(p => p * (0.93 + Math.random() * 0.14));
  const sumP = proportions.reduce((a, b) => a + b, 0);
  proportions = proportions.map(p => p / sumP);

  let currentX = margin;

  buttonsData.forEach((btn, index) => {
    const slotWidth = totalWidth * proportions[index];

    // Safe button size within the slot (prevents overlap)
    const buttonWidth = slotWidth * (0.82 + Math.random() * 0.28); // 82% – 110% of slot
    const buttonHeight = 72 + Math.random() * 38;                  // reasonable height range

    const x = currentX + slotWidth / 2;
    const y = window.innerHeight - buttonHeight / 2;

    // Distortion values for text only (kept moderate to avoid overflow)
    const distortX = 0.82 + Math.random() * 0.55;
    const distortY = 0.85 + Math.random() * 0.45;
    const slant = (Math.random() - 0.5) * 26;

    // SVG Button (transparent background + colored distorted text)
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", buttonWidth);
    svg.setAttribute("height", buttonHeight);
    svg.style.left = (x - buttonWidth / 2) + "px";
    svg.style.top = (y - buttonHeight / 2) + "px";
    svg.style.position = "absolute";
    svg.style.zIndex = "10";
    svg.style.background = "transparent";

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute(
      "transform",
      `translate(${buttonWidth / 2}, ${buttonHeight / 2}) scale(${distortX}, ${distortY}) skewX(${slant})`
    );

    const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textEl.setAttribute("x", "0");
    textEl.setAttribute("y", "0");
    textEl.setAttribute("text-anchor", "middle");
    textEl.setAttribute("dominant-baseline", "middle");
    textEl.setAttribute("fill", "#0A3D2B");
    textEl.setAttribute("font-family", "Inter, system-ui, sans-serif");
    textEl.setAttribute("font-size", (buttonHeight * 0.90).toFixed(0));
    textEl.setAttribute("font-weight", "700");
    textEl.textContent = btn.text;

    g.appendChild(textEl);
    svg.appendChild(g);
    document.body.appendChild(svg);

    // Static physics body
    const body = Bodies.rectangle(x, y, buttonWidth, buttonHeight, {
      isStatic: true,
      restitution: 0.58,
      friction: 0.7,
      render: { visible: false }
    });
    World.add(engine.world, body);

    svg.addEventListener("click", () => {
      window.open(btn.link, "_blank");
    });

    currentX += slotWidth + 14; // small clean gap
  });

  // N U E letters
  const scale = Math.min(0.72, window.innerWidth / 1200);
  const spacing = 320 * scale;
  const letterY = 108;
  const letterW = 210 * scale;
  const letterH = 280 * scale;

  const letterBodies = [];

  const makeLetter = (ox, tex) => {
    const b = Bodies.rectangle(
      window.innerWidth / 2 + ox,
      letterY + (Math.random() - 0.5) * 30,
      letterW,
      letterH,
      {
        restitution: 0.5,
        friction: 0.52,
        frictionAir: 0.012,
        render: { sprite: { texture: `assets/${tex}.png`, xScale: scale, yScale: scale } }
      }
    );
    letterBodies.push(b);
    return b;
  };

  World.add(engine.world, [
    makeLetter(-spacing, "n"),
    makeLetter(0, "u"),
    makeLetter(spacing, "e")
  ]);

  // Mouse / touch drag
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, { mouse: mouse });
  World.add(engine.world, mouseConstraint);

  Runner.run(engine);
  Render.run(render);

  // Cleanup letters that fall off screen
  setInterval(() => {
    for (let i = letterBodies.length - 1; i >= 0; i--) {
      if (letterBodies[i].position.y > window.innerHeight + 130) {
        World.remove(engine.world, letterBodies[i]);
        letterBodies.splice(i, 1);
      }
    }
  }, 600);
}

initPhysics();

// Reload on resize (refreshes random button shapes and positions)
window.addEventListener("resize", () => location.reload());
