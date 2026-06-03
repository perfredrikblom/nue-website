// script.js - NUE (exact 4-button layout as requested + random text shape inside fixed buttons)
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

  // Thin safety ground
  const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 26, window.innerWidth * 2, 52, {
    isStatic: true,
    restitution: 0.55,
    render: { visible: false }
  });
  World.add(engine.world, ground);

  // =====================================================
  // STEP 1: Pre-calculate 4 sets of base values (once)
  // =====================================================
  const w = window.innerWidth;
  const h = window.innerHeight;

  // Set 1 (VENUE)
  const set1w = w * 0.25 * (0.9 + Math.random() * 0.2);
  const set1h = h * 0.10 * (1.0 + Math.random() * 0.10);

  // Set 2 (TABLE)
  const set2w = w * 0.25 * (0.9 + Math.random() * 0.2);
  const set2h = h * 0.10 * (1.0 + Math.random() * 0.10);

  // Set 3 (SOCIAL)
  const set3w = w * 0.25 * (0.9 + Math.random() * 0.2);
  const set3h = h * 0.10 * (1.0 + Math.random() * 0.10);

  // Set 4 (MENU) – remaining width
  const set4w = w - set1w - set2w - set3w;
  const set4h = h * 0.10 * (1.0 + Math.random() * 0.10);

  // Debug
  const debug = document.getElementById('debug');
  debug.innerHTML = `
    <strong>Exact 4-Button Layout (your spec)</strong><br><br>
    Window: ${w} × ${h}px<br><br>
    Set1 (VENUE):  w=${set1w.toFixed(1)}  h=${set1h.toFixed(1)}<br>
    Set2 (TABLE):  w=${set2w.toFixed(1)}  h=${set2h.toFixed(1)}<br>
    Set3 (SOCIAL): w=${set3w.toFixed(1)}  h=${set3h.toFixed(1)}<br>
    Set4 (MENU):   w=${set4w.toFixed(1)}  h=${set4h.toFixed(1)}<br><br>
    <span style="color:#7CFF7C">✅ Base values calculated first • Buttons use exact sets • Text distorted inside</span>
  `;

  // =====================================================
  // STEP 2: Create buttons using the pre-calculated sets
  // =====================================================
  const buttonsData = [
    { setW: set1w, setH: set1h, text: "VENUE",  link: "https://instagram.com/nue.bali" },
    { setW: set2w, setH: set2h, text: "TABLE",  link: "https://octotable.com/book/restaurant/1000969/booking/new" },
    { setW: set3w, setH: set3h, text: "SOCIAL", link: "https://instagram.com/nue.bali" },
    { setW: set4w, setH: set4h, text: "MENU",   link: "https://secure.guestpro.net/nue" }
  ];

  let currentX = 0;

  buttonsData.forEach((b, i) => {
    const buttonWidth = b.setW;
    const buttonHeight = b.setH;

    const x = currentX + buttonWidth / 2;
    const y = h - buttonHeight / 2;     // lower edge exactly at window bottom (0 margin)

    // Colored button
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", buttonWidth);
    svg.setAttribute("height", buttonHeight);
    svg.style.left = (x - buttonWidth / 2) + "px";
    svg.style.top = (y - buttonHeight / 2) + "px";
    svg.style.position = "absolute";
    svg.style.zIndex = "10";

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", "0");
    rect.setAttribute("y", "0");
    rect.setAttribute("width", buttonWidth);
    rect.setAttribute("height", buttonHeight);
    rect.setAttribute("rx", "12");
    rect.setAttribute("ry", "12");
    rect.setAttribute("fill", "#D4A373");

    // =====================================================
    // STEP 3: Random text distortion INSIDE the already-fixed button size
    // =====================================================
    const textW = buttonWidth * 0.90;
    const textH = buttonHeight * 0.88;
    const distortX = textW / 185;
    const distortY = textH / 68;
    const slant = (Math.random() - 0.5) * 26;

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
    textEl.setAttribute("font-size", "42");
    textEl.setAttribute("font-weight", (620 + Math.random() * 380).toFixed(0));
    textEl.textContent = b.text;

    g.appendChild(textEl);
    svg.appendChild(rect);
    svg.appendChild(g);
    document.body.appendChild(svg);

    // Static physics body (letters can land on it)
    const body = Bodies.rectangle(x, y, buttonWidth, buttonHeight, {
      isStatic: true,
      restitution: 0.58,
      friction: 0.7,
      render: { visible: false }
    });
    World.add(engine.world, body);

    svg.addEventListener("click", () => {
      window.open(b.link, "_blank");
    });

    currentX += buttonWidth;
  });

  // N U E letters (fall, hit buttons or fall off bottom)
  const scale = Math.min(1.05, window.innerWidth / 1200);
  const spacing = 245 * scale;
  const letterY = 108;
  const letterW = 124 * scale;
  const letterH = 168 * scale;

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
        frictionAir: 0.011,
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

  // Mouse drag
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, { mouse: mouse });
  World.add(engine.world, mouseConstraint);

  Runner.run(engine);
  Render.run(render);

  // Remove letters that fall off bottom
  setInterval(() => {
    for (let i = letterBodies.length - 1; i >= 0; i--) {
      if (letterBodies[i].position.y > window.innerHeight + 120) {
        World.remove(engine.world, letterBodies[i]);
        letterBodies.splice(i, 1);
      }
    }
  }, 550);

  console.log("%c[NUE] Exact 4-button layout (your spec) + text inside fixed sizes", "color:#7CFF7C");
}

initPhysics();

window.addEventListener("resize", () => location.reload());
