'use strict';

var gElCanvas,
    gCtx,
    gIsDown = false;
var colors,
    currShape,
    currPos,
    lastPos,
    isFirst = true;

function onInit() {
    gElCanvas = document.querySelector('canvas');
    gCtx = gElCanvas.getContext('2d');
    colors = { bgc: document.querySelector('#bgc-color').value, bc: document.querySelector('#border-color').value, bw: document.querySelector('#border-width').value, fc: document.querySelector('#fill-color').value };
    onShape(document.querySelector('#shape'));
    resizeCanvas();
    addListeners();
    lastPos = currPos = { x: 0, y: 0 };
    gCtx.fillStyle = colors.bgc;
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height);
}

function renderCanvas() {
    // gCtx.save();

    if (currShape !== 'magic') {
        gCtx.fillStyle = colors.bgc;
        gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height);
    }
    gShapes.forEach(function (shape) {
        gCtx.strokeStyle = shape[1];
        gCtx.fillStyle = shape[2];
        gCtx.lineWidth = shape[3];

        switch (shape[0].currShape) {
            case 'square':
                //{currShape: "square", x: 119, y: 45, dx: 212, dy: 101},"#000000","#000000","4"
                drawSquare(shape[0].x, shape[0].y, shape[0].dx, shape[0].dy, shape[3]);
                break;
            case 'circle':
                //{currentShape: "circle", x:20, y:30, r:50}, "#432fba", "#123456", "0"
                drawCircle(shape[0].x, shape[0].y, shape[0].r, shape[3]);
                break;
            case 'line':
                drawLine(shape[0].sx, shape[0].sy, shape[0].ex, shape[0].ey, shape[3]);
                break;
        }
        if (+shape[3] !== '0') gCtx.stroke();
        gCtx.fill();
    });

    //drawing current draw
    gCtx.strokeStyle = colors.bc;
    gCtx.lineWidth = colors.bw;
    gCtx.fillStyle = colors.fc;
    switch (currShape) {
        case 'square':
            drawSquare(lastPos.x, lastPos.y, currPos.x - lastPos.x, currPos.y - lastPos.y, colors.bw);
            break;
        case 'circle':
            let r = Math.sqrt(Math.pow(lastPos.x - currPos.x, 2) + Math.pow(lastPos.y - currPos.y, 2));
            drawCircle(lastPos.x, lastPos.y, r, colors.bw);
            break;
        case 'line':
            drawLine(lastPos.x, lastPos.y, currPos.x, currPos.y, colors.bw);
            break;
        case 'magic':
            drawRandomRect(lastPos.x, lastPos.y, currPos.x, currPos.y, colors.bw);
            break;
    }
    gCtx.stroke();
    gCtx.fill();
    // gCtx.restore();
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth - 20;
    gElCanvas.height = elContainer.offsetHeight - 20;
}

function onBorderWidth(elBorderWidth) {
    colors.bw = elBorderWidth.value;
}

function onBgcColor(elBgcColor) {
    colors.bgc = elBgcColor.value;
    renderCanvas();
}
function onBorderColor(elBorderColor) {
    colors.bc = elBorderColor.value;
}

function onFillColor(elFillColor) {
    colors.fc = elFillColor.value;
}

function onShape(elShape) {
    currShape = elShape.value;
}

function addListeners() {
    addMouseListeners();
    addTouchListeners();
    window.addEventListener('resize', () => {
        resizeCanvas();
        renderCanvas();
    });
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove);
    gElCanvas.addEventListener('mousedown', onDown);
    gElCanvas.addEventListener('mouseup', onUp);
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove);
    gElCanvas.addEventListener('touchstart', onDown);
    gElCanvas.addEventListener('touchend', onUp);
}

function onDown(ev) {
    lastPos = getEvPos(ev);
    console.log('lastPos : ', lastPos);

    document.body.style.cursor = 'grabbing';
    gIsDown = true;
}

function onMove(ev) {
    if (!gIsDown) return;
    if (currShape === 'magic') {
        lastPos = currPos;
    }
    currPos = getEvPos(ev);
    //check if user is out of canvas area
    if (currPos.x <= 1 || currPos.x >= gElCanvas.width - 1 || currPos.y <= 1 || currPos.y >= gElCanvas.height - 1) {
        onUp(ev);
        return;
    }
    renderCanvas();
}

function onUp(ev) {
    isFirst = true;
    const endPos = getEvPos(ev);
    console.log('endPos : ', endPos);
    switch (currShape) {
        case 'square':
            saveShape({ currShape, x: lastPos.x, y: lastPos.y, dx: currPos.x - lastPos.x, dy: currPos.y - lastPos.y }, colors.bc, colors.fc, colors.bw);
            break;
        case 'circle':
            //{currentShape: "circle", x:20, y:30, r:50}, "#432fba", "#123456", "0"
            let r = Math.sqrt(Math.pow(lastPos.x - currPos.x, 2) + Math.pow(lastPos.y - currPos.y, 2));
            saveShape({ currShape, x: lastPos.x, y: lastPos.y, r }, colors.bc, colors.fc, colors.bw);
            break;
        case 'line':
            saveShape({ currShape, sx: lastPos.x, sy: lastPos.y, ex: currPos.x, ey: currPos.y }, colors.bc, colors.fc, colors.bw);
            break;
    }
    document.body.style.cursor = 'grab';
    gIsDown = false;
}

function onClear() {
    gCtx.fillStyle = colors.bgc;
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height);
    gShapes = [];
}

function onDownload() {
    const data = gElCanvas.toDataURL('image/jpeg'); //.replace('image/png', 'image/octet-stream');

    var element = document.createElement('a');
    element.setAttribute('href', data);
    element.setAttribute('download', 'my-img.jpg');
    element.click();
}

function onUpload(el) {
    var img = new Image();
    img.src = URL.createObjectURL(el.files[0]);
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height); //img,x,y,xend,yend
    };
}
