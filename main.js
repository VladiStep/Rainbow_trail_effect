if (!window.requestAnimationFrame)
	window.requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;

var canvas = new fabric.StaticCanvas('scr');
var scr = canvas.getElement();

var imgLoaded = false;
var img1Loaded = false;

var asrielImg = document.getElementById("asrielImg");
asrielImg.onload = () => { imgLoaded = true }
var asrielAfterImg = document.getElementById("asrielAfterImg");
asrielAfterImg.onload = () => { img1Loaded = true }

var loadTimeout = 0;
var loadInt = setInterval(checkLoaded, 50);
function checkLoaded()
{
	if (imgLoaded && img1Loaded)
	{
		clearInterval(loadInt);
		main();
	}
	else if (loadTimeout > 3000)
	{
		alert("Images took too long to load. Try to refresh the page.")
		clearInterval(loadInt);
	}
	
	loadTimeout += 50;
}

function main()
{
	if (asrielImg.width == 0 || asrielAfterImg.width == 0)
		alert("An error occured while loading the images. Try to refresh the page.");
	
	setTimeout("requestAnimationFrame(animateStep)", 500);
}

var h = -11;
var hList = [];
var posList = [];
var t = -1; //mult * 4,708(3); -1
var t1 = 0;
var tStart = -1;
var tMax = 149;
var cX = 320 - 64;
var cY = 18;
var x = cX;
var y = cY;
var scale = 0;
var pos = [];
var limiter = 2; //30 FPS
var mouse = false;
var mode = 1;
var int1;
const m = 1.4117647058823529411764705882353; // 360/255
const colorList = [ [250, 0, 64], [250, 0, 11], [250, 41, 0], [250, 94, 0], [250, 147, 0], [250, 200, 0], [247, 250, 0], [194, 250, 0], [141, 250, 0], [88, 250, 0], [35, 250, 0], [0, 250, 17], [0, 250, 70], [0, 250, 123], [0, 250, 176], [0, 250, 229], [0, 217, 250], [0, 164, 250], [0, 111, 250], [0, 58, 250], [0, 5, 250], [47, 0, 250] ];

for (var i = 0; i < 22; i++)
{
	var imgN = new fabric.Image(asrielAfterImg, {
		left: x,
		top: y,
		opacity: (0.48 - i * 0.02)
	});
	
	canvas.add(imgN);
}

for (var i = 0; i < 22; i++)
{
	posList.push([x, y]);
	hList.push(h);
	
	canvas.item(i).filters.push(new fabric.Image.filters.BlendColor({
		//color: "hsl(" + Math.round((h+256)*m) + ", 100%, 49%)", //250/255
		color: "rgb(" + colorList[i][0] + ", " + colorList[i][1] + ", " + colorList[i][2] + ")",
		mode: "tint"
	}));
	canvas.item(i).applyFilters();
	
	//imgN.sendToBack();
	
	h += 9;
}

var img = new fabric.Image(asrielImg, {
	left: x,
	top: y,
	opacity: 1
});
canvas.add(img);

function startInt() {
	int1 = setInterval(animateStep, 15);
}
function stopInt() {
	clearInterval(int1);
}

function cRound(num)
{
	return Math.round(num * 100) / 100; //round to 0.00
}

function restore()
{
	if (!mouse)
		{
		t = tStart;
		x = cX;
		y = cY;
		
		for (var i = 0; i < 22; i++)
		{
			posList.unshift([x, y]);
			posList.pop();
			
			canvas.item(i).set({left: posList[i][0], top: posList[i][1]});
		}
	}
}

function toggleFPS() {
	if (limiter == 2)
		limiter = 1
	else
		limiter = 2
}
function toggleMouse()
{
	if (mouse)
	{
		mouse = false;
		
		if ('ontouchmove' in window)
			scr.ontouchmove = null
		else
			scr.onmousemove = null
		
		restore();
	}
	else
	{
		mouse = true;
		
		if ('ontouchmove' in window)
			scr.ontouchmove = onTouchMove
		else
			scr.onmousemove = onMouseMove
	}
}
function toggleMode()
{
	if (mode == 1)
	{
		cY = 22;
		tStart = 113;
		mode = 2;
	}
	else
	{
		cY = 18;
		tStart = -1;
		mode = 1;
	}
	
	restore();
}

function onTouchMove(e)
{
	x = e.changedTouches[0].pageX - scr.offsetLeft - 63 - 8;
	y = e.changedTouches[0].pageY - scr.offsetTop - 112;
}
function onMouseMove(e)
{
	x = e.clientX - 63 - 8;
	y = e.clientY - 112;
}

function calcPos()
{
	if (mode == 1)
		return [cRound(x + cRound(Math.cos(t / 24) * 6)),
				cRound(y + cRound(Math.sin(t / 12)))]
	else
	{
		scale = 2 / (3 - Math.cos(2 * t / 24));
		
		return [cRound(cX + cRound(scale * Math.cos(t / 24) * 150)),
				cRound(cY + cRound(scale * Math.sin(2 * t / 24) / 2 * 55))];
	}
}

function animateStep() {
	t1 += 1;
	
	if (t1 >= limiter)
	{
		if (!mouse)
			t += 1;
		
		//console.log(t + " - " + x + ", " + y)
		
		if (!mouse)
		{
			pos = calcPos();
			
			x = pos[0];
			y = pos[1];
		}
		
		img.set({left: Math.round(x), top: Math.round(y)});
		/*canvas.add(new fabric.Image(asrielAfterImg, {
			left: x,
			top: y,
			opacity: 0.5
		}));*/
		
		posList.unshift([x, y]);
		posList.pop();
		
		for (var i = 0; i < 22; i++) {
			canvas.item(i).set({left: posList[i][0], top: posList[i][1]});
		}
		
		t1 = 0;
	}
	
	if (!mouse && t > tMax) //mult * 6,208(3); 149
	{
		t = -1;
	}
	
	canvas.renderAll();
	requestAnimationFrame(animateStep);
}