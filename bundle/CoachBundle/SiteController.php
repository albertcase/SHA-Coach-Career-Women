<?php
namespace CoachBundle;

use Core\Controller;


class SiteController extends Controller {

	public function indexAction() {		
		$UserAPI = new \Lib\UserAPI();
		$user = $UserAPI->userLoad(true);
		if (!$user) {
			$parameterAry = $_GET;
			if(count($parameterAry)>0)
				$url = "/?".http_build_query($parameterAry);
			else
				$url = "/";
			$_SESSION['redirect_url'] = $url;
			$WechatAPI = new \Lib\WechatAPI();
			$WechatAPI->wechatAuthorize();
		}
		if (!isset($user->headimgurl)) {
			$databaseapi = new \Lib\DatabaseAPI();
			$user->headimgurl = $databaseapi->getHeadimgurlByOpenid($user->openid);
			$_SESSION['user'] = $user;
		}
		$wechatapi = new \Lib\WechatAPI();
		$rs = $wechatapi->isSubscribed($user->openid); 
		if ($rs) {
			$this->render('index', array('headimgurl' => $user->headimgurl));
			exit;
		}
		$this->render('qrcode');
		exit;
		
	}

}
