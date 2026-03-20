const player = {
  element: document.getElementById("player"),
  x: 100,
  y: 300,
  velocityY: 0
};
const world = document.getElementById("world");

const camera = {
  x: 0,
  y: 0
};


let gravity = 0.5;
let jumpPower = -10;

let keys = {};

// keyboard input
document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

function update(){

  // bewegen links
  if(keys["KeyA"]){
    player.x -= 4;
  }

  // bewegen rechts
  if(keys["KeyD"]){
    player.x += 4;
  }

  // springen
  if(keys["Space"] && player.y >= 300){
    player.velocityY = jumpPower;
  }

  // gravity
  player.velocityY += gravity;
  player.y += player.velocityY;

  // grond botsing
  if(player.y > 300){
    player.y = 300;
    player.velocityY = 0;
  }

  // positie toepassen
  player.element.style.left = player.x + "px";
  player.element.style.top = player.y + "px";

  camera.x = player.x - window.innerWidth / 2;
  camera.y = player.y - window.innerHeight /2;
  
  requestAnimationFrame(update);
}

// start game loop
update();