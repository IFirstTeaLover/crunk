engineSettings(true)
let rwidth = window.innerWidth
let rheight = window.innerHeight
let prefferedAxis = getPrefferedAxis()
let progresses = [0, 0]
let levels = [0, 0]
canvas.width = rwidth
canvas.height = rheight

const UI = document.getElementById("UIStatic")
const UICtx = UI.getContext("2d")

const UIOverlay = document.getElementById("UIStaticOverlay")
const UIOCtx = UIOverlay.getContext("2d")
let DEBUG = false
let currentMousePos = [0, 0]
let topMenuHeight = rheight / 10
let bottomMenuHeight = rheight / 10
let pad = getPrefferedAxis() / Math.pow(80, 1);
if (pad > 10) pad = 10
let delta
let fps = 60
let lastTimestamp = Date.now()
let currentScene = "bars"
let additiveAnimationScene
let cameraOffset = 0
let buttons = []

addBufferImage("images/upgrades/faster_health.png")

requestAnimationFrame(render)
rebuildUI()
function render(timestamp) {
    delta = getDelta(timestamp)
    fps = Math.round(1000 / delta)
    lastTimestamp = timestamp
    ctx.drawImage(UI, 0, 0)
    ctext(ctx, "HP: " + HP, (rwidth - pad) / 4, topMenuHeight / 2 + 10, prefferedAxis / 50 + "px rubik", "center", "white", "orange", 2)
    ctext(ctx, "Attack: " + attack, (rwidth * 2 - pad) / 2 - (rwidth - pad) / 4, topMenuHeight / 2 + 10, prefferedAxis / 50 + "px rubik", "center", "white", "cyan", 2)

    if (currentScene == "bars" || additiveAnimationScene == "bars") drawBars()
    ctext(ctx, "FPS: " + fps, rwidth - 10, rheight - 15 - bottomMenuHeight, "32px rubik", "right", "white", null, 0)
    drawDebug()

    for (let i = 0; i < progresses.length; i++) {
        if (progresses[i] < 1) {
            progresses[i] += (0.5 / fps)
            if (progresses[i] < 0) {
                progresses[i] = 0
            }
        } else {
            progresses[i] = 0

            levels[i]++
            if (i == 0) HP += Math.ceil((levels[0] * (levels[0] * levels[0] / 100)))
            if (i == 1) attack += Math.ceil((levels[1] * (levels[1] * levels[1] / 200)))
        }
    }
    if (currentScene == "shop" || additiveAnimationScene == "shop"){
        ctx.drawImage(UIOverlay, rwidth-cameraOffset, 0)
    }
    requestAnimationFrame(render)
}

function bar(x, y, color, outlineColor, id, pad, name) {
    ctx.save()
    rect(ctx, x, y, rwidth / 2 - pad * 1.5 - 2.5, rheight / 10 - 2, "#212224ff", "#313437ff", 5, 10, false)
    ctx.clip()
    let outline = 5
    if (progresses[id] < 0.1) {
        outline = progresses[id] * 50
        if (outline > 5) outline = 5
    }
    rect(ctx, x + 5, y + 5, (rwidth / 2 - pad * 2) * progresses[id], rheight / 10 - 12, color, outlineColor, outline, 7, false)
    ctext(ctx, name, x + (rwidth / 2 - pad * 1.5 - 2.5) / 2, y + (rheight / 10) / 1.5, prefferedAxis / 50 + "px rubik", "center", outlineColor, "white", prefferedAxis / 300)
    ctx.restore()
}

function shop(y, image, text, id) {
    rect(UIOCtx, pad, pad + topMenuHeight + y, rwidth - pad * 2, rheight / 7.5, "#212224ff", "#313437ff", 5, 10, false)
    drawImageFromBuffer(UIOCtx, image, pad * 2, pad * 2 + topMenuHeight + y, (rheight / 7.5 - pad * 2) * 1.2, rheight / 7.5 - 2 - pad * 2)
    ctext(UIOCtx, text, pad * 2 + (rheight / 7.5 - pad * 2) * 1.2 + rwidth / 100 + y, pad + topMenuHeight + (rheight / 7.5) / 2.2, prefferedAxis / 40 + "px rubik", "left", "#dc5530ff", "#ffffffff")
    ctext(UIOCtx, "Price: " + upgradePrices[id] + "🪙", pad * 2 + (rheight / 7.5 - pad * 2) * 1.2 + rwidth / 100 + y, pad + topMenuHeight + (rheight / 7.5) / 1.2, prefferedAxis / 60 + "px rubik", "left", "#46c938ff", "#ffffffff")
    ctext(UIOCtx, "Level " + upgradeLevels[id], rwidth - pad * 2, pad + topMenuHeight + (rheight / 7.5) / 1.2, prefferedAxis / 60 + "px rubik", "right", "#46c938ff", "#ffffffff")
    buttons.push({ x: pad, y: pad + topMenuHeight + y, xs: rwidth - pad * 2, ys: rheight / 7.5 })
}

canvas.addEventListener("mousemove", (e) => {
    currentMousePos[0] = e.offsetX
    currentMousePos[1] = e.offsetY
})

window.addEventListener("resize", (e) => {
    ctx.clearRect(0, 0, rwidth, rheight)
    rwidth = window.innerWidth
    rheight = window.innerHeight
    canvas.width = rwidth
    canvas.height = rheight
    prefferedAxis = getPrefferedAxis()
    let pad = getPrefferedAxis() / Math.pow(80, 1);
    if (pad > 10) pad = 10
    canvasResized()
    rebuildUI()
})

