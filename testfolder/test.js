const world = document.getElementById("world");
const playerEl = document.getElementById("player");

// keys en camera
const keys = {};
const camera = { x: 0, y: 0 };
const deadZone = 450;

// level/platforms
const blocks = [
  { x: 0, y: 350, w: 2000, h: 50 },   // grond
  { x: 300, y: 280, w: 100, h: 20 },
  { x: 500, y: 240, w: 100, h: 20 },
  { x: 700, y: 200, w: 100, h: 20 },
  { x: 1000, y: 300, w: 150, h: 20 }
];

// player object
const player = {
  element: playerEl,
  x: 300,
  y: 100,
  width: 50,
  height: 50,
  speedx: 3,
  speedy: 0,
  jumpPower: -10,
  gravity: 0.5,
  alive: true
};

// globale onGround variabele
let onGround = false;

// key input
document.addEventListener("keydown", (e) => { keys[e.code] = true; });
document.addEventListener("keyup", (e) => { keys[e.code] = false; });

// move functie
function move() {
  if (keys["KeyD"]) { player.x += player.speedx; }
  if (keys["KeyA"]) { player.x -= player.speedx; }
  if (keys["Space"] && onGround) { player.speedy = player.jumpPower; }
}

// camera update
function updateCamera() {
  const centerX = window.innerWidth / 2;
  const targetX = player.x - centerX;

  // smooth follow
  camera.x += (targetX - camera.x) * 0.1;

  // world transform
  world.style.transform = `translate(${-camera.x}px, 0px)`;
}

// level maken
function createLevel() {
  blocks.forEach(block => {
    const el = document.createElement("div");
    el.classList.add("block");
    el.style.left = block.x + "px";
    el.style.top = block.y + "px";
    el.style.width = block.w + "px";
    el.style.height = block.h + "px";
    world.appendChild(el);
    block.el = el;
  });
}

createLevel();

// game loop
function update() {
  // gravity toepassen
  player.speedy += player.gravity;
  player.y += player.speedy;

  // collision met blocks
  onGround = false; // reset elk frame
  blocks.forEach(block => {
    if (
      player.x < block.x + block.w &&
      player.x + player.width > block.x &&
      player.y < block.y + block.h &&
      player.y + player.height > block.y
    ) {
      // van boven landen
      if (player.speedy > 0) {
        player.y = block.y - player.height;
        player.speedy = 0;
        onGround = true;
      }
    }
  });

  move();
  updateCamera();

  // render player
  player.element.style.left = player.x + "px";
  player.element.style.top = player.y + "px";

  // map grenzen
  if (player.x < 0) player.x = 0;
  if (player.y > 1000) player.y = 1000; // voorkomt dat hij onder de map valt

  requestAnimationFrame(update);
}

update();