<?php
namespace Core;

class Request {

	public $request;

	public $query;

	public $params;

	public $validation;

	public function __construct() {
		$this->request = NULL;
		$this->query = NULL;
		if($_SERVER['REQUEST_METHOD'] == 'GET') {
			$this->params = $_GET;
			$this->query = $this;
		} else {
			$this->params = $_POST;
			$this->request = $this;
		}
		
	}

	public function get($param){
		if(isset($this->params[$param])) {
			return $this->params[$param];
		} else {
			return NULL;
		}
	}

	public function validation($fields) {
		if($this->request) {
			$this->validRules($fields, $_POST);
			$_POST = $this->validation;
		}
		if($this->query) {
			$this->validRules($fields, $_GET);
			$_GET = $this->validation;
		}
	}

	public function validRules($fields, $raw) {
		$data = array();
		foreach($fields as $field => $info) {
			if(!isset($this->params[$field])) {
				$response = new Response;
		        $response->statusPrint('999');
			}
		    $value = trim($raw[$field]);
		    if($info) {
		      if($info[0] == 'notnull' && $value == '') {
		        $code = isset($info[1]) ? $info[1] : '999';
		        $response = new Response;
		        $response->statusPrint($code, '信息不能为空');
		      }
		      if($info[0] == 'date' && !strtotime($value)){
		        $code = isset($info[1]) ? $info[1] : '999';
		        $response = new Response;
		        $response->statusPrint($code);
		      }
		      if($info[0] == 'mobile' && !preg_match("/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/", $value)){
		        $code = isset($info[1]) ? $info[1] : '999';
		        $response = new Response;
		        $response->statusPrint($code, '手机号码不正确');
		      }
		    }
		    $data[$field] = $value; 
		}	
		$this->validation = $data;
	}
}