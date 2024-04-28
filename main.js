(function ($global) { "use strict";
var Main = function() { };
Main.__name__ = true;
Main.main = function() {
	console.log("src/Main.hx:5:","Haxe connected!");
	new Painting();
};
Math.__name__ = true;
var Painting = function() {
	this.isOpen = false;
	this.cStep = -1;
	this.maxStep = 5;
	this.cSteps = [];
	this.height = 400;
	this.width = 600;
	this.js = window.document;
	var _gthis = this;
	this.canvas = this.js.querySelector(".painting");
	this.initPainting();
	var penSizeSlider = this.js.getElementById("pensize");
	penSizeSlider.value = Std.string(this.pen.size);
	penSizeSlider.onchange = function() {
		_gthis.pen.setPenSize(Std.parseInt(penSizeSlider.value));
	};
	var picker = this.js.getElementById("picker");
	var colorsList = this.js.getElementById("colors");
	var _g = 0;
	var _g1 = colorsList.children;
	while(_g < _g1.length) {
		var i = [_g1[_g]];
		++_g;
		i[0].addEventListener("click",(function(i) {
			return function() {
				var color = i[0].innerHTML;
				picker.innerText = color;
				_gthis.pen.setPenColor(color);
			};
		})(i));
	}
	var capType = this.js.getElementById("captype");
	capType.addEventListener("change",function() {
		switch(capType.value) {
		case "butt":
			_gthis.pen.setPenCap("butt");
			break;
		case "round":
			_gthis.pen.setPenCap("round");
			break;
		case "square":
			_gthis.pen.setPenCap("square");
			break;
		default:
			console.log("src/Painting.hx:66:","no match");
		}
	});
	var saveBtn = this.js.getElementById("save");
	saveBtn.onclick = function() {
		var url = _gthis.canvas.toDataURL();
		var img = new Image(_gthis.canvas.width,_gthis.canvas.height);
		img.src = url;
		var download = saveBtn.children[0];
		download.setAttribute("download","untitled.jpg");
		download.setAttribute("href",url);
	};
	var undoBtn = this.js.getElementById("undo");
	undoBtn.onclick = function() {
		_gthis.undo();
	};
	var redoBtn = this.js.getElementById("redo");
	redoBtn.onclick = function() {
		_gthis.redo();
	};
	this.js.onkeydown = function(e) {
		if(e.keyCode == 90 && e.ctrlKey) {
			_gthis.undo();
		}
		if(e.keyCode == 89 && e.ctrlKey) {
			_gthis.redo();
		}
	};
};
Painting.__name__ = true;
Painting.prototype = {
	undo: function() {
		var _gthis = this;
		if(this.cStep > 0) {
			this.cStep--;
			var src = this.cSteps[this.cStep];
			var img = this.createImg(src);
			img.onload = function() {
				_gthis.pen.drawImage(img);
			};
		}
	}
	,redo: function() {
		var _gthis = this;
		if(this.cStep < this.cSteps.length - 1) {
			this.cStep++;
			var src = this.cSteps[this.cStep];
			var img = this.createImg(src);
			img.onload = function() {
				_gthis.pen.drawImage(img);
			};
		}
	}
	,initPainting: function() {
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		var ctx = this.canvas.getContext("2d",null);
		ctx.clearRect(0,0,this.width,this.height);
		ctx.fillStyle = "white";
		ctx.fillRect(0,0,this.width,this.height);
		this.pen = new Pen(this);
		this.addStep();
		var res = this.js.getElementById("canvasResolution").children[0];
		res.innerText = "Canvas Resolution: " + this.width + "x" + this.height;
	}
	,createImg: function(src) {
		var img = new Image(this.width,this.height);
		img.src = src;
		return img;
	}
	,addStep: function() {
		var img = this.canvas.toDataURL();
		this.cSteps.push(img);
		this.cStep++;
	}
};
var Pen = function(painting) {
	this.cap = "round";
	this.color = "black";
	this.size = 8;
	this.painting = painting;
	this.canvas = painting.canvas;
	this.ctx = this.canvas.getContext("2d",null);
	this.applyPenSettings();
	this.drawingEvent();
};
Pen.__name__ = true;
Pen.prototype = {
	drawingEvent: function() {
		var _gthis = this;
		this.canvas.addEventListener("mousedown",function(e) {
			if(_gthis.isDrawing) {
				return;
			}
			var box = _gthis.canvas.getBoundingClientRect();
			var x = box.x;
			var y = box.y;
			_gthis.isDrawing = true;
			_gthis.ctx.beginPath();
			_gthis.ctx.moveTo(e.clientX - x,e.clientY - y);
		});
		this.canvas.addEventListener("mousemove",function(e) {
			if(!_gthis.isDrawing) {
				return;
			}
			var box = _gthis.canvas.getBoundingClientRect();
			var x = box.x;
			var y = box.y;
			_gthis.ctx.lineTo(e.clientX - x,e.clientY - y);
			_gthis.ctx.stroke();
		});
		this.canvas.addEventListener("mouseup",function(e) {
			if(!_gthis.isDrawing) {
				return;
			}
			_gthis.isDrawing = false;
			_gthis.ctx.closePath();
			_gthis.painting.addStep();
		});
	}
	,drawImage: function(img,dx,dy) {
		if(dy == null) {
			dy = 0;
		}
		if(dx == null) {
			dx = 0;
		}
		this.ctx.drawImage(img,dx,dy);
	}
	,setPenSize: function(size) {
		this.size = size;
		this.applyPenSettings();
	}
	,setPenColor: function(color) {
		this.color = color;
		this.applyPenSettings();
	}
	,setPenCap: function(cap) {
		this.cap = cap;
		this.applyPenSettings();
	}
	,applyPenSettings: function() {
		this.ctx.strokeStyle = this.color;
		this.ctx.lineWidth = this.size;
		this.ctx.lineCap = this.cap;
	}
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	if(x != null) {
		var _g = 0;
		var _g1 = x.length;
		while(_g < _g1) {
			var i = _g++;
			var c = x.charCodeAt(i);
			if(c <= 8 || c >= 14 && c != 32 && c != 45) {
				var nc = x.charCodeAt(i + 1);
				var v = parseInt(x,nc == 120 || nc == 88 ? 16 : 10);
				if(isNaN(v)) {
					return null;
				} else {
					return v;
				}
			}
		}
	}
	return null;
};
var haxe_iterators_ArrayIterator = function(array) {
	this.current = 0;
	this.array = array;
};
haxe_iterators_ArrayIterator.__name__ = true;
haxe_iterators_ArrayIterator.prototype = {
	hasNext: function() {
		return this.current < this.array.length;
	}
	,next: function() {
		return this.array[this.current++];
	}
};
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.__string_rec = function(o,s) {
	if(o == null) {
		return "null";
	}
	if(s.length >= 5) {
		return "<...>";
	}
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) {
		t = "object";
	}
	switch(t) {
	case "function":
		return "<function>";
	case "object":
		if(((o) instanceof Array)) {
			var str = "[";
			s += "\t";
			var _g = 0;
			var _g1 = o.length;
			while(_g < _g1) {
				var i = _g++;
				str += (i > 0 ? "," : "") + js_Boot.__string_rec(o[i],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( _g ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") {
				return s2;
			}
		}
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		var k = null;
		for( k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) {
			str += ", \n";
		}
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "string":
		return o;
	default:
		return String(o);
	}
};
String.__name__ = true;
Array.__name__ = true;
js_Boot.__toStr = ({ }).toString;
Main.main();
})({});
