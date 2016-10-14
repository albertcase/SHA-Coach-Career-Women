//redpacket
;(function(){
    'use strict';

    var controller = function(){
       this.vjson = ['唐嫣','李微漪','谭元元','陈漫','欧铠淳','黄韵玲'];
    };
    controller.prototype = {
        init:function(){

            var self = this;

            ///api/islogin
            $.ajax({
                url:'/api/islogin',
                type:'POST',
                dataType:'json',
                success:function(data){
                    console.log(data);

                    if(data.status){
                        //    success
                    }else{
                        window.location.href = '/oauth?callback=/form.html'
                    }
                }
            });

            var sid = 0 || Cookies.get('selectedid');
            $('.title .name').html(self.vjson[sid]);

            //bind all dom element
            self.submitForm();


        },

        formValidate:function(){
            var self = this;
            var validate = true,
                inputMobile = document.getElementById('input-mobile'),
                inputName = document.getElementById('input-name'),
                inputAddress = document.getElementById('input-address');
            if(!inputName.value){
                Common.errorMsg.add(inputName.parentElement,'姓名不能为空');
                validate = false;
            }else{
                Common.errorMsg.remove(inputName.parentElement);
            };

            if(!inputAddress.value){
                Common.errorMsg.add(inputAddress.parentElement,'地址不能为空');
                validate = false;
            }else{
                Common.errorMsg.remove(inputAddress.parentElement);
            };

            if(!inputMobile.value){
                Common.errorMsg.add(inputMobile.parentElement,'手机号码不能为空');
                validate = false;
            }else{
                var reg=/^1\d{10}$/;
                if(!(reg.test(inputMobile.value))){
                    validate = false;
                    Common.errorMsg.add(inputMobile.parentElement,'手机号格式错误，请重新输入');
                }else{
                    Common.errorMsg.remove(inputMobile.parentElement);
                }
            }

            if(validate){
                return true;
            }
            return false;
        },
        submitForm:function(){
            var self = this;

            /*
             * Submit the Form
             */
            var btnSubmit = document.getElementsByClassName('btn-submit')[0];
            var enableSubmit = true;
            $('.input-box input').on('keyup',function(){
                self.formValidate();
            });


            btnSubmit.addEventListener('touchstart',function(){
                _hmt.push(['_trackEvent', 'buttons', 'click', 'SubmitInfoForm']);
                if(self.formValidate()){
                    if(!enableSubmit) return;
                    enableSubmit = false;
                    //    start to get keycode
                    var phonenumber = document.getElementById('input-mobile').value,
                        name = document.getElementById('input-name').value,
                        address = document.getElementById('input-address').value;
                    Common.msgBox('loading...');
                    $.ajax({
                        url:'/api/info',
                        type:'POST',
                        dataType:'json',
                        data:{
                            uuid:Cookies.get('uuid'),
                            mobile:phonenumber,
                            name:name,
                            address:address
                        },
                        success:function(data){
                            $('.ajaxpop').remove();
                            enableSubmit = true;
                            if(data.status==1){
                                Common.alertBox.add('你已经参与抽奖');
                            }else{
                                Common.alertBox.add(data.msg);
                            }
                        }
                    });

                };
            });
        },


    };

    if (typeof define === 'function' && define.amd){
        // we have an AMD loader.
        define(function(){
            return controller;
        });
    }
    else {
        this.controller = controller;
    }


}).call(this);

$(document).ready(function(){
    if(!Cookies.get('uuid')){
        window.location.href = '/index.html';
    };
    var redpacket= new controller();
    redpacket.init();
});