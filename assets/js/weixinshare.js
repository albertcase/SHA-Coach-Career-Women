$(document).ready(function(){
    $.ajax({
        'url' : '/wxconfig.php?url='+ encodeURIComponent(location.href.split('#')[0]),
        'success' : function(resp) {
            resp = $.parseJSON(resp);
            //resp.jsApiList.push('hideMenuItems');
            wx.config(resp);
            wx.checkJsApi({
                jsApiList : resp.jsApiList,
                success : function(res) {

                }
            });
            wx.ready(function() {
                wx.onMenuShareTimeline({
                    title: '爱马仕“伊人视界”',
                    link: window.location.origin+window.location.pathname,
                    imgUrl: window.location.origin+'/assets/images/share.jpg',
                    success: function () {
                        _hmt.push(['_trackEvent', 'wxmenu', 'share', 'share']);
                        ga('send', 'event', 'wxmenu', 'share', 'share');
                    },
                    cancel: function () {
                    }
                });
                wx.onMenuShareAppMessage({
                    title: '爱马仕“伊人视界”',
                    desc: '“伊人视界”将精湛手工艺与摩登时尚相结合，向现代女性致敬！',
                    link: window.location.origin+window.location.pathname,
                    imgUrl: window.location.origin+'/assets/images/share.jpg',
                    type: '',
                    dataUrl: '',
                    success: function () {
                        _hmt.push(['_trackEvent', 'wxmenu', 'share', 'share']);
                        ga('send', 'event', 'wxmenu', 'share', 'share');
                    },
                    cancel: function () {

                    }
                });

            });

        }
    });


});
