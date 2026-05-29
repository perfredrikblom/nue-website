// script.js
const { Engine, Render, World, Bodies, Body, Mouse, MouseConstraint, Runner } = Matter;

let engine, render, letters = [], buttonBodies = [];

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

  buttonBodies = [];
  const baseY = window.innerHeight - 85;

  const createButton = (baseX, text, width, height, id, link) => {
    const x = baseX + (Math.random() - 0.5) * 60;
    const y = baseY + (Math.random() - 0.5) * 25;
    const rotation = (Math.random() - 0.5) * 0.22;

    const body = Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      restitution: 0.68,
      friction: 0.4,
      angle: rotation,
      render: { visible: false }
    });
    World.add(engine.world, body);
    buttonBodies.push(body);

    const btn = document.createElement('button');
    btn.id = id;
    btn.className = 'physics-button';
    btn.textContent = text;
    btn.style.left = (x - width/2) + 'px';
    btn.style.top = (y - height/2) + 'px';
    btn.style.width = width + 'px';

    // Click with delay + message
    btn.addEventListener('click', () => {
      showToast("Our menu now opens for you in a new tab...");
      
      setTimeout(() => {
        window.open(link, '_blank');
      }, 1200); // 1.2 second delay
    });

    document.body.appendChild(btn);
    return { body, element: btn };
  };

  // Buttons
  createButton(window.innerWidth * 0.15, "TABLE", 195, 72, 'btn-table', 'https://octotable.com/book/restaurant/1000969/booking/new');
  createButton(window.innerWidth * 0.38, "VENUE", 145, 55, 'btn-venue', 'https://maps.google.com/?q=Utara,+Jl.+Pantai+Batu+Mejan+No.126,+Canggu,+Bali');
  createButton(window.innerWidth * 0.60, "SOCIAL", 155, 65, 'btn-social', 'https://instagram.com/nue.bali');
  createButton(window.innerWidth * 0.82, "MENU", 160, 58, 'btn-menu', 'https://secure.guestpro.net/nue');

  // Letters (unchanged)
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
      render: {
        sprite: { texture: texture, xScale: scale, yScale: scale }
      }
    });
    letters.push(body);
    World.add(engine.world, body);
  };

  createLetter(-spacing, 'assets/n.png', -0.25);
  createLetter(0,        'assets/u.png',  0.00);
  createLetter(spacing,  'assets/e.png', -0.20);

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

// Toast message
function showToast(message) {
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '140px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.background = 'rgba(212,163,115,0.95)';
  toast.style.color = '#0A3D2B';
  toast.style.padding = '14px 28px';
  toast.style.borderRadius = '50px';
  toast.style.fontSize = '1.05rem';
  toast.style.fontWeight = '600';
  toast.style.zIndex = '200';
  toast.style.whiteSpace = 'nowrap';
  toast.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'all 0.4s';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 1800);
}

// Click push closest letter
document.addEventListener('click', (e) => {
  // Ignore clicks on buttons
  if (e.target.tagName === 'BUTTON') return;

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
    Body.applyForce(closest, closest.position, {
      x: (Math.random() - 0.5) * 0.13,
      y: -0.23
    });
  }
});

window.addEventListener('resize', initPhysics);