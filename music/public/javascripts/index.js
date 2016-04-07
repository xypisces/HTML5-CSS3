
function $(s){
	return document.querySelectorAll(s);
}

var lis = $("#list li");
for(var i=0;i<lis.length;i++){
	lis[i].onclick=function(){
		for(var j=0;j<lis.length;j++){
			lis[j].className = "";
		}
		this.className="selected";
		load("/media/"+this.title);
	}
}

var xhr = new XMLHttpRequest();
var ac = new (window.AudioContext||window.webkitAudioContext)();
var gainNode = ac[ac.createGain?"createGain":"createGainNode"]();
gainNode.connect(ac.destination);

var count=0;
var source=null;

function load(url){
	var n = ++count;
	source&&source[source.stop?"stop":"noteOff"]();
	xhr.abort();
	xhr.open("GET",url); 
	xhr.responseType="arraybuffer";
	xhr.onload = function(){
		if (n !=count) return; 
		ac.decodeAudioData(xhr.response,function(buffer){
			if (n !=count) return; 
			var bufferSource = ac.createBufferSource();
			bufferSource.buffer=buffer;
			bufferSource.connect(gainNode);
			bufferSource[bufferSource.start?"start":"noteOn"](0);
			source=bufferSource;
		},function(err){
			console.log(err);
		});
	}
	xhr.send();
}

function changeVolume(percent){
	gainNode.gain.value = percent * percent;
}

$("#volume")[0].onchange=function(){
	changeVolume(this.value/this.max);
}
$("#volume")[0].onchange(); 
