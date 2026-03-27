const world = document.getElementById("world")
const playerEl = document.getElementById("player");
const enemyEl = document.getElementById("enemy");
const swordEl = document.getElementById("sword");
 
const playerHPText = document.getElementById("playerHP");
const enemyHPText = document.getElementById("enemyHP");
 
const keys = {};
 
const mapHeight = 2000;
const mapWidth = 2000;
 
const camera = {
    x: 0,
    y: 0
}
 
const player = {
  x:200,
  y:200,
  facing:1,
  speedx:3,
  speedy:0,
  gravity:0.5,
  jumpPower:-10,
  hp:100,
  damage:10,
  cooldown:400,
  canAttack:true,
  dashSpeed:12,
  dashtime: 200,
  dashing:false,
  dashVelocity:0,
  dashCooldown:800,
  canDash:true,
  alive: true
};
 
const enemy = {
  x:500,
  y:200,
  speed:2,
  speedy:0,
  gravity:0.5,
  jumpPower:-10,
  hp:50,
  alive: true
};
 
const swordOffset = { x: 40, y: 15 };
 
 
document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);
 
document.addEventListener("mousedown", e=>{
  if(e.button === 0){
    attack();
  }
});
 
document.addEventListener("keydown", e =>{
    if(e.key === "Shift"){
        dash();
    }
})
 
function attack() {
  if (!player.canAttack) return;
 
  player.canAttack = false;
  swordEl.style.display = "block";
 
  let swordX = player.x + swordOffset.x; // default right
  let swordY = player.y + swordOffset.y;
 
  if (player.facing === -1) {
    // left-facing: flip X offset
    swordX = player.x - swordOffset.x + 40; // 40 = sword width
    swordEl.style.transform = "scaleX(-1)"; // keep 0deg rotation
  } else {
    swordEl.style.transform = "scaleX(1)";
  }
 
  swordEl.style.left = swordX + "px";
  swordEl.style.top = swordY + "px";
 
  checkHit();
 
  setTimeout(() => {
    swordEl.style.display = "none";
  }, 120);
 
  setTimeout(() => {
    player.canAttack = true;
  }, player.cooldown);
}
 
function checkHit() {
 
  if (!enemy.alive || !player.alive) return;
 
  let swordX;
  let swordY = player.y + swordOffset.y;
 
  if (player.facing === 1) {
    // attacking right
    swordX = player.x + swordOffset.x;
  } else {
    // attacking left
    swordX = player.x - swordOffset.x;
  }
 
  const swordRect = {
    x: swordX,
    y: swordY,
    w: 60,   // wider hitbox so distance attacks work
    h: 40
  };
 
  const enemyRect = {
    x: enemy.x,
    y: enemy.y,
    w: enemyEl.offsetWidth,
    h: enemyEl.offsetHeight
  };
 
  if (
    swordRect.x < enemyRect.x + enemyRect.w &&
    swordRect.x + swordRect.w > enemyRect.x &&
    swordRect.y < enemyRect.y + enemyRect.h &&
    swordRect.y + swordRect.h > enemyRect.y
  ) {
 
    enemy.hp -= player.damage;
    enemyHPText.textContent = enemy.hp;
 
    spawnHit(enemy.x + 20, enemy.y + 20);
 
    if (enemy.hp <= 0) {
      enemy.alive = false;
      enemyEl.style.display = "none";
    }
  }
}
 
function dash() {
  if (!player.canDash || !player.alive) return;
 
  player.canDash = false;
  player.dashing = true;
  player.dashVelocity = player.dashSpeed * player.facing;
 
  // Stop dash after dashTime
  setTimeout(() => {
    player.dashing = false;
    player.dashVelocity = 0;
  }, player.dashtime);
 
  // Reset dash cooldown
  setTimeout(() => {
    player.canDash = true;
  }, player.dashCooldown);
}
 
function spawnHit(x,y){
    const hit = document.createElement("div");
    hit.classList.add("hit");
 
    hit.style.left = x + "px";
    hit.style.top = y + "px";
 
    world.appendChild(hit);
 
    setTimeout(() => {
       hit.remove();
    }, 300);
}
 
 
 
 
function move() {
  if (keys[" "] && player.y >= 300) {
    player.speedy = player.jumpPower;
  }
 
  if (!player.dashing) {
    if (keys["a"]) {
      player.x -= player.speedx;
      player.facing = -1;
      playerEl.style.transform = "scaleX(-1)";
    }
    if (keys["d"]) {
      player.x += player.speedx;
      player.facing = 1;
      playerEl.style.transform = "scaleX(1)";
    }
  }
}
 
function enemyAI(){
 
  if(!enemy.alive) return;
  if (!player.alive) return;
 
  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;
 
  const dist = Math.sqrt(dx*dx + dy*dy);
 
  if(dist < 200){
    enemy.x += dx * 0.01;
    enemy.y += dy * 0.01;
  }
 
  if(dist < 40){
    player.hp -= 0.1;
    playerHPText.textContent = Math.floor(player.hp);
    if(player.hp <= 0){
        player.alive = false;
        playerEl.style.display = "none";
    }
  }
}


// ── DEBUG ──────────────────────────────────────────
const DEBUG = true; // ← zet op false om alles te verbergen

if (DEBUG) {
  const debugEl = document.createElement("div");
  debugEl.id = "debug";
  document.body.appendChild(debugEl);

  document.addEventListener("mousemove", (e) => {
    // muis positie in de wereld (inclusief camera verschuiving)
    const wereldX = Math.round(e.clientX + camera.x);
    const wereldY = Math.round(e.clientY);

    debugEl.innerHTML = `
      scherm X: ${e.clientX} <br>
      scherm Y: ${e.clientY} <br>
      wereld X: ${wereldX}  <br>
      wereld Y: ${wereldY}  <br>
    `;
  });
}
// ── EINDE DEBUG ────────────────────────────────────



 
function updateCamera(){
    camera.x = player.x - window.innerWidth / 2;
    camera.y = player.y - window.innerHeight / 2;
 
    world.style.transform =
      `translate(${-camera.x}px, ${-camera.y}px)`;
}
 
function update(){
 
  move();
  enemyAI();
  updateCamera()
 
  playerEl.style.left = player.x + "px";
  playerEl.style.top = player.y + "px";
 
  enemyEl.style.left = enemy.x + "px";
  enemyEl.style.top = enemy.y + "px";
 
  //Zwaartekracht
  player.speedy += player.gravity;
  player.y += player.speedy;
  enemy.speedy += enemy.gravity;
  enemy.y += enemy.speedy;
 
  //Ground Collission
  if(player.y > 300){
    player.y = 300;
    player.speedy = 0;
  }
  if(enemy.y > 300){
    enemy.y = 300;
    enemy.speedy = 0;
  }
 
  //Dashing
  if (player.dashing) {
    player.x += player.dashVelocity;
  }
 
 
  requestAnimationFrame(update);
}
 
update();
 