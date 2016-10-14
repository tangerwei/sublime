var word = {
    datalist: [],
    dataItem: {},
    dataindex: 0,
    datamodel: 0,
    isclick: false, //当前是否是点击状态
    init: function() {
        //写入数据
        var url = location.search;
        var _model = null;
        var _self = this;
        if(url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for(var i = 0; i < strs.length; i++) {
                if(strs[i].split("=")[0] === "model") {
                    _model = strs[i].split("=")[1];
                }
            }
        }
        if(_model === null) {
            location.href = "../index.html";
        } else {
            //获取单词列表
            jQuery.ajax({
                url: "data/list.json",
                type: "get",
                async: false,
                success: function(data) {
                    var tmp = JSON.parse(data);
                    _self.datalist = tmp.list;
                }
            });
            this.datamodel = _model;
            this.loadWord(0);
            this._resize();
        }
    },
    loadWord: function(index) {
        //取得单词信息，将单词信息写入页面
        var _self = this;
        this.dataindex = index;
        var _word = this.datalist[index];
        jQuery.ajax({
            url: "data/word.json",
            type: "get",
            async: false,
            success: function(data) {
                var _data = JSON.parse(data);
                _self.dataItem = _data[_word];
            }
        });
        //写入model_1
        if(this.datamodel === "1") {
            var pt1 = document.getElementById("view1_detail_label");
            pt1.style.whiteSpace = "nowrap";
            pt1.innerHTML = "<label id='view1_word_label' onclick='word.showDetail()' style='visibility:hidden;'>" + _word + "</label>";
            var pword1 = document.getElementById("view1_word_label");
            var pwordc = document.getElementById("view1_detail_label");
            var view_page1 = document.getElementById("view1_page");
            view_page1.innerText = (this.dataindex + 1) + "/" + (this.datalist.length);
            //载入图片开始渲染view1
            var pic1=document.getElementById("view1");
            pic1.onload=function(){
                word.drawModel_1();
            }
            pic1.src="img/wordBackground.png";
        }
        //写入model_2
        if(this.datamodel === "2") {
            document.getElementById("view2_detail_label").innerHTML = "<img id='view2_detail_img' onclick='word.showDetail()' src='" + this.dataItem.pic + "' style='visibility:hidden;'/>";
            document.getElementById("view2_detail_img").onload = function() {
                var o = document.getElementById("view2");
                var p = this.parentNode;
                p.style.marginTop = ny.getPx(0);
                this.style.marginLeft = ny.getPx(0);
                //设置imgContainer范围
                p.style.height = ny.getPx(p.parentNode.offsetHeight*0.72);
                p.style.width = ny.getPx(p.parentNode.offsetWidth*0.84);
                p.style.marginTop=ny.getPx(p.parentNode.offsetHeight*0.13); 
                p.style.marginLeft = ny.getPx(p.parentNode.offsetWidth*0.08);
                //处理水平宽度
                this.style.width = ny.getPx(p.offsetWidth);
                this.style.height = "auto";
                if(this.offsetHeight > p.offsetHeight) {
                    this.style.width = "auto";
                    this.style.height = ny.getPx(p.offsetHeight);
                    this.parentNode.style.textAlign = "center";
                }
                //图片垂直居中
                if(p.offsetHeight > this.offsetHeight) {
                    this.style.marginTop = ny.getPx((p.offsetHeight - this.offsetHeight) / 2);
                }
                this.style.visibility = "visible";
            }
            var view_page2 = document.getElementById("view2_page");
            view_page2.innerText = (this.dataindex + 1) + "/" + (this.datalist.length);
        }

        //写入model_3
        document.getElementById("view3_img").innerHTML = "<img id='view3_detail_img' src='" + this.dataItem.pic + "' style='visibility:hidden;'/>";
        document.getElementById("view3_detail_img").onload = function() {
            this.style.width = ny.getPx(this.parentNode.offsetWidth);
            this.style.height = ny.getPx(this.parentNode.offsetHeight * 0.95);
            this.style.visibility = "visible";
        }
        document.getElementById("view3_word").innerHTML = "<label id='view3_word_label'>" + _word + "</label>";
        var wordp3 = document.getElementById("view3_word_label");
        //字体超出，自动缩小
        if(wordp3.offsetWidth > wordp3.parentNode.offsetWidth) {
            var _range = wordp3.parentNode.offsetWidth / wordp3.offsetWidth;
            wordp3.style.fontSize = _range * 0.9 + "em";
        }
        document.getElementById("view3_word_pru").innerHTML = "<label id='pronuce_word'>" + this.dataItem.pronu + "</label>" + "<img id='voice_icon' src='img/voice.png' style='visibility:hidden;'/>"
        document.getElementById("voice_icon").onload = function() {
            var p = document.getElementById("pronuce_word");
            p.parentNode.style.whiteSpace = "nowrap";
            p.style.fontFamily = "Arial";
            p.style.float = "left";
            p.style.height = ny.getPx(this.parentNode.offsetHeight * 0.65);
            p.style.lineHeight = ny.getPx(this.parentNode.offsetHeight * 0.65);
            p.style.fontSize = ny.getPx(this.parentNode.offsetHeight * 0.45 * 1.19);
            p.style.whiteSpace = "nowrap";
            this.style.height = ny.getPx(this.parentNode.offsetHeight * 0.65);
            //处理文字超出范围
            var dxy = this.parentNode.offsetHeight * 0.6 * 0.6;
            if(p.offsetWidth + this.offsetWidth > this.parentNode.offsetWidth) {
                var cwidth = this.parentNode.offsetWidth - this.offsetWidth - dxy;
                p.style.fontSize = cwidth / p.offsetWidth + "em";
            }
            this.style.marginLeft = ny.getPx(dxy);
            this.style.visibility = "visible";
            this.onclick=function(event){
                word.play(event);
            }
        }
        var wordcx = "";
        for(var i = 0; i < this.dataItem.cx.length; i++) {
            if(wordcx != "") {
                wordcx = wordcx + "</br>" + this.dataItem.cx[i];
            } else {
                wordcx = this.dataItem.cx[i];
            }
        }
        var psx = document.getElementById("view3_word_ex");
        psx.style.position = "relative";
        psx.style.fontFamily = "FZY4JW";
        psx.innerHTML = "<div style='position:absolute;'>" + wordcx + "</div>";
        //eg
        var eg = "<label id='model3_eg_label' style='white-space:nowrap;'>" + this.dataItem.eg.en + "<br/>" + this.dataItem.eg.zh + "</label>";
        document.getElementById("view3_detail_ro2").innerHTML = eg;
        //voice
        jQuery("#voiceAudio").empty();
        var _voice = document.createElement("audio");
        _voice.src = _self.dataItem.voice;
        _voice.setAttribute("id", "voiceEle");
        document.getElementById("voiceAudio").appendChild(_voice);
        var view_page3 = document.getElementById("view3_page");
        view_page3.innerText = (this.dataindex + 1) + "/" + (this.datalist.length);
        this.changeToModel();
        //
        if(this.datamodel!=="3"){
            document.getElementById("view3_detail_ro1").onclick=function(){
                word.changeToModel();
            }
            document.getElementById("view3_detail_ro2").onclick=function(){
                word.changeToModel();
            }
        }
    },
    drawModel_1: function() {
        var o = document.getElementById("view1");
        var p = document.getElementById("view1_detail");
        p.style.position = "absolute";
        p.style.top = ny.getPx(0);
        p.style.left = ny.getPx(0);
        p.style.height = ny.getPx(o.offsetHeight);
        p.style.width = ny.getPx(o.offsetWidth);
        var px = document.getElementById("view1_detail_label");
        px.style.height = ny.getPx(o.offsetHeight * 0.4);
        px.style.width = ny.getPx(o.offsetWidth);
        px.style.textAlign = "center";
        px.style.marginTop = ny.getPx(o.offsetHeight * 0.3);
        px.style.fontSize = ny.getPx(o.offsetHeight * 0.31);
        px.style.fontFamily = "FZY4JW";
        var pword1 = document.getElementById("view1_word_label");
        if(pword1.offsetWidth > px.offsetWidth){
            var _range1 = px.offsetWidth / pword1.offsetWidth;
            pword1.style.fontSize = _range1 * 0.9 + "em";
        }
        pword1.style.visibility="visible";
        //button
        var px3 = document.getElementById("view1_detail_btn");
        px3.style.height = ny.getPx(o.offsetHeight * 0.3);
        px3.style.width = ny.getPx(o.offsetWidth);
        px3.style.position = "relative";
        var p1btn_befo = document.getElementById("view1_btn_before");
        var p1btn_next = document.getElementById("view1_btn_next");
        p1btn_befo.style.position = "absolute";
        p1btn_befo.style.width = ny.getPx(o.offsetWidth * 0.22 * 0.3);
        p1btn_befo.style.height = ny.getPx(o.offsetHeight * 0.15);
        p1btn_befo.style.top = ny.getPx(o.offsetHeight * 0.15);
        p1btn_befo.style.right = ny.getPx(o.offsetWidth * 0.195);
        p1btn_next.style.position = "absolute";
        p1btn_next.style.width = ny.getPx(o.offsetWidth * 0.22 * 0.3);
        p1btn_next.style.height = ny.getPx(o.offsetHeight * 0.15);
        p1btn_next.style.top = ny.getPx(o.offsetHeight * 0.15);
        p1btn_next.style.right = ny.getPx(o.offsetWidth * 0.03);
        //页码
        var view_page = document.getElementById("view1_page");
        view_page.style.position = "absolute";
        view_page.style.width = ny.getPx(o.offsetWidth * 0.102);
        view_page.style.fontSize = ny.getPx(o.offsetWidth * 0.102 *0.35);
        view_page.style.height = ny.getPx(o.offsetHeight * 0.15);
        view_page.style.lineHeight = ny.getPx(o.offsetHeight * 0.15);
        view_page.style.top = ny.getPx(o.offsetHeight * 0.15);
        view_page.style.right = ny.getPx(o.offsetWidth * 0.096);
        view_page.style.textAlign = "center";
    },
    drawModel_2: function() {
        var o = document.getElementById("view2");
        var p = document.getElementById("view2_detail");
        p.style.position = "absolute";
        p.style.top = ny.getPx(0);
        p.style.left = ny.getPx(0);
        p.style.height = ny.getPx(o.offsetHeight);
        p.style.width = ny.getPx(o.offsetWidth);
        //button
        var px3 = document.getElementById("view2_detail_btn");
        px3.style.height = ny.getPx(o.offsetHeight * 0.15);
        px3.style.width = ny.getPx(o.offsetWidth * 0.26);
        px3.style.position = "absolute";
        px3.style.zIndex = "3";
        px3.style.right = ny.getPx(0);
        px3.style.bottom = ny.getPx(0);
        var p1btn_befo = document.getElementById("view2_btn_before");
        var p1btn_next = document.getElementById("view2_btn_next");
        p1btn_befo.style.float = "left";
        p1btn_befo.style.width = ny.getPx(o.offsetWidth * 0.22 * 0.3);
        p1btn_befo.style.height = ny.getPx(o.offsetHeight * 0.15);
        var p1btn_page = document.getElementById("view2_page");
        p1btn_page.style.float = "left";
        p1btn_page.style.width = ny.getPx(o.offsetWidth * 0.1);
        p1btn_page.style.fontSize = ny.getPx(o.offsetWidth *0.035);
        p1btn_page.style.height = ny.getPx(o.offsetHeight * 0.15);
        p1btn_page.style.lineHeight = ny.getPx(o.offsetHeight * 0.15);
        p1btn_page.style.color = "#FFFFFF";
        p1btn_page.style.textAlign = "center";
        p1btn_next.style.float = "left";
        p1btn_next.style.width = ny.getPx(o.offsetWidth * 0.22 * 0.3);
        p1btn_next.style.height = ny.getPx(o.offsetHeight * 0.15);
    },
    drawModel_3: function() {
        var o = document.getElementById("view3");
        var p = document.getElementById("view3_detail");
        p.style.position = "absolute";
        p.style.top = ny.getPx(0);
        p.style.left = ny.getPx(0);
        p.style.width = ny.getPx(o.offsetWidth);
        p.style.height = ny.getPx(o.offsetHeight);
        var p1 = document.getElementById("view3_detail_ro1");
        p1.style.marginTop = ny.getPx(o.offsetHeight * 0.1);
        p1.style.height = ny.getPx(o.offsetHeight * 0.5);
        var p1c1 = document.getElementById("view3_img");
        var p1c2 = document.getElementById("view3_words");
        p1c1.style.float = "left";
        p1c1.style.width = ny.getPx(o.offsetWidth * 0.35);
        p1c1.style.height = ny.getPx(o.offsetHeight * 0.5);
        p1c1.style.marginLeft = ny.getPx(o.offsetWidth * 0.043);
        p1c2.style.float = "left";
        p1c2.style.width = ny.getPx(o.offsetWidth * 0.47);
        p1c2.style.height = ny.getPx(o.offsetHeight * 0.5);
        p1c2.style.marginLeft = ny.getPx(o.offsetWidth * 0.08);
        p1c2.style.marginRight = ny.getPx(o.offsetWidth * 0.05);
        //
        var p1c2x1 = document.getElementById("view3_word");
        var p1c2x2 = document.getElementById("view3_word_pru");
        var p1c2x3 = document.getElementById("view3_word_ex");
        p1c2x1.style.width = ny.getPx(o.offsetWidth * 0.5);
        p1c2x2.style.width = ny.getPx(o.offsetWidth * 0.5);
        p1c2x3.style.width = ny.getPx(o.offsetWidth * 0.5);
        p1c2x1.style.height = ny.getPx(o.offsetHeight * 0.5 * 0.35 * 0.91);
        p1c2x2.style.height = ny.getPx(o.offsetHeight * 0.5 * 0.3 * 0.875);
        p1c2x3.style.height = ny.getPx(o.offsetHeight * 0.5 * 0.35 * 1.197);
        //
        p1c2.style.color = "#FFFFFF";
        p1c2x1.style.fontSize = ny.getPx(o.offsetHeight * 0.5 * 0.35 * 0.6 * 1.2);
        p1c2x1.style.whiteSpace = "nowrap";
        p1c2x1.style.fontFamily = "FZY4JW";
        p1c2x3.style.fontSize = ny.getPx(o.offsetHeight * 0.5 * 0.35 * 0.3);
        //ro2
        var p3 = document.getElementById("view3_detail_ro2");
        p3.style.marginTop = ny.getPx(o.offsetHeight * 0.13);
        p3.style.marginLeft = ny.getPx(o.offsetWidth * 0.044);
        p3.style.height = ny.getPx(o.offsetHeight * 0.14);
        p3.style.color = "#FFFFFF";
        p3.style.fontSize = ny.getPx(o.offsetHeight * 0.146 * 0.4 * 0.957);
        p3.style.fontFamily = "FZY4JW";
        p3.style.overflow = "hidden";

        //ro3
        var p4 = document.getElementById("view3_detail_ro3");
        p4.style.height = ny.getPx(o.offsetHeight * 0.11);
        //before
        var p4c1 = document.getElementById("btn_before");
        p4c1.style.float = "left";
        p4c1.style.marginLeft = ny.getPx(o.offsetWidth * 0.74);
        p4c1.style.width = ny.getPx(o.offsetWidth * 0.062);
        p4c1.style.height = ny.getPx(o.offsetHeight * 0.11);
        //page
        var view3page = document.getElementById("view3_page");
        view3page.style.float = "left";
        view3page.style.width = ny.getPx(o.offsetWidth * 0.1);
        view3page.style.fontSize = ny.getPx(o.offsetWidth * 0.1 *0.35);
        view3page.style.height = ny.getPx(o.offsetHeight * 0.11);
        view3page.style.lineHeight = ny.getPx(o.offsetHeight * 0.11);
        view3page.style.color = "#FFFFFF";
        view3page.style.textAlign = "center";
        //next
        var p4c2 = document.getElementById("btn_next");
        p4c2.style.float = "left";
        p4c2.style.width = ny.getPx(o.offsetWidth * 0.062);
        p4c2.style.height = ny.getPx(o.offsetHeight * 0.11);
    },
    _resize: function() {
        //model_1
        var o1 = document.getElementById("view1");
        var b1 = document.getElementById("view1_detail");
        if(this.datamodel === "1") {
            var pword1 = document.getElementById("view1_word_label");
            setInterval(function() {
                if(o1.offsetWidth != b1.offsetWidth || o1.offsetHeight != b1.offsetHeight) {
                    //init mode_1
                    word.drawModel_1();
                    if(pword1.offsetWidth > pword1.parentNode.offsetWidth) {
                        var _range1 = pword1.parentNode.offsetWidth / pword1.offsetWidth;
                        pword1.style.fontSize = _range1 * 0.9 + "em";
                    }
                }
            }, 100);
        }
        //model_2
        var o2 = document.getElementById("view2");
        var b2 = document.getElementById("view2_detail");
        if(this.datamodel === "2") {
            setInterval(function() {
                if(o2.offsetWidth != b2.offsetWidth || o2.offsetHeight != b2.offsetHeight) {
                    //draw detail area
                    word.drawModel_2();
                    var sp = document.getElementById("view2_detail_img");
                    sp.src = "#";
                    sp.style.visibility="hidden";
                    sp.onload = function() {
                        var o = document.getElementById("view2");
                        var p2=this.parentNode;
                        this.style.marginTop = ny.getPx(0);
                        //this.style.marginLeft = ny.getPx(0);
                        //重新设置imgcontainer的宽高
                        p2.style.height = ny.getPx(p2.parentNode.offsetHeight*0.72);
                        p2.style.width = ny.getPx(p2.parentNode.offsetWidth*0.84);
                        p2.style.marginTop=ny.getPx(p2.parentNode.offsetHeight*0.13); 
                        p2.style.marginLeft = ny.getPx(p2.parentNode.offsetWidth*0.08);
                        this.style.width = ny.getPx(p2.offsetWidth);
                        this.style.height = "auto";
                        //处理水平宽度
                        if(this.offsetHeight > p2.offsetHeight) {
                            this.style.width = "auto";
                            this.style.height = ny.getPx(p2.offsetHeight);
                            this.parentNode.style.textAlign = "center";
                        }
                        //图片垂直居中
                        if(p2.offsetHeight > this.offsetHeight) {
                            this.style.marginTop = ny.getPx((p2.offsetHeight - this.offsetHeight) / 2);
                        }
                        sp.style.visibility="visible";
                    }
                    sp.src = word.dataItem.pic;
                    console.log("init mode_2");
                }
            }, 100);
        }
        //model_3
        var o3 = document.getElementById("view3");
        var b3 = document.getElementById("view3_detail");
        setInterval(function() {
            if(o3.offsetWidth != b3.offsetWidth || o3.offsetHeight != b3.offsetHeight) {
                //init mode_1
                var sp = document.getElementById("view3_detail_img");
                sp.src = "#";
                word.drawModel_3();
                sp.onload = function() {
                    this.style.width = ny.getPx(this.parentNode.offsetWidth);
                    this.style.height = ny.getPx(this.parentNode.offsetHeight * 0.95);
                }
                sp.src = word.dataItem.pic;
                var sp2 = document.getElementById("voice_icon");
                sp2.src = "#";
                sp2.onload = function() {
                    var p = document.getElementById("pronuce_word");
                    p.style.float = "left";
                    p.style.height = ny.getPx(this.parentNode.offsetHeight * 0.65);
                    p.style.lineHeight = ny.getPx(this.parentNode.offsetHeight * 0.65);
                    p.style.fontSize = ny.getPx(this.parentNode.offsetHeight * 0.45 * 1.19);
                    this.parentNode.style.fontSize = ny.getPx(this.parentNode.offsetHeight * 0.45 * 1.19);
                    this.parentNode.style.whiteSpace = "nowrap";
                    this.style.height = ny.getPx(this.parentNode.offsetHeight * 0.65);
                    //处理文字超出范围
                    var dy = this.parentNode.offsetHeight * 0.6 * 0.6;
                    if(p.offsetWidth + this.offsetWidth > this.parentNode.offsetWidth) {
                        var cwidth = this.parentNode.offsetWidth - this.offsetWidth - dy;
                        p.style.fontSize = cwidth / p.offsetWidth + "em";
                    }
                    this.style.marginLeft = ny.getPx(dy);
                }
                sp2.src = "img/voice.png";
                console.log("init mode_3");
            }
        }, 200);
    },
    changeToModel: function() {
        var _model = this.datamodel;
        if(_model === "1") {
            document.getElementById("model_1").className = 'show';
            document.getElementById("model_2").className = 'hidden';
            document.getElementById("model_3").className = 'hidden';
        }
        if(_model === "2") {
            document.getElementById("model_1").className = 'hidden';
            document.getElementById("model_2").className = 'show';
            document.getElementById("model_3").className = 'hidden';
        }
        if(_model === "3") {
            document.getElementById("model_1").className = 'hidden';
            document.getElementById("model_2").className = 'hidden';
            document.getElementById("model_3").className = 'show';
        }
    },
    showDetail: function() {
        document.getElementById("model_1").className = 'hidden';
        document.getElementById("model_2").className = 'hidden';
        document.getElementById("model_3").className = 'show';
        if(this.datamodel !== "3") {
            //
            var o = document.getElementById("view3_detail_img");
            o.style.width = ny.getPx(o.parentNode.offsetWidth);
            o.style.height = ny.getPx(o.parentNode.offsetHeight * 0.95);
            //单词调节大小
            var wordp3 = document.getElementById("view3_word_label");
            //字体超出，自动缩小
            if(wordp3.offsetWidth > wordp3.parentNode.offsetWidth) {
                var _range = wordp3.parentNode.offsetWidth / wordp3.offsetWidth;
                wordp3.style.fontSize = _range * 0.9 + "em";
            }
            var p1c2x2 = document.getElementById("view3_word_pru");
            var p1c2x2ex = document.getElementById("voice_icon");
            var p2 = document.getElementById("pronuce_word");
            p2.style.float = "left";
            p2.style.height = ny.getPx(p1c2x2ex.parentNode.offsetHeight * 0.65);
            p2.style.lineHeight = ny.getPx(p1c2x2ex.parentNode.offsetHeight * 0.65);
            p2.style.fontSize = ny.getPx(p1c2x2ex.parentNode.offsetHeight * 0.45 * 1.19);
            p2.parentNode.style.fontSize = ny.getPx(p1c2x2ex.parentNode.offsetHeight * 0.45 * 1.19);
            p1c2x2ex.style.height = ny.getPx(p1c2x2ex.parentNode.offsetHeight * 0.65);
            p2.style.fontFamily = "Arial";
            //
            var dxy = p1c2x2ex.parentNode.offsetHeight * 0.6 * 0.6;
            if(p2.offsetWidth + p1c2x2ex.offsetWidth > p1c2x2ex.parentNode.offsetWidth) {
                var cwidth = p1c2x2ex.parentNode.offsetWidth - p1c2x2ex.offsetWidth - dxy;
                p2.style.fontSize = cwidth / p2.offsetWidth + "em";
            }
            p1c2x2ex.style.marginLeft = ny.getPx(dxy);
        }
    },
    play: function(event) {
        var el = document.getElementById("voiceEle");
        el.play();
        event.stopPropagation();
    },
    next: function() {
        if(this.isclick) {
            return;
        } else {
            this.isclick = true;
        }
        this.dataindex = this.dataindex + 1;
        if(this.dataindex > this.datalist.length - 1) {
            this.dataindex = 0;
        }
        this.loadWord(this.dataindex);
        this.isclick = false;
    },
    before: function() {
        if(this.isclick) {
            return;
        } else {
            this.isclick = true;
        }
        if(this.dataindex == 0) {
            this.dataindex = this.datalist.length - 1;
        } else {
            this.dataindex = this.dataindex - 1;
        }
        this.loadWord(this.dataindex);
        this.isclick = false;
    }
}