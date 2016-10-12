;(function(){
    var ua = navigator.userAgent.toLowerCase();

    var Common = {
        switchLang:function(string1,string2){
            //switch chinese and english language
            var curUrl = window.location.origin+window.location.pathname,
                transUrl = curUrl.replace(window.location.origin+'/'+string1,window.location.origin+'/'+string2);
            window.location.href = transUrl;
        },
        popup:{
            add:function(msg){
                isScroll = false;
                if(navigator.userAgent.indexOf('iPhone')>-1){
                    document.getElementById('video-1').pause();
                    if($('.video-2').length){
                        document.getElementById('video-2').pause();
                    }
                }else{
                    var videoHtml_1=$('#section-video-1 .video-block').html();
                    $('#section-video-1 .video-block video').remove();
                    $('#section-video-1 .video-block').append(videoHtml_1);
                    document.getElementById('video-1').load();
                    if($('#section-video-2').length){
                        var videoHtml_2=$('#section-video-2 .video-block').html();
                        $('#section-video-2 .video-block video').remove();
                        $('#section-video-2 .video-block').append(videoHtml_2);
                        document.getElementById('video-2').load();
                    }

                }
                $('body').append('<div class="popup msgbox"><div class="inner"><div class="msg">'+msg+'</div></div><div class="btn-close">关闭</div><div class="godown hide"></div></div>');
                if($('.popup .inner').height()<$('.popup .msg').height()){
                    //    more words
                    $('.godown').removeClass('hide');
                }

            },
            remove:function(){
                isScroll = true;
                $('.popup').remove();
            }
        },

    };

    this.Common = Common;

}).call(this);

$(document).ready(function(){

    //change en to cn
    $('.language .cn').on('touchstart',function(){
        _hmt.push(['_trackEvent', 'btn', 'click', 'ClickCN']);
        ga('send', 'event', 'btn', 'click', 'ClickCN');
        Common.switchLang('en','cn');
    });

    $('.language .en').on('touchstart',function(){
        _hmt.push(['_trackEvent', 'btn', 'click', 'ClickEN']);
        ga('send', 'event', 'btn', 'click', 'ClickEN');
        Common.switchLang('cn','en');
    });

    //add class for iphone or android
    if(navigator.userAgent.indexOf('iPhone')>-1){
        $('body').addClass('device-ios');
        noBounce.init({
          animate: true
        });
    }else{
        $('body').addClass('device-notios');
    }

    // $('.poster').on('touchstart','.btn-play',function(){
    //     $(this).parent().find('video')[0].play();
    // });
    $('.poster .btn-play').each(function(index, el) {
      var vid = $(el).parent().find('video').attr('id');
      if(vid == 'video-1'){
        $(this).bind('touchstart', function(event) {
          //video2.load();
          video1.play();
          return false;
        });
      }
      if(vid == 'video-2'){
        $(this).bind('touchstart', function(event) {
          //video1.load();
          video2.play();
          return false;
        });
      }
    });

    //for video 1
    var notios = $('body').is('.device-notios') ? true : false;
    var video1 = document.getElementById("video-1");
    video1.addEventListener('play', function() {
        _hmt.push(['_trackEvent', 'btn', 'click', 'PlayVideo1']);
        ga('send', 'event', 'btn', 'click', 'PlayVideo1');
        $('#section-video-1 .btn-play').css('display','none');
    }, false);
    video1.addEventListener('pause', function() {
        if(notios){
          video1.load();
        }
        $('#section-video-1 .btn-play').removeAttr('style');
    }, false);
    video1.addEventListener('ended', function() {
        if(notios){
          video1.load();
        }
        $('#section-video-1 .btn-play').removeAttr('style');
    }, false);

    //for video 2

    if($('#video-2').length){
        var video2 = document.getElementById("video-2");
        video2.addEventListener('play', function() {
            _hmt.push(['_trackEvent', 'btn', 'click', 'PlayVideo2']);
            ga('send', 'event', 'btn', 'click', 'PlayVideo2');
            $('#section-video-2 .btn-play').css('display','none');
        }, false);
        video2.addEventListener('pause', function() {
            if(notios){
              video2.load();
            }
            $('#section-video-2 .btn-play').removeAttr('style');
        }, false);
        video2.addEventListener('ended', function() {
            if(notios){
              video2.load();
            }
            $('#section-video-2 .btn-play').removeAttr('style');
        }, false);
    }

    //first screen to second screen
    $('.header .slogan').on('click',function(){
        _hmt.push(['_trackEvent', 'btn', 'click', 'PageJump1']);
        ga('send', 'event', 'btn', 'click', 'PageJump1');
    });
    $('.go-next').on('click',function(){
        if($(this).parent().hasClass('section-video-1')){
            _hmt.push(['_trackEvent', 'btn', 'click', 'PageJump2']);
            ga('send', 'event', 'btn', 'click', 'PageJump2');
        }else{
            _hmt.push(['_trackEvent', 'btn', 'click', 'PageJump3']);
            ga('send', 'event', 'btn', 'click', 'PageJump3');
        }

    });
    //readmore
    $('.readmore').on('touchstart',function(){
        _hmt.push(['_trackEvent', 'btn', 'click', 'ClickReadMore1']);
        ga('send', 'event', 'btn', 'click', 'ClickReadMore1');
        Common.popup.add('<div class="title">'+$(this).parent().find('.title').html()+'</div>'+$(this).parent().find('.details').html());
    });

    $('body').on('touchstart','.btn-close',function(e){
        _hmt.push(['_trackEvent', 'btn', 'click', 'ClosePopup1']);
        ga('send', 'event', 'btn', 'click', 'ClosePopup1');
        e.stopPropagation();
        Common.popup.remove();
    });

    //for touchmove popup
    var a,y=0;
    $('body').on('touchstart','.popup',function(e){

        a = e.touches[0].pageY;
        e.preventDefault();
    });
    $('body').on('touchmove','.popup',function(e){
        //console.log($('.popup .msg').height() - $('.popup .inner').height());
        if($('.popup .inner').height()<$('.popup .msg').height()){
            y = y+e.touches[0].pageY-a;
            if(y<$('.popup .inner').height()-$('.popup .msg').height()+30){
                y = $('.popup .inner').height()-$('.popup .msg').height();
            }else if(y>0){
                y=0;
            }
            $('.popup .msg').css({
                "webkitTransform":"translateY("+y+"px)",
                "MozTransform":"translateY("+y+"px)",
                "msTransform":"translateY("+y+"px)",
                "OTransform":"translateY("+y+"px)",
                "transform":"translateY("+y+"px)"
            });
        }
        if(e.touches[0].pageY>a){
            if($('.popup .inner').height()<$('.popup .msg').height()){
                //    more words
                $('.godown').removeClass('hide');
            }
        }else{
            if($('.popup .inner').height()<$('.popup .msg').height()){
                //    more words
                $('.godown').addClass('hide');
            }

        }
    });

    //    resize
    $(window).on('resize',function(){
        if($('.popup .inner').height()<$('.popup .msg').height()){
            //    more words
            $('.godown').removeClass('hide');
        }else{
            $('.godown').addClass('hide');
        }
    });


});



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

