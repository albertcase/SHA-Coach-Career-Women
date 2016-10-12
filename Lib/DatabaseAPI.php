<?php
namespace Lib;

class DatabaseAPI extends Base {

	private $db;

	public function __construct() {
		$connect = new \mysqli(DBHOST, DBUSER, DBPASS, DBNAME);
		$this->db = $connect;
		$this->db->query("set names utf8");
	}

	public function insertCurio($result) {
		$sql = "INSERT INTO `curio_result` SET `result` = ?";
		$res = $this->db->prepare($sql); 
		$res->bind_param("s", $result);
		if ($res->execute()) {
			return TRUE;
		} else {
			return FALSE;
		}
	}

	public function insertUser($openid) {
		$user = $this->findUserByOpenid($openid);
		if ($user) {
			return $user;
		}
		$sql = "INSERT INTO `coach_info` SET `openid` = ?";
		$res = $this->db->prepare($sql); 
		$res->bind_param("s", $openid);
		if ($res->execute()) {
			return $this->findUserByOpenid($openid);
		} else {
			return FALSE;
		}
	}

	public function regUser($openid, $nickname, $headimgurl) {
		if ($this->findUserByOauth($openid)) {
			return TRUE;
		}
		$sql = "INSERT INTO `coach_oauth` SET `openid` = ?, nickname = ?, headimgurl = ?";
		$res = $this->db->prepare($sql); 
		$res->bind_param("sss", $openid, $nickname, $headimgurl);
		if ($res->execute()) {
			return TRUE;
		} else {
			return FALSE;
		}
	}

	public function findUserByOauth($openid) {
		$sql = "SELECT id  FROM `coach_oauth` WHERE `openid` = ?"; 
		$res = $this->db->prepare($sql);
		$res->bind_param("s", $openid);
		$res->execute();
		$res->bind_result($uid);
		if($res->fetch()) {
			return TRUE;
		}
		return FALSE;
	}

	public function findUserByOpenid($openid) {
		if (isset($_SESSION['user'])) {
			return $_SESSION['user'];
		}
		$sql = "SELECT `id`, `openid`, `money` FROM `coach_info` WHERE `openid` = ?"; 
		$res = $this->db->prepare($sql);
		$res->bind_param("s", $openid);
		$res->execute();
		$res->bind_result($uid, $openid, $money);
		if($res->fetch()) {
			$user = new \stdClass();
			$user->uid = $uid;
			$user->openid = $openid;
			$user->money = $money;
			$_SESSION['user'] = $user;
			return $user;
		}
		return NULL;
	}

	public function getHeadimgurlByOpenid($openid) {
		$sql = "SELECT headimgurl  FROM `coach_oauth` WHERE `openid` = ?"; 
		$res = $this->db->prepare($sql);
		$res->bind_param("s", $openid);
		$res->execute();
		$res->bind_result($headimgurl);
		if($res->fetch()) {
			return $headimgurl;
		}
		return '';
	}

	public function saveSmsLog($uid, $mobile, $code, $lindid, $msg, $send_rs) {
		$sql = "INSERT INTO `coach_mobile` SET `uid` = ?, `mobile` = ?, code = ?, lindid = ?, msg = ?, send_rs = ?";
		$res = $this->db->prepare($sql); 
		$res->bind_param("ssssss", $uid, $mobile, $code, $lindid, $msg, $send_rs);
		if ($res->execute()) {
			return TRUE;
		} else {
			return FALSE;
		}
	}

	public function saveScan($data) {
		$sql = "INSERT INTO `coach_scan` SET `result` = ?";
		$res = $this->db->prepare($sql); 
		$res->bind_param("s", $data);
		if ($res->execute()) {
			return TRUE;
		} else {
			return FALSE;
		}
	}

	public function coachLog($data) {
		$sql = "INSERT INTO `coach_log` SET `result` = ?";
		$res = $this->db->prepare($sql); 
		$res->bind_param("s", $data);
		if ($res->execute()) {
			return TRUE;
		} else {
			return FALSE;
		}
	}

