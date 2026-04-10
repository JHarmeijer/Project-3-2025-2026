document.addEventListener("DOMContentLoaded", () => {
  const loreScreen = document.getElementById("loreScreen");
  const startLevel1Btn = document.getElementById("startLevel1Btn");
  const loreScreen1 = document.getElementById("loreScreen1");
  const startLevel2Btn = document.getElementById("startLevel2Btn");
  const loreScreen2 = document.getElementById("loreScreen2");
  const startLevel3Btn = document.getElementById("startLevel3Btn");

  // Check of we op level 1 starten
  const selectedLevel = localStorage.getItem("selectedLevel");
  if (selectedLevel == "1") {
    loreScreen.classList.remove("hidden");
  }
  startLevel1Btn.addEventListener("click", () => {
    loreScreen.classList.add("hidden");
  });

  const selectedLevel1 = localStorage.getItem("selectedLevel");
  if (selectedLevel1 == "2") {
    loreScreen1.classList.remove("hidden");
  }
  startLevel2Btn.addEventListener("click" , () => {
    loreScreen1.classList.add("hidden");
  })

  const selectedLevel2 = localStorage.getItem("selectedLevel");
  if(selectedLevel2 == "3") {
    loreScreen2.classList.remove("hidden");
  }
  startLevel3Btn.addEventListener("click", () => {
    loreScreen2.classList.add("hidden");
  })
});

const loots = [];
const world = document.getElementById("world")
const playerEl = document.getElementById("player");
const enemyEl = document.getElementById("enemy");
const swordEl = document.getElementById("sword");
const platformsEl = document.getElementById("platforms");

const keys = {};
const prevKeys = {};
const mapHeight = 400;
const mapWidth = 3000;
const platforms = [];
const enemies = [];
const camera = {x: 0, y: 0};
let gameEnded = false;

//---------UI----------
const playerHPText = document.getElementById("playerHP");
const pauseMenu = document.getElementById("pauseMenu");
const resumeBtn = document.getElementById("resumeBtn");
const leaveLevelBtn = document.getElementById("leaveLevelBtn");
let isPaused = false;

//----------PLAYER--------
const player = {
  x:200, y:200, facing:1, speedx:3, speedy:0, gravity:0.5, 
  jumpPower:-10, hp:100, damage:10, cooldown:400, canAttack:true,
  dashSpeed:12, dashtime: 200, dashing:false, dashVelocity:0, dashCooldown:800,
  canDash:true, alive: true, canMove: true
};

let endZone = null;
if(level !== level3){endZone = {x:2900, y:0, w:100, h:360};}

const swordOffset = { x: 40, y: -10 };

//----------INPUT---------
document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);
document.addEventListener("mousedown", e=>{ if(e.button === 0){attack();}});
document.addEventListener("keydown", e =>{if(e.key === "Shift"){dash();}});
document.addEventListener("keydown", e => {if(e.key === "Escape") {if(!isPaused) openPauseMenu();else closePauseMenu();}});

//---------LORE ANIMATIE------
const loreScreen = document.getElementById("loreScreen");
const startLevel1Btn = document.getElementById("startLevel1Btn");
const loreScreen1 = document.getElementById("loreScreen1");
const startLevel2Btn = document.getElementById("startLevel2Btn");
const loreScreen2 = document.getElementById("loreScreen2");
const startLevel3Btn = document.getElementById("startLevel3Btn");

function showLoreLevel1() {
  loreScreen.classList.remove("hidden");
  player.canMove = false;
}
startLevel1Btn.addEventListener("click", () => {
  loreScreen.classList.add("hidden");
  player.canMove = true;
});

function showLoreLevel2() {
  loreScreen1.classList.remove("hidden");
  player.canMove = false;
}
startLevel2Btn.addEventListener("click", () => {
  loreScreen1.classList.add("hidden");
  player.canMove = true;
});

function showLoreLevel3() {
  loreScreen2.classList.remove("hidden");
  player.canMove = false;
}
startLevel3Btn.addEventListener("click", () => {
  loreScreen2.classList.add("hidden");
  player.canMove = true;
});


//----------COLLISION----------
function checkPlatformCollision(entity) {
  let onGround = false;
  const height = entity.isBoss ? 80 : 40;
  platforms.forEach(p => {
    const width = entity.isBoss ? 80 : 40; // breedte van entity
    const withinX =
      entity.x + width > p.x &&
      entity.x < p.x + p.w;
    const falling = entity.speedy >= 0;
    const touchingTop =
      entity.y + height >= p.y &&
      entity.y + height <= p.y + p.h;
    if (withinX && falling && touchingTop) {
      entity.y = p.y - height;
      entity.speedy = 0;
      onGround = true;
    }
  });
  return onGround;
}

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
//----------UI INPUTS------------
function openPauseMenu() {
  pauseMenu.classList.remove("hidden");
  isPaused = true;
  player.canMove = false;
}

