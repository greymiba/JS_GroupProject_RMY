'use strict';
let canvas1;
let ctx1;
let iWidth;
let iHeight;

let tileDivisor;
let tileDimArray;
let ulx;
let uly;
let umx;
let umy;
let urx;
let ury;

let mlx;
let mly;
let mmx;
let mmy;
let mrx;
let mry;

let llx;
let lly;
let lmx;
let lmy;
let lrx;
let lry;

let tilePosArray;

function initialize() {
	const canvas1 = document.getElementById('canvas1');
	const ctx1 = canvas1.getContext('2d');
	let rhinoImg = new Image(300, 227);
	rhinoImg.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';

	iWidth = rhinoImg.naturalWidth;
	iHeight = rhinoImg.naturalHeight;

	tileDivisor = 3;
	tileDimArray = [ Math.floor(iWidth / tileDivisor), Math.floor(iHeight / tileDivisor) ];
	canvas1.width = iWidth;
	canvas1.height = iHeight;
	canvas1.style.border = '1px solid red';


ulx = 0;
uly = 0;
umx = tileDimArray[0];
umy = 0;
urx = tileDimArray[0] * 2;
ury = 0;

mlx = 0;
mly = tileDimArray[1];
mmx = tileDimArray[0];
mmy = tileDimArray[1];
mrx = tileDimArray[0] * 2;
mry = tileDimArray[1];

llx = 0;
lly = tileDimArray[1] * 2;
lmx = tileDimArray[0];
lmy = tileDimArray[1] * 2;
lrx = tileDimArray[0] * 2;
lry = tileDimArray[1] * 2;

tilePosArray = [
	[ ulx, uly ],
	[ umx, umy ],
	[ urx, ury ],
	[ mlx, mly ],
	[ mmx, mmy ],
	[ mrx, mry ],
	[ llx, lly ],
	[ lmx, lmy ],
	[ lrx, lry ]
];


rhinoImg.addEventListener('load', (e) => {
	//ctx1.drawImage(rhinoImg,0,0,iWidth,iHeight,0,0,iWidth,iHeight);

	for (let k = 0; k < tilePosArray.length; k++) {
		ctx1.drawImage(
			rhinoImg,
			...tilePosArray[k],
			...tileDimArray,
			...tilePosArray[tilePosArray.length - k - 1],
			...tileDimArray
		);
	}
});

let pLog = document.getElementById('mouseCoords');
document.addEventListener('mousemove', logMouse);

function logMouse(e) {
	pLog.innerHTML = `Screen [X,Y]: [${e.screenX},${e.screenY}]<p> Client[X,Y]:
 [${e.clientX},${e.clientY}]</p><p>Tile Pos Array Length: ${tilePosArray.length}</p><p>Canvas width: ${canvas1.width}</p><p>Canvas height: ${canvas1.height}</p><p>Image width: ${iWidth}</p><p>Image height: ${iHeight}</p><p>Image Natural width: ${rhinoImg.naturalWidth}</p><p>Image Natural height: ${rhinoImg.naturalHeight}</p>`;
}
}