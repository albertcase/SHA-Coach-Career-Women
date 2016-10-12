<?php
namespace WechatBundle;

use Core\Controller;


class ApiController extends Controller {

	public function replyAction() {
		$wechatAPI = new \Lib\WechatAPI(TOKEN);
		// valid
		if (isset($_GET["echostr"])) {
			$wechatAPI->valid();
			exit;
		}
		// process the received data
		$postObj = $wechatAPI->responseMsg();
		//$this->addListener('after.received', new WechatListener(), 'xxxRecieved');
		$this->addListener('after.received', new WechatListener(), 'afterRecieved');
		$this->dispatch('after.received', $postObj);

		$received = $this->receivedDateFormat($postObj);
		// process to reply and record conversation
		$replyObject = $this->retrieveReplyObject($received);
		$this->dispatch('before.response', $replyObject);

		$response = $wechatAPI->replyXml($replyObject);
		return $this->Response($response);
	}

 	public function receivedDateFormatAction($postObj) {
	  $received = new stdClass();
	  foreach($postObj as $key => $value) {
	    switch ($key) {
	      case 'MsgType':
	        $received->$key = strtolower(trim((string) $value));
	        break;
	      case 'Event':
	        $received->$key = strtolower(trim((string) $value));
	        break;
	      default:
	        $received->$key = (string) $value;
	        break;
	    }
	  }
	  return $received;
 	}

 	public function retrieveReplyObjectAction($received) {
		$RedisAPI = new \LIB\RedisAPI();
		$trigger = $RedisAPI->retrieveTrigger($received);
		if($trigger) {
			$this->addListener('before.response', new WechatListener(), $trigger->hook);
		}
		return $RedisAPI->retrieveReplyObject($received);
	}

	public function testAction($a, $b) {
		$this->render('test', array('a'=>$a, 'b' =>$b));
		exit;
	}

}
