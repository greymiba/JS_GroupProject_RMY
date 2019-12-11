'use strict';

//difficulty & category variables hold the user-selected puzzle difficulty and picture category.
let difficulty, category;

let canvas1;
let ctx1;
let iWidth; // variable for image width
let iHeight; // variable for image height

let tileDivisor; // image to be divided into tileDivisor*tileDivisor sections
let tileDimArray; // array of tile dimensions, [tile width, tile height]
let tilePosArray2 = [];

// let tilePosArray;

function buildArray() {
	tilePosArray2 = [];

	for (let k = 0; k < difficulty; k++) {
		console.log(`k:${k}`);
		for (let m = 0; m < difficulty; m++) {
			console.log(`m:${m}`);
			tilePosArray2[k * difficulty + m] = {
				x0: m * tileDimArray[0],
				y0: k * tileDimArray[1],
				xCanvas: 0,
				yCanvas: 0
			};
			console.log(tilePosArray2[k * difficulty + m]);
		}
	}
}

function initialize() {
	const canvas1 = document.getElementById('canvas1');
	const ctx1 = canvas1.getContext('2d');
	let rhinoImg = new Image(300, 227);
	rhinoImg.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';
	// rhinoImg.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';
	let form = document.getElementById('form');
	form.addEventListener('submit', validateButton, false);

	iWidth = rhinoImg.width;
	iHeight = rhinoImg.height;
	console.log(`**Debug: difficulty = ${difficulty}`);

	tileDivisor = difficulty ? difficulty : 3;
	tileDimArray = [ Math.floor(iWidth / tileDivisor), Math.floor(iHeight / tileDivisor) ];
	canvas1.width = iWidth;
	canvas1.height = iHeight;
	canvas1.style.border = '1px solid red';

	if (tilePosArray2.length !== 0) {
		buildArray();
	}

	rhinoImg.addEventListener('load', (e) => {

    //////Randomize array.
		for (let k = 0; k < tilePosArray2.length; k++) {
			ctx1.drawImage(
				rhinoImg,
				tilePosArray2[k].x0,
				tilePosArray2[k].y0,
				...tileDimArray,
				tilePosArray2[tilePosArray2.length - k - 1].x0,
				tilePosArray2[tilePosArray2.length - k - 1].y0,
				...tileDimArray
			);
		}
	});

	let pLog = document.getElementById('mouseCoords');
	document.addEventListener('mousemove', logMouse);

	function logMouse(e) {
		pLog.innerHTML = `Screen [X,Y]: [${e.screenX},${e.screenY}]<p> Client[X,Y]:
 [${e.clientX},${e.clientY}]</p><p>Tile Pos Array2 Length: ${tilePosArray2.length}</p><p>Tile Dim2: x-${tileDimArray[0]} y-${tileDimArray[1]}</p><p>Tile Pos Arr ulCoord: x-${tilePosArray2[0]
			.x0} y-${tilePosArray2[0]
			.y0}</p><p>Canvas width: ${canvas1.width}</p><p>Canvas height: ${canvas1.height}</p><p>Image width: ${iWidth}</p><p>Image height: ${iHeight}</p><p>Image Natural width: ${rhinoImg.naturalWidth}</p><p>Image Natural height: ${rhinoImg.naturalHeight}</p>`;
	}
}
// determines selections for difficulty and catergory
function validateButton(e) {
	let difficulties = document.getElementsByName('difficulty');
	let categories = document.getElementsByName('category');
	difficulty = [ ...difficulties ].filter((p) => p.checked)[0].value;
	category = [ ...categories ].filter((p) => p.checked)[0].value;
	e.preventDefault();
	buildArray();
	initialize();

	//***Note:  gameStart() after choices made??

	console.log('****', difficulty);
	console.log('****', category);
} // end initialize
