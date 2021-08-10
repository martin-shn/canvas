'use strict';

const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];
var gShapes = [];

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    };
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault();
        ev = ev.changedTouches[0];
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        };
    }
    return pos;
}

function saveShape(currShape, borderColor, fillColor, borderWidth) {
    gShapes.push([currShape, borderColor, fillColor, borderWidth]);
}

function drawSquare(startX, startY, dx, dy, borderWidth) {
    gCtx.fillRect(startX, startY, dx, dy);
    if (borderWidth !== '0') gCtx.strokeRect(startX, startY, dx, dy);
}

function drawCircle(startX, startY, r, borderWidth) {
    gCtx.beginPath();
    gCtx.arc(startX, startY, r, 0, 2 * Math.PI);
    gCtx.fill();
    if (borderWidth !== '0') gCtx.stroke();
}

function drawLine(startX, startY, endX, endY, borderWidth) {
    gCtx.beginPath();
    gCtx.moveTo(startX, startY);
    gCtx.lineTo(endX, endY);
    if (borderWidth !== '0') gCtx.stroke();
}

function drawRandomRect(startX, startY, endX, endY, borderWidth, direction = 1) {
    if (isFirst) {
        isFirst = false;
        return;
    }
    let d = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    let m = (endY - startY) / (endX - startX);
    let m2 = -1 / m;
    let n = endY - m * endX;
    let n2 = startY - m2 * startX;
    // console.log(`y1=${m}x+${n}`);
    // console.log(`y2=${m2}x+${n2}`);
    //y2=m2X+n2  >> X = (y2-n2)/m2
    let Ax = startX + d * direction;
    let Ay = m2 * Ax + n2;
    // console.log('Ax,Ay : ', Ax, Ay);
    let n3 = Ay - m * Ax;
    // console.log(`y3=${m}x+${n3}`);
    let n4 = endY - m2 * endX;
    // console.log(`y4=${m2}x+${n4}`);
    let Bx = (n3 - n4) / (m2 - m);
    let By = m * Bx + n3;
    // console.log('Bx,By : ', Bx, By);
    if (direction === 1) gCtx.beginPath();
    gCtx.moveTo(startX, startY);
    gCtx.lineTo(Ax, Ay);
    // gCtx.moveTo(Ax, Ay);
    gCtx.lineTo(Bx, By);
    // gCtx.moveTo(Bx, By);
    gCtx.lineTo(endX, endY);
    gCtx.moveTo(endX, endY);
    // gCtx.lineTo(startX, startY);
    // gCtx.moveTo(startX, startY);
    if (direction === -1) return;
    else drawRandomRect(startX, startY, endX, endY, borderWidth, -1);
    gCtx.closePath();
    gCtx.fill();
    if (borderWidth !== '0') gCtx.stroke();
}
