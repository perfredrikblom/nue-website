// script.js - DIAGNOSTIC ONLY
console.log("Script loaded. Window size:", window.innerWidth, "x", window.innerHeight);

document.body.innerHTML += `
  <div style="position:fixed; top:20px; left:20px; color:#D4A373; font-size:18px; z-index:999;">
    Diagnostic test<br>
    Trying to load: assets/n.png, u.png, e.png<br><br>
    If you see gray rectangles + big letters below, physics works but images fail.<br>
    If you see nothing, the physics didn't start.
  </div>`;

const { Engine, Render, World, Bodies, Body } = Matter;

const engine = Engine.create();
engine.gravity.y = 2.0;

const render = Render.create({
  element: document.body,
  engine: engine,
  options: { width: window.innerWidth, height: window.innerHeight, wireframes: false, background: '#0A3D2B' }
});

const ground = Bodies.rectangle(window.innerWidth/2, window.innerHeight - 50, window.innerWidth*2, 100, { isStatic: true, render: { visible: false } });
World.add(engine.world, ground);

// Test with visible fallback rectangles + text
const n = Bodies.rectangle(window.innerWidth*0.3, 150, 120, 170, { render: { fillStyle: '#666' } });
const u = Bodies.rectangle(window.innerWidth*0.5, 120, 120, 170, { render: { fillStyle: '#666' } });
const e = Bodies.rectangle(window.innerWidth*0.7, 160, 120, 170, { render: { fillStyle: '#666' } });

World.add(engine.world, [n, u, e]);

Runner.run(engine);
Render.run(render);

console.log("✅ Physics started. Check if you see gray rectangles.");