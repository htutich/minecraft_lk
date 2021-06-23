<?php
	/*
	 * Скрипт для приёма и отправки запросов
	 * by Semen4ik 
	 * Skype: Semenov1215
	 * to RuBukkit.ORG
	 */
	session_start();
	include "config.php";
	require_once("payment.class.php");
	$pay = new payment();
	if (isset($_REQUEST['amount']) && isset($_REQUEST['payment'])) {
		header ("Location: ".$pay->pay_form($_REQUEST['amount'], $pay->config['user_param'], $_REQUEST['payment']));
	} else if (isset($_REQUEST['method']) && isset($_REQUEST['params'])) {
			switch (strtolower($_REQUEST['method'])) {
				case "check" :
					echo $pay->up_sign($_REQUEST['params'], "check"); 
				break;
				case "pay" :
					echo $pay->up_sign($_REQUEST['params'], "pay");
					$pay->pay($_REQUEST['params']['sum'], $_REQUEST['params']['account'], "pay");
				break;
				default :
					$pay->up_json_reply("error", $_REQUEST['params']);
				break;
			}
			exit();
	} else {
		if (isset($_GET['reply'])) {
			echo $config['message'][$_GET['reply']];
		} else {
			if(!$pay->ik_sign($_REQUEST)) exit("403");
			$pay->pay($_REQUEST['ik_am'], $_REQUEST['ik_pm_no']);
		}
	}
?>