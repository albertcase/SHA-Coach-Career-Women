$(document).ready(function(){
    function weixinshare(obj){
        wx.ready(function(){

            window.wechat_setting.friend  = {
                title: obj.title1,
                desc: obj.des,
                link: obj.link,
                imgUrl: obj.img
            };
            wx.onMenuShareAppMessage({
                title: obj.title1,
                desc: obj.des,
                link: obj.link,
                imgUrl: obj.img,
                type: '',
                dataUrl: '',
                success: function () {
                    console.log('share success to friend');
                    CANSHAKE='1';
                    $('.share').removeClass('show');
                    gotoPin(1);
                    service.addChance(function(data){
                        if(data.code){
                            //alert('获得一次抽奖机会');
                        }else{
                            alert('未登录');
                        }
                    });

                },
                cancel: function () {

                }
            });


            window.wechat_setting.timeline = {
                title: obj.title1,
                link: obj.link,
                imgUrl: obj.img
            };
            wx.onMenuShareTimeline({
                title: obj.title1,
                link: obj.link,
                imgUrl: obj.img,
                success: function () {
                    console.log('share success to timeline');
                    CANSHAKE='1';
                    gotoPin(1);
                    $('.share').removeClass('show');
                    service.addChance(function(data){
                        if(data.code){
                            //alert('获得一次抽奖机会');
                        }else{
                            alert('未登录');
                        }
                    });
                },
                cancel: function () {

                }
            });


        })
    }

    weixinshare({
        title1: '为梦想，你包容了什么？',
        des: '参与心理测试赢取由COACH追梦女性倾情赞助的礼物',
        link: window.location.href,
        img: 'http://coachxmas.samesamechina.com/img/share.jpg'
    })

});