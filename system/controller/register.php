<?php
    class controller_register {
        
        function __construct(){}

        function checkuser(){
            if(isset($_POST['userKey'])){
                
                $server_output = json_decode(checkCapcha($_POST['userKey']));
                if (isset($_POST['userLogin']) || isset($_POST['userPass']) || isset($_POST['userEmail'])) {
                    $error = array();
                    if (!preg_match('/^[a-z0-9_]+$/i', $_POST['userLogin']) ) {
                        $error['userLogin'] = 'error';
                    }
                    if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/im', $_POST['userPass']) ) {
                        $error['userPass'] = 'error';
                    }
                    if (!preg_match('/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/im ', $_POST['userEmail']) ) {
                        $error['userEmail'] = 'error';
                    }
                    if ($error['userLogin'] == 'error' || $error['userPass'] == 'error' || $error['userEmail'] == 'error') {
                        die(json_encode($error));
                    }
                }

                if (!model_main::checkUserLogin($_POST['userLogin'])) {
                    $error['userLogin'] = 'error';
                    die(json_encode($error));
                }
                if (!model_main::checkUserEmail($_POST['userEmail'])) {
                    $error['userEmail'] = 'error';
                    die(json_encode($error));
                }
                if($server_output->score > '0' AND $server_output->action == 'register'){
                    $reg_accept = model_main::createUser($_POST['userLogin'], $_POST['userPass'], $_POST['userEmail']);

                    //email_send($_POST['userEmail'], 'Подтверждение регистрации', 'Для подтверждения вашего аккаунта, пройдите по ссылке ниже. <br> <a href="'.CP.'/register/accept&code='.$reg_accept.'">'.CP.'/register/accept&code='.$reg_accept.'</a>');
                    $error['none'] = 'success';
                    die(json_encode($error));
                } else {
                    $error['userBot'] = 'error';
                    die(json_encode($error));
                }

            }
        }
        function accept(){
            if(model_main::checkRegCode($_REQUEST['code'])){
                display('accept-reg');
            } else {
                display('error-reg');
            }
        }

        function repeatCodeCheck(){
            $server_output = json_decode(checkCapcha($_POST['userKey']));

            if($server_output->score > '0' AND $server_output->action == 'repeatCode'){
                $reg_accept = model_main::getUUID($_POST['userEmail']);
                if($reg_accept){
                    email_send($_POST['userEmail'], 'Подтверждение регистрации', 'Для подтверждения вашего аккаунта, пройдите по ссылке ниже. <br> <a href="'.CP.'/register/accept&code='.$reg_accept.'">'.CP.'/register/accept&code='.$reg_accept.'</a>');
                    $error['none'] = 'success';
                    die(json_encode($error));
                } else {
                    $error['BadEmail'] = 'error';
                    die(json_encode($error));
                }

            } else {
                $error['userBot'] = 'error';
                die(json_encode($error));
            }

        }


        function repeatCode(){
            display('repeat-code');
        }

        function resetPass(){
            display('resetpass');
        }

        function resetPass_(){
            if (model_main::checkUserEmail($_POST['userEmail'])) {
                $error['Email'] = 'error';
                die(json_encode($error));
            }
            $server_output = json_decode(checkCapcha($_POST['userKey']));
            if($server_output->score > '0' AND $server_output->action == 'resetPass'){

                $new_pass = randomPassword();
                $text = 'Новый пароль: <b>'.$new_pass.'</b>';
                model_main::updUserPass($_POST['userEmail'], md5(md5($new_pass)));

                email_send($_POST['userEmail'], 'Восстановление пароля', $text);
                $error['none'] = 'success';
                die(json_encode($error));

            } else {
                $error['userBot'] = 'error';
                die(json_encode($error));
            }
        }

        function index(){
        	display('register');
        }
    }