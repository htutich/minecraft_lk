<?php
    class controller_profile {
        
        function __construct(){

        }

        function index(){

            if(!model_main::is_autorized()){redirect('/main');}
            display('profile');
            
        }


        function getSkin(){

            $username = $_GET['user'];
            
            if(model_main::is_autorized() && $username == NULL){$username = $_SESSION['login'];}

            if(!preg_match('/[a-zA-Z0-9_-]/im', $username)) { die();}

            if(!file_exists(SKINS.$username.'.png')){$username = 'default'; }

            header('Content-Type: image/png');
            readfile(SKINS.$username.'.png');

        }


        function getCloak(){
            $username = $_GET['user'];
            
            if(model_main::is_autorized() && $username == NULL){$username = $_SESSION['login'];}

            if(!preg_match('/[a-zA-Z0-9_-]/im', $username)) { die();}

            if(!file_exists(CLOAKS.$username.'.png')){ die(header("HTTP/1.0 404 Not Found")); }

            header('Content-Type: image/png');
            readfile(CLOAKS.$username.'.png');

        }


        function get3D(){
            if(model_main::is_autorized()){
                exit(json_encode(array('skin' => '/ajax/profile/getSkin', 'cloak' => '/ajax/profile/getCloak')));
            }
        }

        function getHead(){

            $username = $_GET['user'];

            if(model_main::is_autorized() && $username == NULL){$username = $_SESSION['login'];}

            if(!preg_match('/[a-zA-Z0-9_-]/im', $username)) { die();}

            if(file_exists(SKINS.$username.'.png')){ $username = $username; } else { $username = 'default'; }

            $get_size = @getimagesize(SKINS.$username.'.png');
            $width = $get_size[0];
            $height = $get_size[1];

            $multiple = $width / 64;
            $size=151;
            $path = SKINS.$username.'.png';
            $image = @imagecreatefrompng($path);
            if(!$image){ return false; }
    
            $new = imagecreatetruecolor($size, $size);
    
            imagecopyresized($new, $image, 0, 0, 8 * $multiple, 8 * $multiple, $size, $size, 8 * $multiple, 8 * $multiple);
            imagecopyresized($new, $image, 0, 0, 40 * $multiple, 8 * $multiple, $size, $size, 8 * $multiple, 8 * $multiple);
    
            imagedestroy($image);
    
            header('Content-Type: image/png');
            imagepng($new);
        }

        function mySkin(){
            if(!model_main::is_autorized()){redirect('/main');}
            display('profile/mySkin');
        }
        
        function myCash(){
            if(!model_main::is_autorized()){redirect('/main');}
            display('profile/myCash');
        }

        function myPass(){
            if(!model_main::is_autorized()){redirect('/main');}
            display('profile/myPass');
        }

        function changePass(){
            if(!model_main::is_autorized()){
                $error['authError'] = 'error';
                die(json_encode($error));
            }

            if (isset($_POST['userPass']) || isset($_POST['userNewPass'])) {
                $error = array();

                if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/im', $_POST['userNewPass']) ) {
                    $error['userNewPass'] = 'error';
                }

                if ($error['userNewPass'] == 'error') {
                    die(json_encode($error));
                }
            }

            $user = model_main::checkUserToAuth($_SESSION['login'], $_POST['userPass']);
            
            if($user)
            {
                $pass = md5(md5($_POST['userNewPass']));
                model_main::updUserPassById($_SESSION['user_id'], $pass);
                $error['none'] = 'success';
                die(json_encode($error));
            }
            else
            {
                $error['userPass'] = 'error';
                die(json_encode($error));
            }
        }

        function myPerms(){
            if(!model_main::is_autorized()){redirect('/main');}
            display('profile/myPerms');
        }

        function myRefer(){
            if(!model_main::is_autorized()){redirect('/main');}
            display('profile/myRefer');
        }

        function myRewards(){
            if(!model_main::is_autorized()){redirect('/main');}
            display('profile/myRewards');
        }

        function upload(){
            if(!model_main::is_autorized()){redirect('/main');}
			if ( is_uploaded_file($_FILES['file']['tmp_name']) )
			{
                $size = getimagesize($_FILES['file']['tmp_name']);
				if ( $_FILES['file']['type'] == 'image/png' ) 
				{
					if ( $_POST['type'] == '1' )
					{	
						$path = SKINS.$_SESSION['login'].'.png';
						
						if ( $size[0] == 64 && ($size[1] == 32 || $size[1] == 64) )
						{
							if ( copy($_FILES['file']['tmp_name'], $path) )
							{
								$json = '{
									"status": "success",
									"message": "Скин загружен."
								}';
								
							} else {
								$json = '{
									"status": "error",
									"message": "Ошибка загрузки скина."
                                }';
                            }
						} else if ( !($size[0] % 256) && !($size[1] % 128) /*$size[0] == 256 && $size[1]== 128 || $size[0] == 1024 && $size[1] == 512*/)
						{
							if ( copy($_FILES['file']['tmp_name'], $path) )
							{
								$json = '{
									"status": "success",
									"message": "HD скин загружен."
								}';
								
							}
						} else {
							$json = '{
								"status": "error",
								"message": "Неверные размеры скина."
                            }';
                        }
					} else {
						$path = CLOAKS.$_SESSION['login'].'.png';
						
						if ( $size[0] == 64 && $size[1] == 32 || $size[0] == 22 && $size[1] == 17) 
						{
							
							if ( copy($_FILES['file']['tmp_name'], $path) )
							{
								$json = '{
									"status": "success",
									"message": "Плащ загружен."
								}';
								
							}
						} else if ( !($size[0] % 256) && !($size[1] % 128) /*$size[0] == 512 && $size[1] == 256 || $size[0] == 1024 && $size[1] == 512*/)
						{
							
							if ( copy($_FILES['file']['tmp_name'], $path) )
							{
								$json = '{
									"status": "success",
									"message": "HD плащ загружен."
								}';
								
							}
						} else {
							$json = '{
								"status": "error",
								"message": "Неверные размеры плаща."
                            }';
                        }
					}
				} else {
					$json = '{
						"status": "error",
						"message": "Файл должен быть формата png!"
                    }';
                }
            }
            echo $json;
        }

        function donate(){
            if(!model_main::is_autorized()){die();}
            if (isset($_POST['donate'])) {
                    $gpreload = '';
                    $cmd_command_before = '';
                    $kit_give = '';
                    $perm = '';

                    $coin_sack_10 = '';
                    $coin_sack = '';
                    $gold_coin = '';
                    $silver_coin = '';

                    switch ($_POST['donate']) {
                        case 'fly':
                            $curent = model_main::getRealMoney($_SESSION['login']) - 79;
                            $cmd_command = 'luckperms user '.htmlspecialchars(htmlentities($_SESSION['login'])).' permission settemp nucleus.fly.base true 30d';
                            $perm = 'true';
                            break;
                        case 'keepondeath':
                            $curent = model_main::getRealMoney($_SESSION['login']) - 99;
                            $cmd_command = 'luckperms user '.htmlspecialchars(htmlentities($_SESSION['login'])).' permission settemp nucleus.inventory.keepondeath true 30d';
                            $perm = 'true';
                            break;
                        case 'god':
                            $curent = model_main::getRealMoney($_SESSION['login']) - 299;
                            $cmd_command = 'luckperms user '.htmlspecialchars(htmlentities($_SESSION['login'])).' permission settemp nucleus.god.base true 30d';
                            $perm = 'true';
                            break;
                        case 'repair':
                            $curent = model_main::getRealMoney($_SESSION['login']) - 49;
                            $cmd_command = 'luckperms user '.htmlspecialchars(htmlentities($_SESSION['login'])).' permission settemp nucleus.repair.base true 30d';
                            $perm = 'true';
                            break;
            
            
                        case 'heal':
                            $curent = model_main::getRealMoney($_SESSION['login']) - 79;
                            $cmd_command = 'luckperms user '.htmlspecialchars(htmlentities($_SESSION['login'])).' permission settemp nucleus.heal.base true 30d';
                            $perm = 'true';
                            break;
                        case 'back':
                            $curent = model_main::getRealMoney($_SESSION['login']) - 49;
                            $cmd_command_before = 'luckperms user '.htmlspecialchars(htmlentities($_SESSION['login'])).' permission settemp nucleus.back.base true 30d';
                            $cmd_command = 'luckperms user '.htmlspecialchars(htmlentities($_SESSION['login'])).' permission settemp nucleus.back.targets.death true 30d';
                            $perm = 'true';
                            break;
                        case 'enderchest':
                            $curent = model_main::getRealMoney($_SESSION['login']) - 49;
                            $cmd_command = 'luckperms user '.htmlspecialchars(htmlentities($_SESSION['login'])).' permission settemp nucleus.enderchest.base true 30d';
                            $perm = 'true';
                            break;
            

                        case 'nachalniy':
                            $curent = model_main::getRealMoney($_SESSION['login']) - 99;
                            $cmd_command = 'kit give '.htmlspecialchars(htmlentities($_SESSION['login'])).' "Начальный"';
                            $kit_give = 'true';
                            break;
                        case 'prodvinutiy':
                            $curent = model_main::getRealMoney($_SESSION['login']) - 199;
                            $cmd_command = 'kit give '.htmlspecialchars(htmlentities($_SESSION['login'])).' "Продвинутый"';
                            $kit_give = 'true';
                            break;
                        case 'prodvinutiyplus':
                            $curent = model_main::getRealMoney($_SESSION['login']) - 299;
                            $cmd_command = 'kit give '.htmlspecialchars(htmlentities($_SESSION['login'])).' "Продвинутый+"';
                            $kit_give = 'true';
                            break;
                        case 'eggspriziv':
                            $curent = model_main::getRealMoney($_SESSION['login']) - 99;
                            $cmd_command = 'kit give '.htmlspecialchars(htmlentities($_SESSION['login'])).' "Яйца призыва"';
                            $kit_give = 'true';
                            break;

            
                        case 'vip':
                            $curent = model_main::getRealMoney($_SESSION['login']) - 199;
                            $cmd_command = 'luckperms user '.htmlspecialchars(htmlentities($_SESSION['login'])).' parent addtemp vip 30d';
                            $gspreload = 'gpreload';
                            break;
                        case 'supervip':
                            $curent = model_main::getRealMoney($_SESSION['login']) - 349;
                            $cmd_command = 'luckperms user '.htmlspecialchars(htmlentities($_SESSION['login'])).' parent addtemp supervip 30d';
                            $gpreload = 'gpreload';
                            break;
                        case 'deluxe':
                            $curent = model_main::getRealMoney($_SESSION['login']) - 449;
                            $cmd_command = 'luckperms user '.htmlspecialchars(htmlentities($_SESSION['login'])).' parent addtemp deluxe 30d';
                            $gpreload = 'gpreload';
                            break;

                        case 'coin_sack_10':
                            $curent = model_main::getRealMoney($_SESSION['login']) - 499;
                            $cmd_command = 'coin '.htmlspecialchars(htmlentities($_SESSION['login'])).' sack 10';
                            $coin_sack_10 = 'true';
                            break;
                        case 'coin_sack':
                            $curent = model_main::getRealMoney($_SESSION['login']) - 149;
                            $cmd_command = 'coin '.htmlspecialchars(htmlentities($_SESSION['login'])).' sack 1';
                            $coin_sack = 'true';
                            break;
                        case 'gold_coin':
                            $curent = model_main::getRealMoney($_SESSION['login']) - 39;
                            $cmd_command = 'coin '.htmlspecialchars(htmlentities($_SESSION['login'])).' gold 1';
                            $gold_coin = 'true';
                            break;
                        case 'silver_coin':
                            $curent = model_main::getRealMoney($_SESSION['login']) - 9;
                            $cmd_command = 'coin '.htmlspecialchars(htmlentities($_SESSION['login'])).' silver 1';
                            $silver_coin = 'true';
                            break;
                    }
                    if ($curent >= 0) {
                        $WebApi = new WebApi();
                        $status = $WebApi->isOnline(htmlspecialchars(htmlentities($_SESSION['login'])));
            
                        if($status){ 
                            DBVCA::Execute("UPDATE `mcr_iconomy` SET `realmoney` = ".$curent." WHERE `username` = '".htmlspecialchars(htmlentities($_SESSION['login']))."'");
                            if($cmd_command_before != ''){
                                $WebApi->exec($cmd_command_before);
                            }
                            $WebApi->exec($cmd_command);
                            if ($gpreload == 'gpreload') {$WebApi->exec($gpreload);}
                            if($kit_give == 'true'){echo 'kit_give';}
                            if($perm == 'true') {echo 'success';}

                            if($coin_sack_10 == 'true') {echo 'coin_sack_10';}
                            if($coin_sack == 'true') {echo 'coin_sack';}
                            if($gold_coin == 'true') {echo 'gold_coin';}
                            if($silver_coin == 'true') {echo 'silver_coin';}
                        } else { 
                            echo 'user_offline';
                        }
            
                    } else {
                        echo "dont_have_money";
                    }

            }

            /*Выставление даты*/
                        
            if (isset($_POST['check_don'])) {
                    echo model_main::chechPerm($_POST['check_don']);
            }
            
        }
    }