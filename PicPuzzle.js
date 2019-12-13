'use strict';
let form;

let difficulty, category; //difficulty & category variables hold the user-selected puzzle difficulty and picture category.

let canvas1;
let ctx1;
let sourceImg;

let iWidth; // variable for image width
let iHeight; // variable for image height
let oWidth;
let oHeight;

let tileDivisor; // image to be divided into tileDivisor*tileDivisor sections
let tileDimArrayScaled; // array of scaled tile dimensions, [ width,  height]
let tileDimArray0; // array of original tile dimensions, [ width,  height]
let tilePosArray0 = [];

let tileCurrentlySelected = false;
let tileTint = '#7dee61';

let puzzleSolved = false;
let tilesInOrder = true;
let tile1Index;
let tile2Index;

function initialize() {
	form = document.getElementById('form');
	form.addEventListener('submit', validateButton, false);
}

function validateButton(e) {
	let difficulties = document.getElementsByName('difficulty');
	let categories = document.getElementsByName('category');
	difficulty = [...difficulties].filter((p) => p.checked)[0].value;
	category = [...categories].filter((p) => p.checked)[0].value;

	// console.log('****', difficulty);
	// console.log('****', category);

	e.preventDefault();
	setImage();
}

function setImage() {
	sourceImg = new Image(300 * 2, 230 * 2);
	sourceImg.src = assignImage(category);
	// sourceImg.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';

	sourceImg.addEventListener('load', setCanvas, false);
}

function assignImage(categoryPick) {
	switch (categoryPick) {
		case 'travel':
			return 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.nationaltrust.org.uk%2Fimages%2F1431747858549-stourhead-autumn-nov-2013-2.jpg&f=1&nofb=1';
			break;
		case 'movies':
			return 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn3.movieweb.com%2Fi%2Farticle%2FOsq3U5y34HTQpCBbV0DlZ3p7CSwyqj%2F1200%3A100%2FAvengers-Endgame-Posters.jpg&f=1&nofb=1';
			break;
		case 'space':
			return 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fapod.nasa.gov%2Fapod%2Fimage%2F1705%2FArp273Main_HubblePestana_1080.jpg&f=1&nofb=1';
			break;
	}
}

function setCanvas() {
	canvas1 = document.getElementById('canvas1');
	ctx1 = canvas1.getContext('2d');

	oWidth = sourceImg.naturalWidth;
	oHeight = sourceImg.naturalHeight;
	iWidth = sourceImg.width;
	iHeight = sourceImg.height;

	tileDivisor = difficulty;
	tileDimArrayScaled = [Math.floor(iWidth / tileDivisor), Math.floor(iHeight / tileDivisor)];
	tileDimArray0 = [Math.floor(oWidth / tileDivisor), Math.floor(oHeight / tileDivisor)];

	canvas1.width = iWidth;
	canvas1.height = iHeight;
	canvas1.style.border = '1px solid red';
	buildArray();
	reTileImage();

	//document.addEventListener('mousemove', debugVals);
}

function buildArray() {
	tilePosArray0 = [];

	for (let k = 0; k < difficulty; k++) {
		//console.log(`k:${k}`); //**For Debug */
		for (let m = 0; m < difficulty; m++) {
			//console.log(`m:${m}`); //**For Debug */
			tilePosArray0[k * difficulty + m] = {
				x0: m * tileDimArray0[0],
				y0: k * tileDimArray0[1],
				xCanvasPosProper: m * tileDimArrayScaled[0],
				yCanvasPosProper: k * tileDimArrayScaled[1],
				xCanvasPosPresent: 0,
				yCanvasPosPresent: 0
			};
			//console.log(tilePosArray0[k * difficulty + m]); //**For Debug */
		}
	}
}

function reTileImage(e) {
	let tempArr = shuffle(tilePosArray0.length);
	for (let k = 0; k < tilePosArray0.length; k++) {
		ctx1.drawImage(
			sourceImg,
			tilePosArray0[k].x0,
			tilePosArray0[k].y0,
			...tileDimArray0,
			tilePosArray0[tempArr[k]].xCanvasPosProper,
			tilePosArray0[tempArr[k]].yCanvasPosProper,
			// tilePosArray0[k].xCanvasPosProper,
			// tilePosArray0[k].yCanvasPosProper,
			...tileDimArrayScaled
		);
		tilePosArray0[k].xCanvasPosPresent = tilePosArray0[tempArr[k]].xCanvasPosProper;
		tilePosArray0[k].yCanvasPosPresent = tilePosArray0[tempArr[k]].yCanvasPosProper;
	}
	// hide the intro screen, show the puzzle screen
	introScreen.style.display = 'none';
	puzzle.style.display = 'block';
	canvas1.addEventListener('mousedown', getCursorPos);
}

