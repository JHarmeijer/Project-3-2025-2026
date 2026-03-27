//platforms inladen van de world.js
const platformsEl = document.getElementById("platforms");

const platforms = [];


function spawnPlatforms() {
  level.platforms.forEach(p => {
    const el = document.createElement("div");
    el.classList.add("platform");

    el.style.left = p.x + "px";
    el.style.top = p.y + "px";
    el.style.width = p.w + "px";
    el.style.height = p.h + "px";

    platformsEl.appendChild(el);

    platforms.push({
      x: p.x,
      y: p.y,
      w: p.w,
      h: p.h
    });
  });
}


const level = {
  platforms: [
    { x: 0,    y: 350, w: 2000, h: 50  }, // grond
    { x: 300,  y: 280, w: 100,  h: 20  },
    { x: 500,  y: 240, w: 100,  h: 20  },
    { x: 700,  y: 200, w: 100,  h: 20  },
    { x: 1000, y: 300, w: 150,  h: 20  },
  ]
};

