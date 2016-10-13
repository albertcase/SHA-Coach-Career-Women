<?php
namespace CoachBundle;

use Core\Controller;


class ApiController extends Controller {

	public function testAction() {
		set_time_limit(0);
		$userapi = new \Lib\RedpacketAPI();
		$DatabaseAPI = new \Lib\DatabaseAPI();
		$rs = $DatabaseAPI->findUserOverRedpacket();
		echo "<pre>";
		for ($i = 0; $i < count($rs); $i++) {
			var_dump($userapi->sendredpack($rs[$i]['openid']));
		}
		
		exit;
		
	}

	public function oauthAction() {
		$request = $this->Request();
		$fields = array(
			'callback' => array('url', '3')
		);
		$request->validation($fields);
		$url = $request->query->get('callback');
		$_SESSION['redirect_url'] = $url;
		$WechatAPI = new \Lib\WechatAPI();
		$WechatAPI->wechatAuthorize();
		exit;
	}

	public function callbackAction() {
		$request = $this->Request();
		$fields = array(
			'openid' => array('notnull', '3')
		);
		$request->validation($fields);
		$openid = $request->query->get('openid');
		$userapi = new \Lib\UserAPI();
		$userapi->userLogin($openid);
		$url = isset($_SESSION['redirect_url']) ? $_SESSION['redirect_url'] : "/";
		$this->redirect($url);
		exit;
	}

	public function getdataAction() {
		$data = $GLOBALS['HTTP_RAW_POST_DATA'];	
		$data = json_decode($data, true);
		$databaseapi = new \Lib\DatabaseAPI();
		$databaseapi->regUser($data['data']['openid'], $data['data']['nickname'], $data['data']['headimgurl']);
		$databaseapi->coachLog($GLOBALS['HTTP_RAW_POST_DATA']);
		exit;
	}

	public function qrcodeAction() {
		//exit;	
		$data = $GLOBALS['HTTP_RAW_POST_DATA'];
		//$data = 123;
		$postObj = simplexml_load_string($data, 'SimpleXMLElement', LIBXML_NOCDATA);
		if ($postObj->EventKey == 'qrscene_194' || $postObj->EventKey == '194') {
			$DatabaseAPI = new \Lib\DatabaseAPI();
			$DatabaseAPI->saveScan($data);
			
			$openid = $postObj->FromUserName;
			$redpacket = new \Lib\RedpacketAPI();
			$redpacket->sendredpack($openid);
		}
		exit;
	}

	public function isloginAction() {
		$UserAPI = new \Lib\UserAPI();
		$user = $UserAPI->userLoad(true);
		if (!$user) {
			return $this->statusPrint(0, '未登录');
		}
		return $this->statusPrint(1, $user);
	}

	public function statusAction() {
		if (!isset($_SESSION['user'])) {
			return $this->statusPrint(0, '未登录');
		}
		$UserAPI = new \Lib\UserAPI();
		$user = $UserAPI->userLoad(true);
		if (!$user) {
			return $this->statusPrint(0, '未登录');
		}
		$wechatapi = new \Lib\WechatAPI();
		//Eric 获取用户资料（关注） 微信js 
		$rs = $wechatapi->isSubscribed($user->openid); 
		if ($rs) {
			return $this->statusPrint(1, '已关注');
		}
		return $this->statusPrint(2, '未关注');
	}


	public function cardAction() {
		$wechatapi = new \Lib\WechatAPI();
		$list = $wechatapi->cardList();
		return $this->statusPrint(1, $list);
	}
}