function shuffle(number) {
	let array = [];
	for (let i = 0; i < number; i++) {
		array.push(i);
	}
	let currentIndex = array.length,
		temporaryValue,
		randomIndex;

	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array.slice(); // return a new array containing values in random order.
}

function getCursorPos(eventA) {
	const rectangle = canvas1.getBoundingClientRect();
	const x = Math.floor(eventA.clientX - rectangle.left);
	const y = Math.floor(eventA.clientY - rectangle.top);
	// console.log(`Canvas X: ${x}  Canvas Y: ${y}`);

	selectTile(x, y);
}

// determines what tile has been selected on the puzzle using coordinates
function selectTile(mouseX, mouseY) {
	if (mouseX >= 0 && mouseX <= iWidth && mouseY >= 0 && mouseY <= iHeight) {
		let tile;
		let offsetX = tileDimArrayScaled[0];
		let offsetY = tileDimArrayScaled[1];

		for (let index = 0; index < tilePosArray0.length; index++) {
			tile = tilePosArray0[index];
			if (
				mouseX >= tile.xCanvasPosPresent &&
				mouseX < tile.xCanvasPosPresent + offsetX &&
				mouseY >= tile.yCanvasPosPresent &&
				mouseY < tile.yCanvasPosPresent + offsetY
			) {
				if (!tileCurrentlySelected) {
					tile1Index = index;
					markSelectedTile(index);
				} else {
					tile2Index = index;
					markSelectedTile(index); //Arbitrarily highlight tilePosArray0[2]
					setTimeout(swapTiles, 500, tile1Index, tile2Index);
				}
			}
		}
	}
}

// loops over tilePosArray0 to compare x / y values for proper and present position in current object
// if not equal, keep playing. If entire array has been checked and all items are equal, then puzzle has been solved.
function checkWinCondition() {
	for (let i = 0; i < tilePosArray0.length; i++) {
		if (tilePosArray0[i]['xCanvasPosProper'] !== tilePosArray0[i]['xCanvasPosPresent'] ||
			tilePosArray0[i]['yCanvasPosProper'] !== tilePosArray0[i]['yCanvasPosPresent']) {
			return;
		}
	}
	puzzleSolved = true;
	canvas1.removeEventListener('mousedown', getCursorPos);
}

function swapTiles(piece1Index, piece2Index) {
	let tempX = tilePosArray0[piece2Index].xCanvasPosPresent;
	let tempY = tilePosArray0[piece2Index].yCanvasPosPresent;
	tilePosArray0[piece2Index].xCanvasPosPresent = tilePosArray0[piece1Index].xCanvasPosPresent;
	tilePosArray0[piece2Index].yCanvasPosPresent = tilePosArray0[piece1Index].yCanvasPosPresent;
	tilePosArray0[piece1Index].xCanvasPosPresent = tempX;
	tilePosArray0[piece1Index].yCanvasPosPresent = tempY;

	ctx1.clearRect(0, 0, iWidth, iHeight);
	for (let k = 0; k < tilePosArray0.length; k++) {
		ctx1.drawImage(
			sourceImg,
			tilePosArray0[k].x0,
			tilePosArray0[k].y0,
			...tileDimArray0,
			tilePosArray0[k].xCanvasPosPresent,
			tilePosArray0[k].yCanvasPosPresent,
			// tilePosArray0[k].xCanvasPosProper,
			// tilePosArray0[k].yCanvasPosProper,
			...tileDimArrayScaled
		);
	}
	checkWinCondition();
}

function markSelectedTile(index) {
	ctx1.save();
	ctx1.globalAlpha = 0.4;
	ctx1.fillStyle = tileTint;
	ctx1.fillRect(
		tilePosArray0[index].xCanvasPosPresent,
		tilePosArray0[index].yCanvasPosPresent,
		...tileDimArrayScaled
	);
	ctx1.restore();
	tileCurrentlySelected = !tileCurrentlySelected;
}

function debugVals(e) {
	let pLog = document.getElementById('mouseCoords');
	pLog.style.fontSize = '10px';

	pLog.innerHTML = `Screen [X,Y]: [${e.screenX},${e.screenY}]<p> Client[X,Y]:
      [${e.clientX},${e.clientY}]</p><p>Tile Pos Array2 Length: ${tilePosArray0.length}</p><p>Tile Dim2: x-${tileDimArrayScaled[0]} y-${tileDimArrayScaled[1]}</p><p>Tile Pos Arr ulCoord: x-${tilePosArray0[0]
			.x0} y-${tilePosArray0[0]
				.y0}</p><p>Canvas width: ${canvas1.width}</p><p>Canvas height: ${canvas1.height}</p><p>Image width: ${iWidth}</p><p>Image height: ${iHeight}</p><p>Image Natural width: ${sourceImg.naturalWidth}</p><p>Image Natural height: ${sourceImg.naturalHeight}</p>`;
}
