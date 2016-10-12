<?php
namespace Lib;

class SmsAPI extends Base {

    public function sendMessage($userid, $mobile){
        $code = rand(100000,999999);
        $ws = "http://webservice.smsadmin.cn/SGIP/SGIPService.php?wsdl";
        //接口地址 
        $client = new \SoapClient($ws);
        //远程调用
        $uid = '众异市场';
        $pwd = 'samesame123';
        $msg = "验证码" . $code . "，请在30分钟内填写，且勿向任何人提供您收到的短信校验码。【蔻驰】";
        $lindid = "Chivas" . date("YmdHis"). $code;
        $dtime = '';
        $char = 'utf-8';
        $uid = urlencode($uid);
        $msgs = urlencode($msg);
        $send_rs = $client->sendSms($uid, $pwd, $mobile, $msgs, $lindid, $dtime, $char);

        $databaseAPI = new \Lib\DatabaseAPI();
        $databaseAPI->saveSmsLog($userid, $mobile, $code, $lindid, $msg, $send_rs);
        return $code;
    }

}
