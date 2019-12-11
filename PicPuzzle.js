'use strict';

//difficulty & category variables hold the user-selected puzzle difficulty and picture category.
let difficulty, category;

let canvas1;
let ctx1;
let rhinoImg;

let iWidth; // variable for image width
let iHeight; // variable for image height
let oWidth;
let oHeight;

let tileDivisor; // image to be divided into tileDivisor*tileDivisor sections
let tileDimArrayScaled; // array of tile dimensions, [tile width, tile height]
let tileDimArray0;
let tilePosArray0 = [];

// let tilePosArray;

function buildArray() {
	tilePosArray0 = [];

	for (let k = 0; k < difficulty; k++) {
		//console.log(`k:${k}`); //**For Debug */
		for (let m = 0; m < difficulty; m++) {
			//console.log(`m:${m}`); //**For Debug */
			tilePosArray0[k * difficulty + m] = {
				x0: m * tileDimArray0[0],
				y0: k * tileDimArray0[1],
				xCanvas: m * tileDimArrayScaled[0],
				yCanvas: k * tileDimArrayScaled[1]
			};
			//console.log(tilePosArray0[k * difficulty + m]); //**For Debug */
		}
	}
}

function initialize() {
	canvas1 = document.getElementById('canvas1');
	ctx1 = canvas1.getContext('2d');
	rhinoImg = new Image(600, 454);
	rhinoImg.src =
		'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.nationaltrust.org.uk%2Fimages%2F1431747858549-stourhead-autumn-nov-2013-2.jpg&f=1&nofb=1';
	// rhinoImg.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';
	let form = document.getElementById('form');
	form.addEventListener('submit', validateButton, false);

	iWidth = rhinoImg.width;
	iHeight = rhinoImg.height;
	oWidth = rhinoImg.naturalWidth;
	oHeight = rhinoImg.naturalHeight;
	//console.log(`**Debug: difficulty = ${difficulty}`);

	tileDivisor = difficulty ? difficulty : 3;
	tileDimArrayScaled = [ Math.floor(iWidth / tileDivisor), Math.floor(iHeight / tileDivisor) ];
	tileDimArray0 = [ Math.floor(oWidth / tileDivisor), Math.floor(oHeight / tileDivisor) ];

	canvas1.width = iWidth;
	canvas1.height = iHeight;
	canvas1.style.border = '1px solid red';

	if (tilePosArray0.length !== 0) {
		buildArray();
	}

	rhinoImg.addEventListener('load', (e) => {
		//////Randomize array.
		for (let k = 0; k < tilePosArray0.length; k++) {
			ctx1.drawImage(
				rhinoImg,
				tilePosArray0[k].x0,
				tilePosArray0[k].y0,
				...tileDimArray0,
				tilePosArray0[tilePosArray0.length - k - 1].xCanvas,
				tilePosArray0[tilePosArray0.length - k - 1].yCanvas,
				// tilePosArray0[k].xCanvas,
				// tilePosArray0[k].yCanvas,
				...tileDimArrayScaled
			);
		}
	});

	document.addEventListener('mousemove', debugVals,false);
}

function debugVals(e) {
  let pLog = document.getElementById('mouseCoords');
  pLog.style.fontSize = '10px';

	pLog.innerHTML = `Screen [X,Y]: [${e.screenX},${e.screenY}]<p> Client[X,Y]:
      [${e.clientX},${e.clientY}]</p><p>Tile Pos Array2 Length: ${tilePosArray0.length}</p><p>Tile Dim2: x-${tileDimArrayScaled[0]} y-${tileDimArrayScaled[1]}</p><p>Tile Pos Arr ulCoord: x-${tilePosArray0[0]
		.x0} y-${tilePosArray0[0]
		.y0}</p><p>Canvas width: ${canvas1.width}</p><p>Canvas height: ${canvas1.height}</p><p>Image width: ${iWidth}</p><p>Image height: ${iHeight}</p><p>Image Natural width: ${rhinoImg.naturalWidth}</p><p>Image Natural height: ${rhinoImg.naturalHeight}</p>`;
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
	// hide the intro screen, show the puzzle screen
	introScreen.style.display = 'none';
	puzzle.style.display = 'block';
} // end initialize
