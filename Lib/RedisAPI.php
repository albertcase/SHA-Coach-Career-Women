<?php
namespace Lib;

class RedisAPI {

	private $_redis;

	public function __construct() {
		$redis = new \Redis();
   		$redis->connect(REDIS_HOST, REDIS_PORT);
   		$this->_redis = $redis;
	}

	public function islock($openid){
		if($this->_redis->get("coach:" . $openid)){
			return true;
		}
		return false;	
	}

	public function lock($openid){
		$this->_redis->set("coach:" . $openid, 1);
		
	}

	public function unlock($openid){
		$this->_redis->del("coach:".$openid);
	}
}