

function $(s){
	return document.querySelectorAll(s);
}

//动态获取歌曲名
var lis = $("#list li");
var size =128;
var box =$("#box")[0];
var height,width;
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
box.appendChild(canvas);
var Dots =[];
var line;

var mv = new MusicVisualizer({
	size:size,
	visualizer:draw
});

for(var i=0;i<lis.length;i++){
	lis[i].onclick=function(){
		for(var j=0;j<lis.length;j++){
			lis[j].className = "";
		}
		this.className="selected";
		// load("/media/"+this.title);
		mv.play("/media/"+this.title);
	}
}




//点状数组随机色

function random(m,n){
	return Math.round(Math.random()*(n-m)+m);
}
function getDots(){
	Dots=[];
	for(var i = 0;i<size;i++){
		var x = random(0,width);
		var y = random(0,height);
		var color = "rgb("+random(100, 250)+","+random(50, 250)+","+random(50, 100)+")";
		Dots.push({
			x:x,
			y:y,
			color:color
		});
	}
}
//定义全局颜色

//绘制柱状图
function resize(){
	height = box.clientHeight;
	width = box.clientWidth;
	canvas.width=width;
	canvas.height= height;
	line = ctx.createLinearGradient(0,0,0,height);
	line.addColorStop(0,"green");
	line.addColorStop(0.5,"#ff0");
	line.addColorStop(0,"#f00");
	getDots();
}
resize();
window.onresize = resize;

function draw(arr){
	ctx.clearRect(0,0,width,height);
	var w = width/size;
	ctx.fillStyle = line;
	for(var i=0;i<size;i++){
		if(draw.type=="column"){
		var h = arr[i]/256 * height;
		ctx.fillRect(w*i,height-h,w*0.6,h);
		}else if(draw.type =="dot"){
			ctx.beginPath();
			var o = Dots[i];
			var r = arr[i]/256*70;
			ctx.arc(o.x,o.y,r,0,Math.PI*2,true);
			// ctx.strokeStyle="#fff";
			// ctx.stroke();
			var g = ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,r);
			g.addColorStop(0,"rgb(255,255,255)");
			g.addColorStop(1,o.color);
			ctx.fillStyle=g;
			ctx.fill();
		}
	}
}
draw.type="column";
//点状图
var types = $("#type li");
for(var i = 0;i<types.length;i++){
	types[i].onclick = function(){
		for(var j=0;j<types.length;j++){
			types[j].className="";
		}
		this.className="selected";
		draw.type=this.getAttribute("data-type");
	}
}
//Ajax获取歌曲




function changeVolume(percent){
	gainNode.gain.value = percent * percent;
}

$("#volume")[0].onchange=function(){
	mv.changeVolume(this.value/this.max);
}
$("#volume")[0].onchange(); 
