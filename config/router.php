<?php

$routers = array();
$routers['/'] = array('CoachBundle\Site', 'index');
$routers['/scan'] = array('CoachBundle\Api', 'qrcode');
$routers['/getdata'] = array('CoachBundle\Api', 'getdata');
$routers['/callback'] = array('CoachBundle\Api', 'callback');
$routers['/api/test'] = array('CoachBundle\Api', 'test');
$routers['/api/islogin'] = array('CoachBundle\Api', 'islogin');
$routers['/api/info'] = array('CoachBundle\Api', 'info');