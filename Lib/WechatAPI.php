<?php
namespace Lib;

class WechatAPI {

  private $_token;
  private $_appid;
  private $_appsecret;

  public function __construct() {
    // $this->_token = TOKEN;
    // $this->_appid = APPID;
    // $this->_appsecret = APPSECRET;
  }



  public function wechatAuthorize() {
    $url = CURIO_AUTH_URL;
    header("Location:" . $url);
    exit;
  }

  public function getUserInfo($openid) {
  	$api_url = "http://coach.samesamechina.com/v2/wx/users/no_cache/" . $openid . "?access_token=" . CURIO_TOKEN;
    $ch = curl_init ();
    // print_r($ch);
    curl_setopt ( $ch, CURLOPT_URL, $api_url );
    //curl_setopt ( $ch, CURLOPT_POST, 1 );
    curl_setopt ( $ch, CURLOPT_HEADER, 0 );
    curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
    //curl_setopt ( $ch, CURLOPT_POSTFIELDS, json_encode($data) );
    $info = curl_exec ( $ch );
    curl_close ( $ch );
    $rs = json_decode($info, true);
    return $rs;
  }

  public function isSubscribed($openid) {
    $info = $this->getUserInfo($openid);
    if(isset($info['subscribe']) && $info['subscribe'] == 1)
      return TRUE;
    else
      return FALSE;
  }

  public function cardList(){
    $api_url = 'http://coach.samesamechina.com/v2/wx/card/js/add/json?access_token='. CURIO_TOKEN;
    // 参数数组
    $data[] = array(
            'card_id' => 'pKCDxjjMu_A_OlyidjNNeQ2Hqdrk',
      //'card_id' => 'pKCDxjmRzfE5XdnYkXaZS1iAaCHQ',
            'code' => '',
            'openid' => ''
    );
     
    $ch = curl_init ();
    // print_r($ch);
    curl_setopt ( $ch, CURLOPT_URL, $api_url );
    curl_setopt ( $ch, CURLOPT_POST, 1 );
    curl_setopt ( $ch, CURLOPT_HEADER, 0 );
    curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
    curl_setopt ( $ch, CURLOPT_POSTFIELDS, json_encode($data) );
    $return = curl_exec ( $ch );
    curl_close ( $ch );
    $return = json_decode($return,true);
    return $cardList = $return['data']['cardList'];
  }

}

?>