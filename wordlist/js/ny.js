var ny = {
	getPx: function(num) {
		return num + "px";
	}
}
var list = {
	x: "",
	y: "",
	init: function() {
		var o = document.getElementById("view");
		var btns = document.getElementById("view_button");
		btns.style.position = "absolute";
		btns.style.top = ny.getPx(0);
		btns.style.left = ny.getPx(0);
		btns.style.width = ny.getPx(o.offsetWidth);
		btns.style.height = ny.getPx(o.offsetHeight);
		this.x = o.offsetWidth;
		this.y = o.offsetHeight;
		var btn1 = document.getElementById("btn_1");
		var btn2 = document.getElementById("btn_2");
		var btn3 = document.getElementById("btn_3");
		//btn1
		btn1.style.float = "left";
		btn1.style.width = ny.getPx(o.offsetWidth * 0.295);
		btn1.style.height = ny.getPx(o.offsetHeight * 0.42);
		btn1.style.marginTop = ny.getPx(o.offsetHeight * 0.09);
		btn1.style.marginLeft = ny.getPx(o.offsetWidth * 0.03);
		//btn2
		btn2.style.float = "left";
		btn2.style.width = ny.getPx(o.offsetWidth * 0.295);
		btn2.style.height = ny.getPx(o.offsetHeight * 0.42);
		btn2.style.marginTop = ny.getPx(o.offsetHeight * 0.09);
		btn2.style.marginLeft = ny.getPx(o.offsetWidth * 0.03);
		//btn3
		btn3.style.float = "left";
		btn3.style.width = ny.getPx(o.offsetWidth * 0.295);
		btn3.style.height = ny.getPx(o.offsetHeight * 0.42);
		btn3.style.marginTop = ny.getPx(o.offsetHeight * 0.09);
		btn3.style.marginLeft = ny.getPx(o.offsetWidth * 0.025);
	},
	_resize: function() {
		var o = document.getElementById("view");
		var btns = document.getElementById("view_button");
		setInterval(function() {
			if (o.offsetWidth!= btns.offsetWidth || o.offsetHeight != btns.offsetHeight) {
				list.init();
			}
			console.log("s");
		}, 500);
	}
}