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