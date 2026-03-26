const world = document.getElementById("world")
const playerEl = document.getElementById("player");
const enemyEl = document.getElementById("enemy");
const swordEl = document.getElementById("sword");

const playerHPText = document.getElementById("playerHP");
const enemyHPText = document.getElementById("enemyHP");
//voor de camera
const deadZone = 450;


const keys = {};
const camera = {
    x: 0,
    y: 0
}
 


const player = {
  element : document.getElementById('player'),
    x:300,
    y:100,
    speedx:3,
    speedy:0,
    jumpPower:-10,
    gravaty:0.5,
    hp:100,
    alive: true
}



document.addEventListener("keydown", (e)=> {
    keys[e.code] = true;
});

document.addEventListener("keyup", (e)=>{
    keys[e.code] = false;
})





function move(){
    if (keys["Space"] && player.y >= 300){
        player.speedy = player.jumpPower;
    }

    if(keys['KeyD']){
        player.x += player.speedx;
    };
    if(keys['KeyA']){
        player.x -= player.speedx;
    };

};


function updateCamera(){
    const centerX = window.innerWidth / 2;

    if(player.x > camera.x + centerX + deadZone){
        camera.x = player.x - centerX - deadZone;
    }
    if(player.x < camera.x + centerX - deadZone){
        camera.x = player.x - centerX + deadZone;
    }

    world.style.transform =
      `translate(${-camera.x}px, ${-camera.y}px)`;
}





function update(){
    move();
    updateCamera()

    player.element.style.left = player.x + "px";
    player.element.style.top = player.y + "px";

    //zwaartekracht
    player.speedy += player.gravaty;
    player.y += player.speedy;

    if (player.y > 300){
        player.y = 300;
    }
    if (player.x < 0){
        player.x = 0
    }

    

    requestAnimationFrame(update);
}
update()