import kaboom from "./libs/kaboom.mjs"

kaboom({
    width: 1280,
    height: 720,
    letterbox: true
}) 


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

go("menu")