function closePauseMenu() {
  pauseMenu.classList.add("hidden");
  isPaused = false;
  player.canMove = true;
}
resumeBtn.addEventListener("click", () => {closePauseMenu();});
leaveLevelBtn.addEventListener("click", () => {window.location.href = "levels.html";});

//----------PLAYER MOVEMENT-----------
function move(delta){
    if(!player.canMove) return;

    if (!player.dashing && player.canMove == true) {
        if (keys["a"]) { player.x -= player.speedx * delta; player.facing = -1; playerEl.style.transform = "scaleX(-1)"; }
        if (keys["d"]) { player.x += player.speedx * delta; player.facing = 1; playerEl.style.transform = "scaleX(1)"; }
    }

    if (keys[" "] && !prevKeys[" "] && player.speedy === 0 && player.canMove == true) {
        player.speedy = player.jumpPower;
    }
}
function dash() {
  if (!player.canDash || !player.alive) return;
  player.canDash = false;
  player.dashing = true;
  player.dashVelocity = player.dashSpeed * player.facing;

  setTimeout(() => {
    player.dashing = false;
    player.dashVelocity = 0;
  }, player.dashtime);

  setTimeout(() => {
    player.canDash = true;
  }, player.dashCooldown);
}

//-------------PLAYER BOUNDARIES----------
function keepPlayerInBounds() {
  if(player.x < 0) player.x = 0;
  if(player.x > mapWidth-40) player.x = mapWidth-40;
  if(player.y < 0){player.y=0; player.speedy=0; }
  if(player.y > mapHeight-40){player.y=mapHeight-40; player.speedy=0; }
}

//---------DEATH CHECK---------
function checkPlayerDeath(){
  if(player.hp <= 0 && player.alive){
    player.hp = 0;
    player.alive = false;
    player.canMove = false;
    playerEl.style.display = "none";
    endGame("Je bent dood dood!");
  }
}

// ---------------- Enemy AI & ENEMIES SPAWNEN ----------------
function enemyAI(){
  enemies.forEach(enemy => {
    if(!enemy.alive || !player.alive) return;

    if(enemy.isBoss) enemy.x += Math.sin(Date.now()*0.002)*1.5;
    else {
      const dx=player.x-enemy.x; const dy=player.y-enemy.y;
      const dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<200){ enemy.x+=dx*0.01; enemy.y+=dy*0.01; }
    }

    const distToPlayer = Math.sqrt((player.x-enemy.x)**2 + (player.y-enemy.y)**2);
    
    // Hitbox van de boss
    const bossRange = enemy.isBoss ? 100 : 40;
    if(distToPlayer < bossRange){
      player.hp -= enemy.isBoss?0.3:0.1;
      playerHPText.textContent=Math.floor(player.hp);
      checkPlayerDeath();
    }

    enemy.speedy += enemy.gravity;
    enemy.y += enemy.speedy;
    checkPlatformCollision(enemy);

    enemy.el.style.left = enemy.x + "px";
    enemy.el.style.top = enemy.y + "px";
  });
}

function spawnEnemies() {
  level.enemies.forEach(e => {
    const el = document.createElement("div");
    el.classList.add("enemy");

    // speciale styling voor boss
    if(e.isBoss){
      el.style.background = "purple";
      el.style.width = "80px";
      el.style.height = "80px";
    }
    world.appendChild(el);
    enemies.push({x: e.x, y: e.y, speedy: 0, gravity: 0.5, hp: e.hp || 50, alive: true,
      isBoss: e.isBoss || false,el: el});
  });
}

//-------WIN & END--------
function endGame(message) {
  if (gameEnded) return;
  gameEnded = true;
  player.canMove = false;
  player.alive = false;

  const winScreen = document.getElementById("winScreen");
  const winText = document.getElementById("winText");

  winText.textContent = message;
  winScreen.classList.remove("hidden");
}

function isPlayerAtEnd() {
  if(!endZone) return false; // Boss fight heeft geen endZone
    return (
        player.x + 40 > endZone.x &&
        player.x < endZone.x + endZone.w &&
        player.y + 40 > endZone.y &&
        player.y < endZone.y + endZone.h
    );
}
function goToMenu() {
  window.location.href = "levels.html";
}

