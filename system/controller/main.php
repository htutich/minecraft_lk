<?php
    class controller_main {
        
		function __construct(){}
			
		function about(){ 		display('about'); }
		function howstart(){ 	display('howstart'); }
		function rules(){ 		display('rules'); }
		function donate(){ 		display('donate'); }
		function download(){ 	display('download'); }

        function index(){

			$url = 'https://api.vk.com/method/wall.get?owner_id=-131551509&v=5.107&access_token=b10e496cb10e496cb10e496cf1b16b7a2cbb10eb10e496cea46d8ed326ad9f8cf66c9fc&count=4';
	        $ch = curl_init( $url );
	        curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
	        curl_setopt( $ch, CURLOPT_SSL_VERIFYHOST, false );
	        curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false );
	        $response = curl_exec( $ch );
	        curl_close( $ch );
			$res = json_decode($response, true);
			foreach($res as $val_one){
				foreach($val_one as $val){
					if (is_array($val)) {
						for($i=0;$i<sizeof($val);$i++){ 
							if(!is_null($val[$i]['text'])){
								$text =	nl2br($val[$i]['text']);
								$date =	date("d.m.Y",$val[$i]['date']);
								$href =	'https://vk.com/wall'.$val[$i]['from_id'].'_'.$val[$i]['id'];
								//@$photo = $val[$i]['attachments'][0]['photo']['photo_807'];
								//if(!$photo) {$photo = '/media/img/VK_ad.png';}
	
								$pattern = "/(?i)\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))/";
								$text = preg_replace($pattern, "<a href='$1'>$1</a>", $text);
	
								$data['news'] .= '
										<div class="vk_news_block">
											<a href="'.$href.'" target="_blank" class="phantom_link"></a>
											<p class="vk_news_description">
												'.$text.'
												<br>
											</p>
											<div class="blog_post_title">
												<a href="'.$href.'" target="_blank"><span class="vk_news_title">Подробнее в VK </span></a>
											</div>
										</div>
								';
							}
						}
					}

				}
			}
        	display('main',$data);
		}

		function getServerStatus(){
			$host = '95.217.87.5';  //IP сервера
			$port = '25565';  //Порт сервера
			$socket = @fsockopen($host, $port , $errno , $errstr, 2);
			if ($socket == false) { $what='off';}
			@fwrite($socket, "\xFE\x01");
			$data = "";
			$data = @fread($socket, 256);
			@fclose($socket);
			if ($data == false or substr($data, 0, 1) != "\xFF") {exit(json_encode(array('status' => 'offlain','msg' => 'Технические работы')));}
			$info= substr( $data, 3 );
			$info = iconv( 'UTF-16BE', 'UTF-8', $info );
			if( $info[ 1 ] === "\xA7" && $info[ 2 ] === "\x31" ) {
				$info = explode( "\x00", $info );
				$playersOnline1=IntVal( $info[4] );
				$playersMax1 = IntVal( $info[5] );
			} else {
				$info = Explode( "\xA7", $info );
				$playersOnline1=IntVal( $info[1] );
				$playersMax1 = IntVal( $info[2] );
			}
			exit(json_encode(array('status' => 'onlain','players' => $playersOnline1, 'maxSlots' => $playersMax1)));
		}
		
    }