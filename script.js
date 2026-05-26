// script.js
const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;

const engine = Engine.create();
engine.gravity.y = 2.1;

const render = Render.create({
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
const ground = Bodies.rectangle(window.innerWidth/2, window.innerHeight - 40, window.innerWidth*2, 100, {
  isStatic: true,
  restitution: 0.65,
  render: { visible: false }
});
World.add(engine.world, ground);

// Test with one letter first
const testBody = Bodies.rectangle(window.innerWidth / 2, 150, 130, 180, {
  restitution: 0.62,
  render: {
    sprite: {
      texture: 'assets/n.png',   // Only testing N for now
      xScale: 1,
      yScale: 1
    }
  }
});

World.add(engine.world, testBody);

const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, { mouse: mouse });
World.add(engine.world, mouseConstraint);

Engine.run(engine);
Render.run(render);

console.log("✅ Trying to load assets/n.png");