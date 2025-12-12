engineSettings(false)
let rwidth = window.innerWidth
let rheight = window.innerHeight
let prefferedAxis = getPrefferedAxis()
let progresses = [0, 0]
let levels = [0, 0]
canvas.width = rwidth
canvas.height = rheight

const UI = document.getElementById("UIStatic")
const UICtx = UI.getContext("2d")
let DEBUG = false
let currentMousePos = [0, 0]
let topBarHeight = rheight / 10
let pad = getPrefferedAxis() / Math.pow(80, 1);
if (pad > 10) pad = 10
rebuildUI()
requestAnimationFrame(render)
function render() {
    ctx.drawImage(UI, 0, 0)
    text(ctx, "HP: " + HP, (rwidth - pad) / 4, topBarHeight / 2 + 10, prefferedAxis / 50 + "px rubik", "center", "white", "orange", 2)
    text(ctx, "Attack: " + attack, (rwidth * 2 - pad) / 2 - (rwidth - pad) / 4, topBarHeight / 2 + 10, prefferedAxis / 50 + "px rubik", "center", "white", "cyan", 2)
    bar(0 + pad, 1 + pad + topBarHeight, "#dc5530ff", "#b64729ff", 0, pad, "Health Bar I: " + levels[0])
    bar(0 + pad + rwidth / 2 - 2.5, 1 + pad + topBarHeight, "#416dc6ff", "#2f5db8ff", 1, pad, "Attack Bar I: " + levels[1])

    drawDebug()

    for (let i = 0; i < progresses.length; i++) {
        if (progresses[i] < 1) {
            progresses[i] += 1 / 100
        } else {
            progresses[i] = 0
            
            levels[i]++
            if (i == 0) HP += Math.ceil((levels[0] * (levels[0] * levels[0] / 100)))
            if (i == 1) attack += Math.ceil((levels[1] * (levels[1] * levels[1] / 200)))
        }
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
    text(ctx, name, x + (rwidth / 2 - pad * 1.5 - 2.5) / 2, y + (rheight / 10) / 1.5, prefferedAxis / 50 + "px rubik", "center", outlineColor, "white", prefferedAxis / 300)
    ctx.restore()
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
    topBarHeight = rheight / 10
    rect(UICtx, 0, 0, rwidth, rheight, "#151519ff", null, null, 0, false)

    rect(UICtx, 0, 0, rwidth, topBarHeight, "#212128ff", null, null, 0, false)
    rect(UICtx, 0 + pad / 2, 0 + pad / 2, rwidth / 2 - pad, topBarHeight - pad, "#16161aff", "#303039ff", 2, 10, false)
    rect(UICtx, rwidth / 2 + pad / 2, 0 + pad / 2, rwidth / 2 - pad, topBarHeight - pad, "#16161aff", "#303039ff", 2, 10, false)
}