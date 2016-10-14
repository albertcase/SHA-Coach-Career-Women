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