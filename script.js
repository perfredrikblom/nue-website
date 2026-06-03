// script.js - NUE Debug with colored button, random text shape, physics letters colliding with button
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

  // === TABLE BUTTON: colored, bottom aligned, random sized + randomly shaped text ===
  // Overall button size (random each reload for nice variation)
  const targetWidth = 255 + Math.random() * 135;   // 255px to ~390px wide
  const targetHeight = 80 + Math.random() * 48;    // 80px to ~128px tall

  // Additional distortion for "randomly shaped" text (centered, moderate so it fits nicely)
  const distortX = 0.82 + Math.random() * 0.55;    // 0.82x – 1.37x (width/condensed effect)
  const distortY = 0.88 + Math.random() * 0.42;    // 0.88x – 1.30x (height)
  const slant = (Math.random() - 0.5) * 24;        // +/- 12° skew for dynamic feel

  const buttonWidth = targetWidth;
  const buttonHeight = targetHeight;

  // Perfect bottom alignment: lower edge touches window bottom (0 margin)
  const marginBottom = 0;
  const x = window.innerWidth / 2;
  const y = window.innerHeight - marginBottom - buttonHeight / 2;

  // Update debug panel with exact calculations
  const debug = document.getElementById('debug');
  debug.innerHTML = `
    <strong>TABLE Button Debug</strong><br><br>
    Window: ${window.innerWidth} × ${window.innerHeight}px<br>
    Button size: ${buttonWidth.toFixed(1)} × ${buttonHeight.toFixed(1)} px<br>
    distortX: ${distortX.toFixed(2)} | distortY: ${distortY.toFixed(2)} | slant: ${slant.toFixed(1)}°<br>
    Center (x, y): (${x.toFixed(1)}, ${y.toFixed(1)})<br>
    Lower edge y: ${(y + buttonHeight / 2).toFixed(1)} (equals window height)<br>
    <span style="color:#7CFF7C">✅ Colored button • Lower edge aligned to bottom (no margin) • Text randomly shaped</span>
  `;

  // Create colored button (SVG with background rect + distorted text)
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", buttonWidth);
  svg.setAttribute("height", buttonHeight);
  svg.style.left = (x - buttonWidth / 2) + "px";
  svg.style.top = (y - buttonHeight / 2) + "px";
  svg.style.position = "absolute";
  svg.style.zIndex = "10";

  // Rounded rect background (the visible colored button)
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", "0");
  rect.setAttribute("y", "0");
  rect.setAttribute("width", buttonWidth);
  rect.setAttribute("height", buttonHeight);
  rect.setAttribute("rx", "16");
  rect.setAttribute("ry", "16");
  rect.setAttribute("fill", "#D4A373");

  // Group for centered transform (distortion happens symmetrically around button center)
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute(
    "transform",
    `translate(${buttonWidth / 2}, ${buttonHeight / 2}) scale(${distortX}, ${distortY}) skewX(${slant})`
  );

  // The text (centered in group → distortion stays nicely inside button)
  const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
  textEl.setAttribute("x", "0");
  textEl.setAttribute("y", "0");
  textEl.setAttribute("text-anchor", "middle");
  textEl.setAttribute("dominant-baseline", "middle");
  textEl.setAttribute("fill", "#0A3D2B");
  textEl.setAttribute("font-family", "Inter, system-ui, sans-serif");
  textEl.setAttribute("font-size", "50");
  textEl.setAttribute("font-weight", "700");
  textEl.textContent = "TABLE";

  g.appendChild(textEl);
  svg.appendChild(rect);
  svg.appendChild(g);
  document.body.appendChild(svg);

  // Physics body for the button (static collider - letters will land/bounce on it)
  const buttonBody = Bodies.rectangle(x, y, buttonWidth, buttonHeight, {
    isStatic: true,
    restitution: 0.62,
    friction: 0.75,
    render: { visible: false }
  });
  World.add(engine.world, buttonBody);

  // === N U E letters as falling PNGs (physics bodies) - collide with button or fall off bottom ===
  const scale = Math.min(1.05, window.innerWidth / 1200);
  const spacing = 255 * scale;
  const letterY = 118;
  const letterW = 132 * scale;
  const letterH = 178 * scale;

  const letterBodies = [];

  // N
  const nBody = Bodies.rectangle(
    window.innerWidth / 2 - spacing,
    letterY,
    letterW,
    letterH,
    {
      restitution: 0.52,
      friction: 0.55,
      frictionAir: 0.014,
      render: {
        sprite: {
          texture: "assets/n.png",
          xScale: scale,
          yScale: scale
        }
      }
    }
  );
  letterBodies.push(nBody);

  // U
  const uBody = Bodies.rectangle(
    window.innerWidth / 2,
    letterY + 22,
    letterW,
    letterH,
    {
      restitution: 0.52,
      friction: 0.55,
      frictionAir: 0.014,
      render: {
        sprite: {
          texture: "assets/u.png",
          xScale: scale,
          yScale: scale
        }
      }
    }
  );
  letterBodies.push(uBody);

  // E
  const eBody = Bodies.rectangle(
    window.innerWidth / 2 + spacing,
    letterY - 8,
    letterW,
    letterH,
    {
      restitution: 0.52,
      friction: 0.55,
      frictionAir: 0.014,
      render: {
        sprite: {
          texture: "assets/e.png",
          xScale: scale,
          yScale: scale
        }
      }
    }
  );
  letterBodies.push(eBody);

  World.add(engine.world, letterBodies);

  // Mouse drag interaction
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, { mouse: mouse });
  World.add(engine.world, mouseConstraint);

  Runner.run(engine);
  Render.run(render);

  // Remove letters that fall far below screen (they disappear beneath bottom)
  setInterval(() => {
    for (let i = letterBodies.length - 1; i >= 0; i--) {
      if (letterBodies[i].position.y > window.innerHeight + 150) {
        World.remove(engine.world, letterBodies[i]);
        letterBodies.splice(i, 1);
      }
    }
  }, 700);

  console.log("%c[NU E] Physics active • Colored button at bottom • Letters collide or fall off screen", "color:#7CFF7C");
}

// Boot
initPhysics();

// Simple reload on resize (recalculates random shape + positions)
window.addEventListener("resize", () => {
  location.reload();
});
