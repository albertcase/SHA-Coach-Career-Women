<?php

$routers = array();
$routers['/'] = array('CoachBundle\Site', 'index');
$routers['/scan'] = array('CoachBundle\Api', 'qrcode');
$routers['/getdata'] = array('CoachBundle\Api', 'getdata');
$routers['/callback'] = array('CoachBundle\Api', 'callback');
$routers['/api/test'] = array('CoachBundle\Api', 'test');
$routers['/api/islogin'] = array('CoachBundle\Api', 'islogin');
$routers['/api/status'] = array('CoachBundle\Api', 'status');
$routers['/api/card'] = array('CoachBundle\Api', 'card');
$routers['/api/share'] = array('CoachBundle\Api', 'share');