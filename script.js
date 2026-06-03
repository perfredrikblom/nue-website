// script.js - NUE (4 colored buttons at bottom, random shaped text, letters fall & collide)
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

  // Ground (thin safety net)
  const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 28, window.innerWidth * 2, 56, {
    isStatic: true,
    restitution: 0.55,
    render: { visible: false }
  });
  World.add(engine.world, ground);

  // === 4 BUTTONS: ~25% width each, colored, 0 margin bottom, strong random text shape ===
  const margin = 20;
  const totalWidth = window.innerWidth - margin * 2;
  const baseY = window.innerHeight - 86;   // lower edge very close to window bottom

  const buttons = [
    { text: "TABLE",   link: "https://octotable.com/book/restaurant/1000969/booking/new" },
    { text: "VENUE",   link: "https://maps.google.com/?q=Utara,+Jl.+Pantai+Batu+Mejan+No.126,+Canggu,+Bali" },
    { text: "SOCIAL",  link: "https://instagram.com/nue.bali" },
    { text: "MENU",    link: "https://secure.guestpro.net/nue" }
  ];

  // Proportional widths (sum ~100%, small random each load)
  let proportions = [0.245, 0.235, 0.265, 0.255];
  proportions = proportions.map(p => p * (0.93 + Math.random() * 0.14));
  const sumP = proportions.reduce((a, b) => a + b, 0);
  proportions = proportions.map(p => p / sumP);

  let currentX = margin;

  buttons.forEach((btn, i) => {
    const slotWidth = totalWidth * proportions[i];

    // Random size + strong distortion (text still fits well)
    const widthVar = 0.70 + Math.random() * 0.90;    // 0.70x – 1.60x (condensation/expansion)
    const heightVar = 0.76 + Math.random() * 0.78;   // 0.76x – 1.54x (height)
    const slant = (Math.random() - 0.5) * 30;        // +/- 15°
    const rot = (Math.random() - 0.5) * 0.16;

    const buttonWidth = slotWidth * widthVar * 0.96;
    const buttonHeight = 76 * heightVar;

    const x = currentX + slotWidth / 2;
    const y = baseY - buttonHeight / 2;   // lower edge touches bottom (0 margin)

    // Colored button (rounded rect + randomly shaped text)
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
    rect.setAttribute("rx", "13");
    rect.setAttribute("ry", "13");
    rect.setAttribute("fill", "#D4A373");

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute(
      "transform",
      `translate(${buttonWidth / 2}, ${buttonHeight / 2}) scale(${widthVar}, ${heightVar}) skewX(${slant})`
    );

    const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textEl.setAttribute("x", "0");
    textEl.setAttribute("y", "0");
    textEl.setAttribute("text-anchor", "middle");
    textEl.setAttribute("dominant-baseline", "middle");
    textEl.setAttribute("fill", "#0A3D2B");
    textEl.setAttribute("font-family", "Inter, system-ui, sans-serif");
    textEl.setAttribute("font-size", (buttonHeight * 0.92).toFixed(0));
    textEl.setAttribute("font-weight", "700");
    textEl.textContent = btn.text;

    g.appendChild(textEl);
    svg.appendChild(rect);
    svg.appendChild(g);
    document.body.appendChild(svg);

    // Static physics body (letters land on it)
    const body = Bodies.rectangle(x, y, buttonWidth, buttonHeight, {
      isStatic: true,
      restitution: 0.58,
      friction: 0.72,
      render: { visible: false }
    });
    World.add(engine.world, body);

    svg.addEventListener("click", () => {
      window.open(btn.link, "_blank");
    });

    currentX += slotWidth + 12;   // very small clean gap
  });

  // N U E letters (fall, hit buttons or fall off bottom)
  const scale = Math.min(1.05, window.innerWidth / 1200);
  const spacing = 248 * scale;
  const letterY = 112;
  const letterW = 126 * scale;
  const letterH = 170 * scale;

  const letterBodies = [];

  const makeLetter = (ox, tex) => {
    const b = Bodies.rectangle(
      window.innerWidth / 2 + ox,
      letterY + (Math.random() - 0.5) * 36,
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

  // Mouse drag
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, { mouse: mouse });
  World.add(engine.world, mouseConstraint);

  Runner.run(engine);
  Render.run(render);

  // Clean up letters that fall off bottom
  setInterval(() => {
    for (let i = letterBodies.length - 1; i >= 0; i--) {
      if (letterBodies[i].position.y > window.innerHeight + 130) {
        World.remove(engine.world, letterBodies[i]);
        letterBodies.splice(i, 1);
      }
    }
  }, 600);

  console.log("%c[NUE] 4 buttons • 0.92× text fill • strong height/condensation variation • 0 margin bottom", "color:#7CFF7C");
}

initPhysics();

window.addEventListener("resize", () => location.reload());
