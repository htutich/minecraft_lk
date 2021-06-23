<?php
    class controller_auth {
        
        function __construct(){}

        function login(){
            $server_output = json_decode(checkCapcha($_POST['userKey']));
            if (isset($_POST['userLogin']) || isset($_POST['userPass'])) {
                $error = array();
                if (!preg_match('/[a-zA-Z0-9_-]/im', $_POST['userLogin']) ) {
                    $error['userLogin'] = 'error';
                }
                if ($_POST['userPass'] == '') {
                    $error['userPass'] = 'error';
                }

                if ($error['userLogin'] == 'error' || $error['userPass'] == 'error') {
                    die(json_encode($error));
                }

                if($server_output->score > '0' AND $server_output->action == 'login'){
                    $user = model_main::checkUserToAuth($_POST['userLogin'],$_POST['userPass']);

                    if($user){
                        model_main::loginUser($_POST['userLogin']);
                        $error['none'] = 'success';
                        die(json_encode($error));
                    } else {
                        $error['authError'] = 'error';
                        die(json_encode($error));
                    }

                } else {
                    $error['userBot'] = 'error';
                    $error['score'] = $server_output->score;
                    die(json_encode($error));
                }

            }
        }

        function logout(){
            session_destroy();
            redirect('/main/');
        }
    }