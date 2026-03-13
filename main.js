//import kaboom from "./libs/kaboom.mjs"

//kaboom({
    //width: 1280,
    //height: 720,
    //letterbox: true
//}) 

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


let currentLevel = null;
let currentLevelNumber = null;
let gamestate = "menu";
let keys = {};
let gravity = 0.5;
let score = 0;

const scenes = {
    menu: () => {
        add([text("test")])

    },
    controls: () => {

    },
    level1: () => {
        
    },
    level2: () => {

    },
    level3: () => {

    },
    gameover: () => {

    },
    end: () => {

    }
}

for (const key in scenes) {
    scene(key, scenes[key])
}

let player;

go("menu")