	public function loadMoney() {
		$sql = "SELECT sum(`money`) FROM `coach_info`"; 
		$res = $this->db->prepare($sql);
		$res->execute();
		$res->bind_result($num);
		if($res->fetch()) {
			return $num;
		}
		return 0;
	}

	public function loadCount($money) {
		$sql = "SELECT count(id) FROM `coach_info` where `money`= ?"; 
		$res = $this->db->prepare($sql);
		$res->bind_param("s", $money);
		$res->execute();
		$res->bind_result($num);
		if($res->fetch()) {
			return $num;
		}
		return 0;
	}

	public function saveMoney($uid, $money) {
		$sql = "UPDATE `coach_info` SET `money` = ? WHERE `id` = ?";
		$res = $this->db->prepare($sql); 
		$res->bind_param("ss", $money, $uid);
		if ($res->execute()) {
			return TRUE;
		} else {
			return FALSE;
		}
	}

	public function loadStatusByUid($uid) {
		$sql = "SELECT status  FROM `coach_info` WHERE `id` = ?"; 
		$res = $this->db->prepare($sql);
		$res->bind_param("s", $uid);
		$res->execute();
		$res->bind_result($status);
		if($res->fetch()) {
			return $status;
		}
		return FALSE;
	}

	public function loadStatusAndMoneyByUid($uid) {
		$sql = "SELECT status,money  FROM `coach_info` WHERE `id` = ?"; 
		$res = $this->db->prepare($sql);
		$res->bind_param("s", $uid);
		$res->execute();
		$res->bind_result($status, $money);
		if($res->fetch()) {
			$data = new \stdClass();
			$data->status = $status;
			$data->money = $money;
			return $data;
		}
		return FALSE;
	}

	public function updateStatusByUid($uid) {
		$sql = "UPDATE `coach_info` SET status=1 WHERE `id` = ?"; 
		$res = $this->db->prepare($sql);
		$res->bind_param("s", $uid);
		if ($res->execute()) {
			return TRUE;
		} else {
			return FALSE;
		}
	}

	public function redpacketLog($uid, $openid, $money, $orderid, $result) {
		$postObj = simplexml_load_string($result, 'SimpleXMLElement', LIBXML_NOCDATA);
		$msg = $postObj->result_code;
		if ($msg != 'SUCCESS')
			$msg = $postObj->err_code;
		$sql = "INSERT INTO `coach_redpacket_log` SET `uid` = ?, `openid` = ?, `money` = ?, `orderid` = ?, `result` = ?, `msg` = ?";
		$res = $this->db->prepare($sql); 

		$res->bind_param("ssssss", $uid, $openid, $money, $orderid, $result, $msg);

		if ($res->execute()) {
			return TRUE;
		} else {
			return FALSE;
		}
	}

	public function findUserForWechat($openid) {
		$sql = "SELECT `id`, `openid`,  `money`, `status` FROM `coach_info` WHERE `openid` = ?"; 
		$res = $this->db->prepare($sql);
		$res->bind_param("s", $openid);
		$res->execute();
		$res->bind_result($uid, $openid, $money, $status);
		if($res->fetch()) {
			$user = new \stdClass();
			$user->uid = $uid;
			$user->openid = $openid;
			$user->money = $money;
			$user->status = $status;
			return $user;
		}
		return NULL;
	}

	public function findLog($openid) {
		$sql = "SELECT id FROM `coach_redpacket_log` WHERE `openid` = ? and `msg` = 'SUCCESS'"; 
		$res = $this->db->prepare($sql);
		$res->bind_param("s", $openid);
		$res->execute();
		$res->bind_result($id);
		if($res->fetch()) {
			return $id;
		}
		return NULL;
	}

	public function findUserOverRedpacket() {
		//$sql = "SELECT openid FROM `coach_info` WHERE status=0 and money<>0"; 
		$sql = "select distinct(openid) from coach_redpacket_log where openid not in (select openid from coach_redpacket_log where msg='SUCCESS') "; 
		$res = $this->db->query($sql);
		$data = array();
		while($rows = $res->fetch_array(MYSQLI_ASSOC))
		{
			$data[] = $rows;
		}	
		return $data;
	}

	

}