function drawDebug() {
    if (DEBUG) {
        path(ctx, [{ "x": rwidth / 2, "y": 0 }, { "x": rwidth / 2, "y": rheight }], "red", 2, "round")
        path(ctx, [{ "x": 0, "y": rheight / 2 }, { "x": rwidth, "y": rheight / 2 }], "blue", 2, "round")
        path(ctx, [{ "x": 0, "y": currentMousePos[1] }, { "x": rwidth, "y": currentMousePos[1] }], "yellow", 2)
        path(ctx, [{ "x": currentMousePos[0], "y": 0 }, { "x": currentMousePos[0], "y": rheight }], "orange", 2)
        ctx.font = "16px monospace"
        ctx.fillStyle = "white"
        ctx.fillText("X: " + currentMousePos[0] + " Y: " + currentMousePos[1], currentMousePos[0] + 5, currentMousePos[1] - 5)
    } else return
}

function rebuildUI() {
    UI.width = rwidth
    UI.height = rheight
    UIOverlay.width = rwidth
    UIOverlay.height = rheight
    topMenuHeight = rheight / 10
    pad = getPrefferedAxis() / Math.pow(80, 1);
    if (pad > 10) pad = 10
    rect(UICtx, 0, 0, rwidth, rheight, "#151519ff", null, null, 0, false)

    rect(UICtx, 0, 0, rwidth, topMenuHeight, "#212128ff", null, null, 0, false)
    rect(UICtx, 0 + pad / 2, 0 + pad / 2, rwidth / 2 - pad, topMenuHeight - pad, "#16161aff", "#303039ff", 2, 10, false)
    rect(UICtx, rwidth / 2 + pad / 2, 0 + pad / 2, rwidth / 2 - pad, topMenuHeight - pad, "#16161aff", "#303039ff", 2, 10, false)

    bottomMenuHeight = rheight / 10
    rect(UICtx, -rheight / 150, rheight - bottomMenuHeight - rheight / 300, rwidth + rheight / 75, rheight + rheight / 150, "#101013ff", "#242429ff", rheight / 150, 0, false)
    rect(UICtx, rheight / 75, rheight - bottomMenuHeight + rheight / 75, bottomMenuHeight - rheight / 37.5, bottomMenuHeight - rheight / 37.5, "#1b1b1fff", "#3c3c42ff", rheight / 150, rheight / 75, false)
    rect(UICtx, (rheight / 75) * 8, rheight - bottomMenuHeight + rheight / 75, bottomMenuHeight - rheight / 37.5, bottomMenuHeight - rheight / 37.5, "#1b1b1fff", "#3c3c42ff", rheight / 150, rheight / 75, false)
    buttons.push({ "x": rheight / 75, "y": rheight - bottomMenuHeight + rheight / 75, "xs": bottomMenuHeight - rheight / 37.5, "ys": bottomMenuHeight - rheight / 37.5 })
    buttons.push({ "x": (rheight / 75) * 8, "y": rheight - bottomMenuHeight + rheight / 75, "xs": bottomMenuHeight - rheight / 37.5, "ys": bottomMenuHeight - rheight / 37.5 })
    // rect(UICtx, (rheight / 75) * 15, rheight - bottomMenuHeight + rheight / 75, bottomMenuHeight - rheight / 37.5, bottomMenuHeight - rheight / 37.5, "#1b1b1fff", "#3c3c42ff", 5, 7, false)
    // rect(UICtx, (rheight / 75) * 22, rheight - bottomMenuHeight + rheight / 75, bottomMenuHeight - rheight / 37.5, bottomMenuHeight - rheight / 37.5, "#1b1b1fff", "#3c3c42ff", 5, 7, false)
    // rect(UICtx, (rheight / 75) * 29, rheight - bottomMenuHeight + rheight / 75, bottomMenuHeight - rheight / 37.5, bottomMenuHeight - rheight / 37.5, "#1b1b1fff", "#3c3c42ff", 5, 7, false)
    shop(0, 0, "Faster health bar", 0)
}

function drawBars() {
    bar(0 + pad - cameraOffset, 1 + pad + topMenuHeight, "#dc5530ff", "#b64729ff", 0, pad, "Health Bar I: " + levels[0])
    bar(0 + pad + rwidth / 2 - 2.5 - cameraOffset, 1 + pad + topMenuHeight, "#416dc6ff", "#2f5db8ff", 1, pad, "Attack Bar I: " + levels[1])
}

canvas.addEventListener("click", (e) => {
    let cx = e.offsetX
    let cy = e.offsetY
    let index = 0
    buttons.forEach(button => {
        if (cx > button.x && cx < button.x + button.xs && cy > button.y && cy < button.y + button.ys) {
            switch (index) {
                case 0:
                    switchScene(0, "bars")
                    break;

                case 1:
                    switchScene(rwidth, "shop")
                    break;
            }
        }
        index++
    })
})

function switchScene(target, scene) {
    if (scene == currentScene) return
    if (additiveAnimationScene) return
    const interval = setInterval(() => {
        additiveAnimationScene = scene
        cameraOffset += (target - cameraOffset) / 10

        if (Math.abs(target - cameraOffset) < 1) {
            cameraOffset = target
            clearInterval(interval)
            currentScene = scene
            additiveAnimationScene = null
        }
    }, 5)

}