function restartLevel() {
  location.reload();
}

function checkWinCondition() {
  if(level === level3){ // Boss level
      const bossAlive = enemies.some(e => e.isBoss && e.alive);
      if(!bossAlive){
          endGame("Boss verslagen!");
      }
      return;
  }

    // Normale levels → alles killen + einde bereiken
  if(areAllEnemiesDead() && isPlayerAtEnd()){
      endGame("Level gehaald!");
  }
}

function areAllEnemiesDead() {
  return enemies.every(enemy => !enemy.alive);
}

// ---------------- UPDATE LOOP ----------------
let lastTime = performance.now();
function update(currentTime = performance.now()){
  if(isPaused == true){requestAnimationFrame(update); return;}

  const delta = (currentTime - lastTime) / 8.333; //120fps
  lastTime = currentTime;
  move(delta);
  enemyAI(delta);

  // Zwaartekracht
  player.speedy += player.gravity * delta;
  player.y += player.speedy * delta;

  // Borders
  keepPlayerInBounds();

  checkPlatformCollision(player);
  updateCamera();
  updateLoot();
  checkWinCondition();

  playerEl.style.left = player.x + "px";
  playerEl.style.top = player.y + "px";

  Object.assign(prevKeys, keys);

  if(player.dashing) player.x += player.dashVelocity * delta;

  requestAnimationFrame(update);
}

//--------CAMERA & LOOT-------
function updateCamera(){
    camera.x = player.x - window.innerWidth/2;
    camera.y = player.y - window.innerHeight/2;
    world.style.transform = `translate(${-camera.x}px,${-camera.y}px)`;
}

//----------LOOT------------
function spawnLoot(x, y) {
  const amount = 5 + Math.floor(Math.random() * 5);

  for (let i = 0; i < amount; i++) {
    const el = document.createElement("div");
    el.classList.add("loot");

    // kleine random spread
    const offsetX = Math.random() * 40 - 20;
    const offsetY = Math.random() * 20;

    const loot = {x: x + offsetX, y: y + offsetY, el: el, value: 2};

    el.style.left = loot.x + "px";
    el.style.top = loot.y + "px";

    world.appendChild(el);
    loots.push(loot);
  }
}

function updateLoot(){
  for(let i=loots.length-1;i>=0;i--){
    const loot=loots[i];
    const dx=(player.x+20)-loot.x;
    const dy=(player.y+20)-loot.y;
    const dist=Math.sqrt(dx*dx+dy*dy);

    if(dist<100){
      const dirX=dx/dist; const dirY=dy/dist;
      const speed=(100-dist)*0.15;
      loot.x+=dirX*speed; loot.y+=dirY*speed;
    }

    if(dist<30){
      player.hp+=loot.value;
      playerHPText.textContent=Math.floor(player.hp);
      loot.el.remove();
      loots.splice(i,1);
      checkPlayerDeath();
      continue;
    }

    loot.el.style.left=loot.x+"px";
    loot.el.style.top=loot.y+"px";
    loot.el.style.transform = dist<100 ? "scale(1.3)" : "scale(1)";
  }
}

function spawnDeathParticles(x, y) {
  const particleCount = 20;
  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement("div");
    p.classList.add("particle");
    p.style.left = x + "px";
    p.style.top = y + "px";
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
//--------HITS & ATTACK-------
function attack() {
  if (!player.canAttack) return;
  player.canAttack = false;
  swordEl.style.display = "block";
  let swordX = player.x + swordOffset.x; // default right
  let swordY = player.y + swordOffset.y;

  if (player.facing === -1) {swordX = player.x - swordOffset.x + 40; swordEl.style.transform = "scaleX(-1)";}
  else {swordEl.style.transform = "scaleX(1)"; }
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
  if (player.facing === 1) {swordX = player.x + swordOffset.x;}
  else {swordX = player.x - swordOffset.x;}
  const swordRect = {x: swordX, y: swordY, w:60, h:40};
  enemies.forEach(enemy => {
    if (!enemy.alive) return;
    const enemyRect = {x: enemy.x, y: enemy.y, w: enemy.el.offsetWidth, h: enemy.el.offsetHeight};
    if (
      swordRect.x < enemyRect.x + enemyRect.w && swordRect.x + swordRect.w > enemyRect.x &&
      swordRect.y < enemyRect.y + enemyRect.h && swordRect.y + swordRect.h > enemyRect.y
    ) {
      // DAMAGE
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

//--------START GAME----------
spawnEnemies();
spawnPlatforms();
update();