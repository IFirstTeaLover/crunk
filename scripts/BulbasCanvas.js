const canvas = document.getElementById("gameCanvas")
let bulbasCanvasOldTimestamp
let bulbasCanvasDelta
const ctx = canvas.getContext("2d")
var imagesBuffer = []
var settings
function rect(ctx,x, y, w, h, fillColor, strokeColor, strokeSize, round, centered) {
    ctx.beginPath()
    ctx.strokeStyle = strokeColor
    ctx.fillStyle = fillColor
    ctx.lineWidth = strokeSize

    let pasteX = x
    let pasteY = y
    if (centered) { pasteX = x - w / 2; pasteY = y - h / 2 }
    if (round > 0) {
        ctx.roundRect(pasteX, pasteY, w, h, round)
    } else {
        ctx.rect(pasteX, pasteY, w, h)
    }

    if (fillColor) ctx.fill()
    if (strokeColor, strokeSize) {
        ctx.stroke()
    }
    ctx.closePath()

}

function circle(ctx, x, y, r, fillColor, strokeColor, strokeSize, arc) {
    ctx.beginPath()
    if (!arc) {
        ctx.arc(x, y, r, 0, Math.PI * 2)
    } else {
        if (arc > 1) {
            ctx.arc(x, y, r, 0, arc)
        } else { console.error("Arc is less than one!") }
    }
    ctx.strokeStyle = strokeColor
    ctx.fillStyle = fillColor
    ctx.lineWidth = strokeSize

    if (fillColor) ctx.fill()
    if (strokeColor) ctx.stroke()
    ctx.closePath()
}

function image(ctx,imageSource, x, y) {
    let thisImage = null
    for (const img of imagesBuffer) {
        if (img.src === new URL(imageSource, window.location.href).href) {
            thisImage = img;
            break;
        }
    }

    if (!thisImage) {
        thisImage = new Image()
        thisImage.src = imageSource
        imagesBuffer.push(thisImage)
    }

    ctx.drawImage(thisImage, x - thisImage.width / 2, y - thisImage.height / 2)
}

function addBufferImage(source) {
    try {
        let thisImage = null
        for (const img of imagesBuffer) {
            if (img.src === new URL(source, window.location.href).href) {
                thisImage = img;
                throw new Error("Image was already buffered!!! It WILL blow up if you dont fix it...")
                break;
            }
        }

        if (!thisImage) {
            thisImage = new Image()
            thisImage.dataset = { src: (window.location.href).href };
            thisImage.src = source
            imagesBuffer.push(thisImage)
        }
    } catch (e) { console.warn(e) }
}

function bufferImageInfo(id, info) {
    if (info == "w") {
        return imagesBuffer[id].width
    }
    if (info == "h") {
        return imagesBuffer[id].height
    }
}

function drawImageFromBuffer(ctx, id, x, y, w, h, c) {
    let iw = w
    let ih = h
    if (w == undefined) iw = id.width
    if (h == undefined) ih = id.height
    if (c) {
        try { ctx.drawImage(imagesBuffer[id], x, y, iw, ih); } catch (e) { console.warn(e) }
    } else {
        try { ctx.drawImage(imagesBuffer[id], x, y, iw, ih); } catch (e) { console.warn(e) }
    }

}

function path(ctx, points, color, thickness, cap) {
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineCap = cap ?? "round"

    ctx.lineWidth = thickness
    ctx.moveTo(points[0].x, points[0].y)
    points.forEach(i => {
        ctx.lineTo(i.x, i.y)
    });
    ctx.stroke()
    ctx.closePath()
}

function engineSettings(ise) {
    ctx.imageSmoothingEnabled = ise
    settings = ise
}

function canvasResized() {
    engineSettings(settings)
}

function getPrefferedAxis() {
    let prefAX
    try {
        if (rheight > rwidth) {
            prefAX = rheight
        } else {
            prefAX = rwidth
        }
    } catch (e) { console.log("Failed to get preffered Axis: " + e + ", Most likely caused by render.js not being loaded yet") }
    return prefAX
}

function nineSlice(imageSRC, sliceSize) {
    let image = new Image()
    image.src = imageSRC
    const w = image.width
    const h = image.height
    const L = sliceSize.L
    const R = sliceSize.R
    const B = sliceSize.B
    const T = sliceSize.T

    const sliced = {
        tl: [0, 0, L, T],
        t: [L, 0, w - L - R, T],
        tr: [w - R, 0, R, T],

        l: [0, T, L, h - T - B],
        c: [L, T, w - L - R, h - T - B],
        r: [w - R, T, R, h - T - B],

        bl: [0, h - B, L, B],
        b: [L, h - B, w - L - R, B],
        br: [w - R, h - B, R, B],
        //You will never undestand this hahaha
    }
    image.remove()
    return sliced
}

function numberTo2DGrid(number, rows, columns, debug) {
    let thisX = ((number - 1) % rows) + 1;
    let thisY = Math.floor((number - 1) / rows) + 1;
    if (debug) console.log("X:", thisX, "Y:", thisY);
    return { "x": thisX, "y": thisY }
}

function ctext(ctx, text, x, y, font, align, color, outlineColor, outlineSize) {
    ctx.font = font
    ctx.textAlign = align
    ctx.fillStyle = color
    ctx.strokeStyle = outlineColor
    ctx.lineWidth = outlineSize

    if (outlineColor) ctx.strokeText(text, x, y)
    if (color) ctx.fillText(text, x, y)
}

function getDelta(timestamp){
    bulbasCanvasDelta = (timestamp - bulbasCanvasOldTimestamp)
    bulbasCanvasOldTimestamp = timestamp
    return bulbasCanvasDelta
}