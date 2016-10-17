(function(doc, win) {
    var docEl = doc.documentElement,
    isIOS = navigator.userAgent.match(/iphone|ipod|ipad/gi),
    dpr = isIOS? Math.min(win.devicePixelRatio, 3) : 1,
    scale = 1 / dpr,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    //fix iphone plus bug
    if(dpr == 3){
        scale=1;
        dpr = 2;
    }
    docEl.dataset.dpr = dpr;
    var metaEl = doc.createElement('meta');
    metaEl.name = 'viewport';
    metaEl.content = 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale;
    docEl.firstElementChild.appendChild(metaEl);
    var recalc = function () {
        var width = docEl.clientWidth,
			height = docEl.clientHeight;
        if (width / dpr > 750) {
            width = 750 * dpr;
        }
				if(width/height>750/1207){
					docEl.style.fontSize = 100 * (height / 1207) + 'px';

				}else{
					docEl.style.fontSize = 100 * (width / 750) + 'px';
				}
      };
    recalc();
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
})(document, window);
/*!
 * JavaScript Cookie v2.1.3
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
    var registeredInModuleLoader = false;
    if (typeof define === 'function' && define.amd) {
        define(factory);
        registeredInModuleLoader = true;
    }
    if (typeof exports === 'object') {
        module.exports = factory();
        registeredInModuleLoader = true;
    }
    if (!registeredInModuleLoader) {
        var OldCookies = window.Cookies;
        var api = window.Cookies = factory();
        api.noConflict = function () {
            window.Cookies = OldCookies;
            return api;
        };
    }
}(function () {
    function extend () {
        var i = 0;
        var result = {};
        for (; i < arguments.length; i++) {
            var attributes = arguments[ i ];
            for (var key in attributes) {
                result[key] = attributes[key];
            }
        }
        return result;
    }

    function init (converter) {
        function api (key, value, attributes) {
            var result;
            if (typeof document === 'undefined') {
                return;
            }

            // Write

            if (arguments.length > 1) {
                attributes = extend({
                    path: '/'
                }, api.defaults, attributes);

                if (typeof attributes.expires === 'number') {
                    var expires = new Date();
                    expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
                    attributes.expires = expires;
                }

                try {
                    result = JSON.stringify(value);
                    if (/^[\{\[]/.test(result)) {
                        value = result;
                    }
                } catch (e) {}

                if (!converter.write) {
                    value = encodeURIComponent(String(value))
                        .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
                } else {
                    value = converter.write(value, key);
                }

                key = encodeURIComponent(String(key));
                key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
                key = key.replace(/[\(\)]/g, escape);

                return (document.cookie = [
                    key, '=', value,
                    attributes.expires ? '; expires=' + attributes.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                    attributes.path ? '; path=' + attributes.path : '',
                    attributes.domain ? '; domain=' + attributes.domain : '',
                    attributes.secure ? '; secure' : ''
                ].join(''));
            }

            // Read

            if (!key) {
                result = {};
            }

            // To prevent the for loop in the first place assign an empty array
            // in case there are no cookies at all. Also prevents odd result when
            // calling "get()"
            var cookies = document.cookie ? document.cookie.split('; ') : [];
            var rdecode = /(%[0-9A-Z]{2})+/g;
            var i = 0;

            for (; i < cookies.length; i++) {
                var parts = cookies[i].split('=');
                var cookie = parts.slice(1).join('=');

                if (cookie.charAt(0) === '"') {
                    cookie = cookie.slice(1, -1);
                }

                try {
                    var name = parts[0].replace(rdecode, decodeURIComponent);
                    cookie = converter.read ?
                        converter.read(cookie, name) : converter(cookie, name) ||
                    cookie.replace(rdecode, decodeURIComponent);

                    if (this.json) {
                        try {
                            cookie = JSON.parse(cookie);
                        } catch (e) {}
                    }

                    if (key === name) {
                        result = cookie;
                        break;
                    }

                    if (!key) {
                        result[name] = cookie;
                    }
                } catch (e) {}
            }

            return result;
        }

        api.set = api;
        api.get = function (key) {
            return api.call(api, key);
        };
        api.getJSON = function () {
            return api.apply({
                json: true
            }, [].slice.call(arguments));
        };
        api.defaults = {};

        api.remove = function (key, attributes) {
            api(key, '', extend(attributes, {
                expires: -1
            }));
        };

        api.withConverter = init;

        return api;
    }

    return init(function () {});
}));






;(function(){
	var ua = navigator.userAgent.toLowerCase();
	var Common = {
		msgBox:function(msg,long){
			if(long){
				$('body').append('<div class="ajaxpop msgbox minwidthbox"><div class="loading">'+msg+'</div></div>');
			}else{
				$('body').append('<div class="ajaxpop msgbox"><div class="loading"><div class="icon-loading"></div>'+msg+'</div></div>');
			}
		},
		errorMsg : {
			add:function(ele,msg){

				for(var i in ele.childNodes){
					if(ele.childNodes[i].className == 'error'){
						ele.childNodes[i].textContent = msg;
						return true;
					}else{
						if(i==ele.childNodes.length-1){
							var newDiv = document.createElement('div');
							newDiv.textContent = msg;
							newDiv.className = 'error';
							ele.appendChild(newDiv);
						}
					}
				}
			},
			remove:function(ele){

				for(var i in ele.childNodes){
					if(ele.childNodes[i].className == 'error'){
						ele.childNodes[i].parentNode.removeChild(ele.childNodes[i]);
						return;
					}
				}
			}
		},
		alertBox:{
			add:function(msg){
				$('body').append('<div class="alertpop msgbox"><div class="inner"><div class="msg">'+msg+'</div><div class="btn-alert-ok">关闭</div></div></div>');
			},
			remove:function(){
				$('.alertpop').remove();
			}
		},


	};

	var isScroll=true;
	var noBounce = function() {
		var module = {};

		var settings = {
			animate: false
		};

		var track = [];

		var velocity = {
			x: 0,
			y: 0
		};

		var vector = {
			subtraction: function(v1, v2) {
				return {
					x: v1.x - v2.x,
					y: v1.y - v2.y
				};
			},
			length: function(v) {
				return Math.sqrt((v.x * v.x) + (v.y * v.y));
			},
			unit: function(v) {
				var length = vector.length(v);
				v.x /= length;
				v.y /= length;
			},
			skalarMult: function(v, s) {
				v.x *= s;
				v.y *= s;
			}
		};

		var requestAnimFrame = (function() {
			return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function(callback) {
					window.setTimeout(callback, 1000 / 60);
				};
		})();

		function handleTouchStart(evt) {
			var point,
				touch;

			touch = evt.changedTouches[0];
			point = {
				x: touch.clientX,
				y: touch.clientY,
				timeStamp: evt.timeStamp
			};
			track = [point];
		}

		function handleTouchMove(evt) {
			var point,
				touch;

			evt.preventDefault();
			if(isScroll){
				touch = evt.changedTouches[0];
				point = {
					x: touch.clientX,
					y: touch.clientY,
					timeStamp: evt.timeStamp
				};
				track.push(point);
				doScroll();
			}

		}

		function handleTouchEnd(evt) {
			if (track.length > 2 && settings.animate) {
				velocity = calcVelocity();
				requestAnimFrame(animate);
			}
		}

		function calcVelocity() {
			var p1,
				p2,
				v,
				timeDiff,
				length;

			p1 = track[0];
			p2 = track[track.length - 1];
			timeDiff = p2.timeStamp - p1.timeStamp;
			v = vector.subtraction(p2, p1);
			length = vector.length(v);
			vector.unit(v);
			vector.skalarMult(v, length / timeDiff * 20);
			return v;
		}

		function doScroll() {
			var p1,
				p2,
				x,
				y;

			if (track.length > 1) {
				p1 = track[track.length - 1];
				p2 = track[track.length - 2];
				x = p2.x - p1.x;
				y = p2.y - p1.y;
				requestAnimFrame(function() {
					window.scrollBy(x, y);
				});
			}
		}

		function animate() {
			scrollBy(-velocity.x, -velocity.y);
			vector.skalarMult(velocity, 0.95);
			if (vector.length(velocity) > 0.2) {
				requestAnimFrame(animate);
			}
		}

		//Returns true if it is a DOM element
		function isElement(o) {
			return (
				typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
				o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
			);
		}

		module.init = function(options) {
			if (typeof options.animate === "boolean") {
				settings.animate = options.animate;
			}
			if (isElement(options.element)) {
				settings.element = options.element;
			}

			var element = settings.element || document;

			element.addEventListener("touchstart", handleTouchStart);
			element.addEventListener("touchmove", handleTouchMove);
			element.addEventListener("touchend", handleTouchEnd);
			element.addEventListener("touchcancel", handleTouchEnd);
			element.addEventListener("touchleave", handleTouchEnd);
		};

		return module;
	}();

	noBounce.init({
		animate: false
	});

	this.Common = Common;

}).call(this);

$(document).ready(function(){

	//close alert pop
	$('body').on('touchstart','.btn-alert-ok',function(){
		Common.alertBox.remove();
		//for form page
		if($('body').hasClass('page-form') && $(this).parent().find('.msg').html() == '你已经参与抽奖'){
			window.location.href='/';
		}
	});

});




$(document).ready(function(){
    function weixinshare(obj){
        wx.ready(function(){
            wx.onMenuShareAppMessage({
                title: obj.title1,
                desc: obj.des,
                link: obj.link,
                imgUrl: obj.img,
                type: '',
                dataUrl: '',
                success: function () {
                    console.log('share success to friend');

                },
                cancel: function () {

                }
            });
            wx.onMenuShareTimeline({
                title: obj.title1,
                link: obj.link,
                imgUrl: obj.img,
                success: function () {
                    console.log('share success to timeline');
                },
                cancel: function () {

                }
            });


        })
    }

    weixinshare({
        title1: '为梦想，你包容了什么？',
        des: '参与心理测试赢取由COACH追梦女性倾情赞助的礼物',
        link: window.location.origin+'/index.html',
        img: 'http://careerwomen.samesamechina.com/dist/images/share.jpg'
    })

});
//for select video page
;(function(){

    //0:唐嫣
    //1:李微漪
    //2:谭元元
    //3:陈漫
    //4:欧铠淳
    //5:黄韵玲
    var vjson = [
        {
            name:'唐嫣',
            title:'演员',
            src:'http://m.v.qq.com/play/play.html?coverid=&vid=v0334ddnhwb&ptag=4_5.0.0.13467_wxf',
            vid:'v0334ddnhwb',
            des:'一出道就广受欢迎的唐嫣，<br> 演艺事业并非永远一帆风顺，<br> 现在的她越来越懂得想品尝梦想的甜蜜，<br>先要坦然包容其中的苦涩。',
            intro:'包容迟到的赞许，绽放纯粹的光芒'
        },
        {
            name:'李微漪',
            title:'画家',
            src:'http://v.qq.com/x/page/l0336al4f1r.html',
            vid:'l0336al4f1r',
            des:'李微漪用她和“狼儿子”格林的故事，<br>试图探索的美好未来。<br>李微漪渴望所有人回归温暖的包容之心，<br>让爱流动，让大美重回天地间。',
            intro:'包容冷漠与伤害，用爱温暖地治愈'
        },
        {
            name:'谭元元',
            title:'芭蕾舞演员',
            src:'http://static.video.qq.com/TPout.swf?vid=o0334kns54u&auto=0',
            vid:'o0334kns54u',
            des:'她是华人世界的第一芭蕾舞者，<br>在舞台的光芒后，阴影也如影随形。<br>现在的她，更愿意听从上天的安排，<br>因热爱而发光，因包容，而无所不能。',
            intro:'包容时光的流转，舞出人生的精彩'
        },
        {
            name:'陈漫',
            title:'时尚摄影师',
            src:'http://v.qq.com/x/page/u0336ia5clh.html',
            vid:'u0336ia5clh',
            des:'陈漫以女性特有的包容力转化着生命中的一切。<br>她更打破界限，接纳自己所有的可能。<br>生命有限，她选择专注于热爱，<br>创造包容一切的无限。',
            intro:'包容真我的执着，超越内心的可能'
        },
        {
            name:'欧铠淳',
            title:'游泳运动员',
            src:'http://m.v.qq.com/play/play.html?coverid=&vid=k0334c3niao&ptag=4_5.0.0.13467_wxf',
            vid:'k0334c3niao',
            des:'她，被誉为香港“人鱼公主”。<br>和夺冠相比，她更享受投入其中的过程，<br> 真正的包容，是全然接纳自己的局限，<br> 而永不放弃地享受拼搏的过程。',
            intro:'包容竞争的代价，享受拼搏的快乐'
        },
        {
            name:'黄韵玲',
            title:'音乐制作人',
            src:'http://v.qq.com/x/page/e0336dhbywr.html ',
            vid:'e0336dhbywr',
            des:'当青春渐逝，黄韵玲已成为了更纯粹的自己<br>那个为音乐追梦，为爱而创作的自己。<br> 当她唱起最爱的歌，<br> 时光无碍，热爱永存。',
            intro:'包容时光的蹉跎，停驻心动的瞬间'
        }
    ];

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        var results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    function videoPlay(tvid,isautoplay){
        var video = new tvp.VideoInfo();
        video.setVid(tvid);
        var player = new tvp.Player();
        player.create({
            width  : '100%',
            height : '100%',
            video  : video,
            pic: tvp.common.getVideoSnapMobile(tvid),
            playerType: 'html5',
            modId  : "mod_player",
            autoplay: isautoplay
        });
    }

    $(document).ready(function(){

        //append content
        function loadingFirst(vid){
            var i=vid || 0;
            var titleEle = $('.t2'),
                desEle = $('.t3'),
                introEle = $('.t4');
            var titleHtml = vjson[i].title+'<strong>'+vjson[i].name+'</strong>',
                desHtml = '<strong>'+vjson[i].des+'</strong>',
                introHtml = '<span class="quotation l-quotation"></span>'+vjson[i].intro+'<span class="quotation r-quotation"></span>';
            titleEle.html(titleHtml);
            desEle.html(desHtml);
            introEle.html(introHtml);
        };

        var nowVid = getParameterByName('vid') || 0;
        if(Cookies.get('uuid') && Cookies.get('selectedid')){
            nowVid = Cookies.get('selectedid');
        }

        if(nowVid<vjson.length && nowVid>-1){
            loadingFirst(nowVid);
        }else{
            loadingFirst(0);
        }

        if(navigator.userAgent.indexOf('Android')>-1){
            $('body').addClass('device-andriod');
        }

        //for select video page
        if($('body').hasClass('page-selectvideo')){
            $('.page-selectvideo .video-block').addClass('vb-'+nowVid);
            videoPlay(vjson[nowVid].vid,false);
        }


        $('.page-selectvideo').on('touchstart','#mod_player',function(){
            _hmt.push(['_trackEvent', 'buttons', 'click', 'SinglePlayVideo'+nowVid]);
        });

        $('.page-selectvideo .btn-go').on('touchstart',function(){
            _hmt.push(['_trackEvent', 'buttons', 'click', 'GoVideoListPage']);
        });

        //video list
        $('.page-videolist .btn-go').on('touchstart',function(){
            _hmt.push(['_trackEvent', 'buttons', 'click', 'GoFormPage']);
        });

        //start play
        $('.video-list .video-block').on('touchstart',function(){
            //video list page
            if(!$('body').hasClass('page-videolist')) return;
            var id=$(this).attr('data-id');
            _hmt.push(['_trackEvent', 'buttons', 'click', 'VideoListPlayVideo'+id]);
            $('.video-wrap').addClass('show');
            videoPlay(vjson[id].vid,true);

        });

    //    close wrap,stop play
        $('.btn-closevideo').on('touchstart',function(){
            _hmt.push(['_trackEvent', 'buttons', 'click', 'closeVideo']);
            //video list page
            if(!$('body').hasClass('page-videolist')) return;
            $('.videoplayer>div').remove();
            $(this).parent().removeClass('show');
        });

    });





})();