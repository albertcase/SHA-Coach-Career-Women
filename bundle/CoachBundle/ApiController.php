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
		//  echo $count520 = $DatabaseAPI->loadCount(520);
		// echo '<br>';
		// echo $count520 = $DatabaseAPI->loadCount(100);
		//var_dump($userapi->sendredpack('oKCDxjivJ92ky4dxLT8dt1jcXtn4'));
		//var_dump($userapi->sendredpack('oKCDxjoxhlcJnOl6-xOTNZRTEo9s'));
		
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

	public function checkAction() {
		$UserAPI = new \Lib\UserAPI();
		$user = $UserAPI->userLoad(true);
		if (!$user) {
			return $this->statusPrint(0, '未登录');
		}

		if (isset($_SESSION['msg_time']) && NOWTIME - $_SESSION['msg_time'] <= 60) {
			return $this->statusPrint(3, '短信已经发出');
		}
		$request = $this->Request();
		$fields = array(
			'mobile' => array('mobile', '2'),
		);
		$request->validation($fields);
		$mobile = $request->request->get('mobile');
		$sms = new \Lib\SmsAPI();
		$code = $sms->sendMessage($user->uid, $mobile);
		$_SESSION['msg_time'] = NOWTIME;
		$_SESSION['msg_code'] = $code;
		return $this->statusPrint(1, '提交成功');
	}


	public function shareAction() {
		$UserAPI = new \Lib\UserAPI();
		$user = $UserAPI->userLoad(true);
		if (!$user) {
			return $this->statusPrint(0, '未登录');
		}
		if ($user->money != 0) {
			return $this->statusPrint(4, '已经领过');
		}
		$DatabaseAPI = new \Lib\DatabaseAPI();
		$nowMoney = $DatabaseAPI->loadMoney(); 
		if ($nowMoney >= 9000000) {
			return $this->statusPrint(2, '红包已经发完了');
		}	
		$money = 100;
		// $rand = mt_rand(1,69900);	
		// if ($rand <= 500) {
		// 	$money = 520;
		// 	$count520 = $DatabaseAPI->loadCount(520);
		// 	if ($count520 >= 500) {
		// 		$money = 100;
		// 	}
		// } else {	
		// 	$money = 100;
		// 	$count100 = $DatabaseAPI->loadCount(100);
		// 	if ($count100 >= 69400) {
		// 		$money = 520;
		// 	}
		// }
		if ($DatabaseAPI->saveMoney($user->uid, $money)) {
			$user->money = $money;
			return $this->statusPrint(1, $money);
		}
		return $this->statusPrint(999, '服务器繁忙，请稍候再试');
		
	}

	public function cardAction() {
		$wechatapi = new \Lib\WechatAPI();
		$list = $wechatapi->cardList();
		return $this->statusPrint(1, $list);
	}
}
