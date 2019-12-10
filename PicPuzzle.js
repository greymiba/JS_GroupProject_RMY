'use strict';
const canvas1 = document.getElementById('canvas1');
const ctx1 = canvas1.getContext('2d');
let rhinoImg = new Image(300, 227);
rhinoImg.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';

let iWidth = rhinoImg.naturalWidth;
let iHeight = rhinoImg.naturalHeight;

let tileDivisor = 3;
let tileDimArray = [ Math.floor(iWidth / tileDivisor), Math.floor(iHeight / tileDivisor) ];
canvas1.width = iWidth;
canvas1.height = iHeight;

let ulx = 0;
let uly = 0;
let umx = tileDimArray[0];
let umy = 0;
let urx = tileDimArray[0] * 2;
let ury = 0;

let mlx = 0;
let mly = tileDimArray[1];
let mmx = tileDimArray[0];
let mmy = tileDimArray[1];
let mrx = tileDimArray[0] * 2;
let mry = tileDimArray[1];

let llx = 0;
let lly = tileDimArray[1] * 2;
let lmx = tileDimArray[0];
let lmy = tileDimArray[1] * 2;
let lrx = tileDimArray[0] * 2;
let lry = tileDimArray[1] * 2;

let tilePosArray = [
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

canvas1.style.border = '1px solid red';

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
