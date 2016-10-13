//redpacket
;(function(){
    'use strict';
    var controller = function(){
        this.isShake = false;
        this.mobileVal = '';
        //if submitted and record user msg, hasLogged is true
        this.hasLogged = false;
    };
    controller.prototype = {
        init:function(){

            var self = this;
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
            btnSubmit.addEventListener('touchstart',function(){
                if(self.formValidate()){
                    if(!enableSubmit) return;
                    enableSubmit = false;
                    //    start to get keycode
                    var phonenumber = document.getElementById('input-mobile').value,
                        name = document.getElementById('input-name').value,
                        address = document.getElementById('input-address').value;
                    $.ajax({
                        url:'/api/info',
                        type:'POST',
                        dataType:'json',
                        data:{
                            mobile:phonenumber,
                            name:name,
                            address:address
                        },
                        success:function(data){

                            alert('你已经参与抽奖');
                            enableSubmit = true;
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
    var redpacket= new controller();
    redpacket.init();
});