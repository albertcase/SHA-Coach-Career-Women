<?php
namespace Lib;

class RedpacketAPI extends Base {

    public function sendredpack($openid) {
        // $RedisAPI = new \Lib\RedisAPI();
        // if ($RedisAPI->islock($openid)) {
        //     return false;
        // }
        //$RedisAPI->lock($openid);
        $DatabaseAPI = new \Lib\DatabaseAPI();
        $user = $DatabaseAPI->findUserForWechat($openid);
        if (!$user) {
            return false;
        }
        if ($user->status == 1) {
            //$RedisAPI->unlock($openid);
            return false;
        }
        if ($user->money == 0) {
            //$RedisAPI->unlock($openid);
            return false;
        }
        $log = $DatabaseAPI->findLog($openid);
        if ($log) {
            //$RedisAPI->unlock($openid);
            return false;
        }

        $api_url = "https://api.mch.weixin.qq.com/mmpaymkttransfers/sendredpack";
        $data = array(
            'nonce_str' => '123123',
            'mch_billno' => '1220782001' . date('Ymd') . rand(1000000000,9999999999),
            'mch_id' => '1220782001',
            'wxappid' => 'wx737a6d5fe4d19c89',
            'send_name' => 'Coach蔻驰',
            're_openid' => $user->openid,
            'total_amount' => $user->money,
            'total_num' => '1',
            'wishing' => '已收获你的满满爱意',
            'client_ip' => '120.132.93.148',
            'act_name' => 'Coach520告白',
            'remark' => 'Coach520告白红包立刻抢！',
        );
        $data['sign'] = $this->sign($data);
        $postData = '<xml>
        <sign><![CDATA['.$data['sign'].']]></sign>
        <mch_billno><![CDATA['.$data['mch_billno'].']]></mch_billno>
        <mch_id><![CDATA['.$data['mch_id'].']]></mch_id>
        <wxappid><![CDATA['.$data['wxappid'].']]></wxappid>
        <send_name><![CDATA['.$data['send_name'].']]></send_name>
        <re_openid><![CDATA['.$data['re_openid'].']]></re_openid>
        <total_amount><![CDATA['.$data['total_amount'].']]></total_amount>
        <total_num><![CDATA['.$data['total_num'].']]></total_num>
        <wishing><![CDATA['.$data['wishing'].']]></wishing>
        <client_ip><![CDATA['.$data['client_ip'].']]></client_ip>
        <act_name><![CDATA['.$data['act_name'].']]></act_name>
        <remark><![CDATA['.$data['remark'].']]></remark>
        <nonce_str><![CDATA['.$data['nonce_str'].']]></nonce_str>
        </xml>';
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $api_url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_SSLCERT,'/data/webown/cert/apiclient_cert.pem');
        curl_setopt($ch, CURLOPT_SSLKEY,'/data/webown/cert/apiclient_key.pem'); 
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
        $return = curl_exec($ch);
        curl_close($ch);
        $DatabaseAPI->updateStatusByUid($user->uid);
        $rs = $DatabaseAPI->redpacketLog($user->uid, $user->openid, $user->money, $data['mch_billno'], $return);
        //$RedisAPI->unlock($openid);
        return $rs;
    }

    private function randstr($num = 6) {
        $str = '1234567890abcdefghijklmnopqrstuvwxyz';
        $noncestr = '';
        for ($i = 0; $i < $num; $i++ ) {
            $randval = mt_rand(0, 35);
            $noncestr .= $str[$randval];
        }
        return $noncestr;
    }

    private function sign($data, $key = 'd93fb4bd3400244ece3145637c85622a') {
        ksort($data);
        $str = urldecode(http_build_query($data)) . '&key=' . $key;
        return strtoupper(md5($str)); 
    }





}
