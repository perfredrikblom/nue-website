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
const ground = Bodies.rectangle(
  window.innerWidth / 2, 
  window.innerHeight - 40, 
  window.innerWidth * 2, 
  100, 
  { isStatic: true, restitution: 0.65, render: { visible: false } }
);
World.add(engine.world, ground);

// Create the three letters
const letters = [];

const createLetter = (x, y, texture) => {
  const body = Bodies.rectangle(x, y, 130, 180, {
    restitution: 0.62,
    friction: 0.3,
    render: {
      sprite: {
        texture: texture,
        xScale: 1,
        yScale: 1
      }
    }
  });
  letters.push(body);
  World.add(engine.world, body);
};

createLetter(window.innerWidth * 0.32, 120, 'assets/n.png');
createLetter(window.innerWidth * 0.5,  100, 'assets/u.png');
createLetter(window.innerWidth * 0.68, 130, 'assets/e.png');

// Mouse drag
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, { mouse: mouse });
World.add(engine.world, mouseConstraint);

Engine.run(engine);
Render.run(render);

// Click anywhere to give all letters a push
document.addEventListener('click', () => {
  letters.forEach(letter => {
    Body.applyForce(letter, letter.position, {
      x: (Math.random() - 0.5) * 0.12,
      y: -0.22
    });
    Body.setAngularVelocity(letter, (Math.random() - 0.5) * 0.4);
  });
});

// Initial drop
setTimeout(() => {
  letters.forEach((letter, i) => {
    Body.setVelocity(letter, { 
      x: (i - 1) * 2, 
      y: 8 + Math.random() * 4 
    });
  });
}, 400);