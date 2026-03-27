const level = {
  platforms: [
    // ===== GROUND (veilig, geen vallen) =====
    { x: 0, y: 360, w: 3000, h: 40 },

    // ===== SECTIE 1: Intro (makkelijk) =====
    { x: 200, y: 300, w: 120, h: 20 },
    { x: 350, y: 260, w: 120, h: 20 },
    { x: 500, y: 220, w: 120, h: 20 },

    // ===== SECTIE 2: kleine klim =====
    { x: 700, y: 300, w: 100, h: 20 },
    { x: 820, y: 260, w: 100, h: 20 },
    { x: 940, y: 220, w: 100, h: 20 },
    { x: 1060, y: 180, w: 100, h: 20 },

    // ===== SECTIE 3: brede sprongen =====
    { x: 1300, y: 300, w: 180, h: 20 },
    { x: 1550, y: 260, w: 180, h: 20 },
    { x: 1800, y: 300, w: 180, h: 20 },

    // ===== SECTIE 4: zigzag omhoog =====
    { x: 2100, y: 300, w: 100, h: 20 },
    { x: 2200, y: 250, w: 100, h: 20 },
    { x: 2300, y: 200, w: 100, h: 20 },
    { x: 2400, y: 150, w: 100, h: 20 },

    // ===== SECTIE 5: eind plateau =====
    { x: 2600, y: 300, w: 300, h: 20 }
  ],

  // ✅ NIEUW: enemies
  enemies: [
    { x: 400, y: 300 },
    { x: 900, y: 200 },
    { x: 1500, y: 260 },
    { x: 2000, y: 300 },
    { x: 2400, y: 120 },
    { x: 2700, y: 300 }
  ]
};