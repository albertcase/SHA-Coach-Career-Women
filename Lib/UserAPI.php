<?php
namespace Lib;

class UserAPI extends Base {

	private $_db;

	public function __construct() {
		$this->_db = new \Lib\DatabaseAPI();
	}

	public function userLoad($type = false){
		if(isset($_SESSION['user'])){
			return $_SESSION['user'];
		} else {
			if ($type == true) {
				return false;
			}
			$WechatAPI = new \Lib\WechatAPI();
			$WechatAPI->wechatAuthorize();
		}
		
	}

	public function userLogin($openid){
		$result = $this->_db->findUserByOpenid($openid);
		$user = $result ? $result : $this->userRegister($openid);
		return $user;
	}

	public function userRegister($openid){
		return $this->_db->insertUser($openid);
	}
}