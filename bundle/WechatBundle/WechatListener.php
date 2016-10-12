<?php
namespace WechatBundle;

use \Lib\WechatAPI;
use \Lib\RedisAPI;
use \Lib\Response;

class WechatListener {

	function afterRecieved($receivedObject) {
		$wechatAPI = new WechatAPI();
		if($receivedObject->MsgType == 'location') {
		    $replyNews = $wechatAPI->prepareReplyObject('wechatReplyNewsObject');
		    $replyNews->fromUserName = $receivedObject->ToUserName;
		    $replyNews->toUserName = $receivedObject->FromUserName;
		    $RedisAPI = new RedisAPI();
		    $lbs = $RedisAPI->get(LBS_DATA);
		    $store = array();
		    foreach ($lbs->lbs as $key => $value) {
		    	$latitude = $receivedObject->Location_X;
		    	$longitude = $receivedObject->Location_Y;
		    	$store[$value->nid] = _get_distance_between_points($latitude, $longitude, $value->latitude, $value->longitude);
		    }
		    asort($store);
		  	$limit = '5';
		  	$i = 1;
		  	foreach($store as $nid => $distance) {
			  	$distance = $distance * 1.609344;
				if($distance >= 1)
					$distance = round($distance, 1) . 'km';
				else
					$distance = round($distance * 1000, 1) . 'm';

				$title = $lbs->shoppe[$nid]->title;
				$url = $lbs->shoppe[$nid]->url;
				$pic_url = $lbs->shoppe[$nid]->pic_url;
				$article = $wechatAPI->prepareReplyObject('wechatReplyArticleObject');
				$article->title = $i . '、' . $title . '(约' . $distance . ')';
				$article->description = '';
				$article->url = $url;
				$article->picUrl = $pic_url;
				$replyNews->articles[] = $article;
				if($i >= $limit) {
					break;
				} 
				$i++;
		  	}
		  	$data = $wechatAPI->replyXml($replyNews);
			$response = new Response($data);
		  	$response->send();
		}
	}

	function xxxRecieved($event) {
		$event->ToUserName = 'gf3albert';
	}
	
}

/**
  *
  * Get distance between points by latitude and longitude
  *
  * @param $latitude1, $longitude1, $latitude2, $longitude2
  * @return array
  *
  */
function _get_distance_between_points($latitude1, $longitude1, $latitude2, $longitude2) {
    $theta = $longitude1 - $longitude2;
    $miles = (sin(deg2rad($latitude1)) * sin(deg2rad($latitude2))) + (cos(deg2rad($latitude1)) * cos(deg2rad($latitude2)) * cos(deg2rad($theta)));
    $miles = acos($miles);
    $miles = rad2deg($miles);
    $miles = $miles * 60 * 1.1515;
    $feet = $miles * 5280;
    $yards = $feet / 3;
    $kilometers = $miles * 1.609344;
    $meters = $kilometers * 1000;
    $dis = compact('miles','feet','yards','kilometers','meters');
    return $dis['kilometers'];
}