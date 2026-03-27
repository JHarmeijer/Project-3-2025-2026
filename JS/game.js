const loots = [];

const world = document.getElementById("world")
const playerEl = document.getElementById("player");
const enemyEl = document.getElementById("enemy");
const swordEl = document.getElementById("sword");
const playerHPText = document.getElementById("playerHP");
const enemyHPText = document.getElementById("enemyHP");

const keys = {};
const prevKeys = {};

const mapHeight = 2000;
const mapWidth = 2000;

//platforms inladen van de world.js
const platformsEl = document.getElementById("platforms");

const platforms = [];
const enemies = [];
const camera = {
    x: 0,
    y: 0
};

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



const swordOffset = { x: 40, y: -10 };


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

//platforms spawnen
function spawnPlatforms() {
  level.platforms.forEach(p => {
    const el = document.createElement("div");
    el.classList.add("platform");

    el.style.left = p.x + "px";
    el.style.top = p.y + "px";
    el.style.width = p.w + "px";
    el.style.height = p.h + "px";

    platformsEl.appendChild(el);
    platforms.push(p);
  });
}

//collision
function checkPlatformCollision(entity) {
  let onGround = false;

  platforms.forEach(p => {

    const withinX =
      entity.x + 40 > p.x &&
      entity.x < p.x + p.w;

    const falling = entity.speedy >= 0;

    const touchingTop =
      entity.y + 40 >= p.y &&
      entity.y + 40 <= p.y + p.h;

    if (withinX && falling && touchingTop) {
      entity.y = p.y - 40;
      entity.speedy = 0;
      onGround = true;
    }
  });

  return onGround;
}

function spawnEnemies() {
  level.enemies.forEach(e => {
    const el = document.createElement("div");
    el.classList.add("enemy");

    world.appendChild(el);

    enemies.push({
      x: e.x,
      y: e.y,
      speedy: 0,
      gravity: 0.5,
      hp: 50,
      alive: true,
      el: el
    });
  });
}

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

  if (!player.alive) return;

  let swordX;
  let swordY = player.y + swordOffset.y;

  if (player.facing === 1) {
    swordX = player.x + swordOffset.x;
  } else {
    swordX = player.x - swordOffset.x;
  }

  const swordRect = {
    x: swordX,
    y: swordY,
    w: 60,
    h: 40
  };

  enemies.forEach(enemy => {

    if (!enemy.alive) return;

    const enemyRect = {
      x: enemy.x,
      y: enemy.y,
      w: enemy.el.offsetWidth,
      h: enemy.el.offsetHeight
    };

    if (
      swordRect.x < enemyRect.x + enemyRect.w &&
      swordRect.x + swordRect.w > enemyRect.x &&
      swordRect.y < enemyRect.y + enemyRect.h &&
      swordRect.y + swordRect.h > enemyRect.y
    ) {

      // ✅ DAMAGE
      enemy.hp -= player.damage;

      spawnHit(enemy.x + 20, enemy.y + 20);

      if (enemy.hp <= 0) {
        enemy.alive = false;

        spawnDeathParticles(enemy.x + 20, enemy.y + 20);
        spawnLoot(enemy.x + 20, enemy.y + 20);

        enemy.el.style.display = "none";
      }
    }
  });
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

function spawnDeathParticles(x, y) {
  const particleCount = 20;

  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement("div");
    p.classList.add("particle");

    // Startpositie
    p.style.left = x + "px";
    p.style.top = y + "px";

    // Random richting
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 80 + 40;

    const dx = Math.cos(angle) * speed + "px";
    const dy = Math.sin(angle) * speed + "px";

    p.style.setProperty("--dx", dx);
    p.style.setProperty("--dy", dy);

    world.appendChild(p);

    setTimeout(() => p.remove(), 800);
  }
}

function spawnLoot(x, y) {
  const amount = 5 + Math.floor(Math.random() * 5);

  for (let i = 0; i < amount; i++) {
    const el = document.createElement("div");
    el.classList.add("loot");

    // kleine random spread
    const offsetX = Math.random() * 40 - 20;
    const offsetY = Math.random() * 20;

    const loot = {
      x: x + offsetX,
      y: y + offsetY,
      el: el,
      value: 2 // hoeveel aura
    };

    el.style.left = loot.x + "px";
    el.style.top = loot.y + "px";

    world.appendChild(el);
    loots.push(loot);
  }
}


function move() {
  if (keys[" "] && !prevKeys[" "] && player.speedy === 0) {
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
  enemies.forEach(enemy => {

    if(!enemy.alive || !player.alive) return;

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

    // gravity
    enemy.speedy += enemy.gravity;
    enemy.y += enemy.speedy;

    checkPlatformCollision(enemy);

    enemy.el.style.left = enemy.x + "px";
    enemy.el.style.top = enemy.y + "px";
  });
}

function updateCamera(){
    camera.x = player.x - window.innerWidth / 2;
    camera.y = player.y - window.innerHeight / 2;

    world.style.transform =
      `translate(${-camera.x}px, ${-camera.y}px)`;
}

function updateLoot() {
  for (let i = loots.length - 1; i >= 0; i--) {
    const loot = loots[i];

    const playerCenterX = player.x + 20;
    const playerCenterY = player.y + 20;

    const dx = playerCenterX - loot.x;
    const dy = playerCenterY - loot.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    //  MAGNET RANGE
    const magnetRange = 100;

    if (dist < magnetRange) {
      // richting normalizen
      const dirX = dx / dist;
      const dirY = dy / dist;

      // snelheid afhankelijk van afstand (dichterbij = sneller)
      const speed = (magnetRange - dist) * 0.15;

      loot.x += dirX * speed;
      loot.y += dirY * speed;
    }

    //  pickup radius
    if (dist < 30) {
      player.hp += loot.value;
      playerHPText.textContent = Math.floor(player.hp);

      loot.el.remove();
      loots.splice(i, 1);
      if (dist === 0) continue;
    }

    loot.el.style.left = loot.x + "px";
    loot.el.style.top = loot.y + "px";

    if (dist < magnetRange) {
      loot.el.style.transform = "scale(1.3)";
    } else {
      loot.el.style.transform = "scale(1)";
    }
  }
}

function update(){

  move();
  enemyAI();
  updateCamera()
  updateLoot();

  playerEl.style.left = player.x + "px";
  playerEl.style.top = player.y + "px";



  //Zwaartekracht
  player.speedy += player.gravity;
  player.y += player.speedy;


  //Ground Collission
  checkPlatformCollision(player);

  Object.assign(prevKeys, keys);

  //Dashing
  if (player.dashing) {
    player.x += player.dashVelocity;
  }
  

  requestAnimationFrame(update);
}
spawnEnemies();
spawnPlatforms();
update();
