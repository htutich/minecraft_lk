<?php
class WebApi {
	function Auth(){
		$key = '7GJ96pBE2kpNj6D';
		return $key;
	}
	
	function isOnline($player){
		$connect = mysqli_connect('localhost', 'solmics', 'nHP3xwc6scTA') or die('error connect');
		mysqli_select_db($connect, 'solmics') or die(mysqli_error());
		$sql = mysqli_query($connect, "SELECT `uuid` FROM `users` WHERE `login` = '".$player."'") or die(mysqli_error($connect));
		$res = mysqli_fetch_assoc($sql);
		
		$ch = curl_init('http://93.92.205.199:8080/api/v5/player?key=7GJ96pBE2kpNj6D');
		curl_setopt_array($ch, array(
			CURLOPT_RETURNTRANSFER => TRUE,
			CURLOPT_HTTPHEADER => array(
				'Content-Type: application/json'
			),
		));
		$response = curl_exec($ch);
		$result = json_decode($response, true);
		if (is_null($result)) {
			$result = array();
		}
		foreach ($result as $key => $value) {
			if ($value['uuid'] == $res['uuid']) {
				return true;
			}
		}
		return false;
	}
	
	function exec($command){
		$postData = array('command' => $command);

		$ch = curl_init('http://93.92.205.199:8080/api/v5/cmd?key=7GJ96pBE2kpNj6D');
		curl_setopt_array($ch, array(
			CURLOPT_POST => TRUE,
			CURLOPT_RETURNTRANSFER => TRUE,
			CURLOPT_HTTPHEADER => array(
				'Content-Type: application/json'
			),
			CURLOPT_POSTFIELDS => json_encode(array($postData))
		));
		$response = curl_exec($ch);
		$result = json_decode($response, true);
		return $result;
	}
	
}
?>