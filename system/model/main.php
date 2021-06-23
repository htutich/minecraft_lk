<?php
class model_main {

    function __construct(){
    }
    static function is_autorized(){
        return isset($_SESSION['user_id']);
    }

    static function checkUserLogin($login){
        $login = DBVCA::WebDBconnect()->real_escape_string($login);

        $result = DBVCA::Execute("SELECT * FROM `users` WHERE login='".$login."'");
        if($result->num_rows > '0'){return false;} else {return true;}
    }
    static function checkUserEmail($email){
        $email = DBVCA::WebDBconnect()->real_escape_string($email);

        $result = DBVCA::Execute("SELECT * FROM `users` WHERE email='".$email."'");
        if($result->num_rows > '0'){return false;} else {return true;}
    }
    static function checkUserToAuth($login, $pass){
        $login = DBVCA::WebDBconnect()->real_escape_string($login);

        $pass = md5(md5($pass));
        $result = DBVCA::Execute("SELECT * FROM `users` WHERE login='".$login."' AND password='".$pass."'");
        if($result->num_rows == '0'){return false;} else {return true;}
    }

    static function createUser($login, $pass, $email){
        $login = DBVCA::WebDBconnect()->real_escape_string($login);
        $email = DBVCA::WebDBconnect()->real_escape_string($email);

        $pass = md5(md5($pass));
        $uuid = logintouuid($login);
        $sql = "
        INSERT INTO `users` 
        (
            `gid`,
            `email`, 
            `password`, 
            `login`, 
            `uuid`
        )
        VALUES 
        (
            '2',
            '".$email."', 
            '".$pass."', 
            '".$login."', 
            '".$uuid."'
        );";
        DBVCA::Execute($sql);
        return $uuid;
    }

    static function checkRegCode($code){
        $code = preg_replace("/[^\w-]/", '', $code);
        $result = DBVCA::Execute("SELECT * FROM `users` WHERE uuid='".$code."' and gid = '1'");
        if($result->num_rows != '1'){return false;} else {
            DBVCA::Execute("UPDATE `users` SET `gid` = '2' WHERE uuid='".$code."' and gid = '1'");
            return true;
        }
    }

    static function getUUID($email){
        $email = DBVCA::WebDBconnect()->real_escape_string($email);

        $result = DBVCA::FetchExecute("SELECT uuid FROM `users` WHERE email='".$email."'");
        if(!$result['uuid']){return false;} else {
            return $result['uuid'];
        }
    }

    static function getRealMoney($username){
        $username = DBVCA::WebDBconnect()->real_escape_string($username);
        $result = DBVCA::FetchExecute("SELECT money FROM `users` WHERE login = '".$username."'");
        return $result['money'];
    }

    function loginUser($login){
        $result = DBVCA::FetchExecute("SELECT * FROM `users` WHERE login='".$login."'");
        $_SESSION['user_id'] = $result['id'];
        $_SESSION['user_gid'] = $result['gid'];
        $_SESSION['login'] = $result['login'];
        $_SESSION['uuid'] = $result['uuid'];
    }

    function updUserPass($email, $pass){
        $email = DBVCA::WebDBconnect()->real_escape_string($email);

        DBVCA::Execute("UPDATE `users` SET password = '".$pass."' WHERE email = '".$email."'");
    }

    function updUserPassById($id, $pass){
        DBVCA::Execute("UPDATE `users` SET password = '".$pass."' WHERE id = '".$id."'");
    }
    
    function chechPerm($donate){
        switch ($donate) {
            case 'fly':
                $res = DBVCA::FetchExecute("SELECT `expiry` FROM `luckperms_user_permissions` WHERE `uuid` = '".$_SESSION['uuid']."' AND `permission` = 'nucleus.fly.base'");
                if($res){
                    $date_end = date("d.m.Y H:i",$res['expiry']);
                } else {
                    $date_end = false;
                }
                
                break;
            case 'keepondeath':
                $res = DBVCA::FetchExecute("SELECT `expiry` FROM `luckperms_user_permissions` WHERE `uuid` = '".$_SESSION['uuid']."' AND `permission` = 'nucleus.inventory.keepondeath'");
                if($res){
                    $date_end = date("d.m.Y H:i",($res['expiry']));
                } else {
                    $date_end = false;
                }
                break;
    
            case 'god':
                $res = DBVCA::FetchExecute("SELECT `expiry` FROM `luckperms_user_permissions` WHERE `uuid` = '".$_SESSION['uuid']."' AND `permission` = 'nucleus.god.base'");
                if($res){
                    $date_end = date("d.m.Y H:i",($res['expiry']));
                } else {
                    $date_end = false;
                }
                break;
    
            case 'repair':
                $res = DBVCA::FetchExecute("SELECT `expiry` FROM `luckperms_user_permissions` WHERE `uuid` = '".$_SESSION['uuid']."' AND `permission` = 'nucleus.repair.base'");
                if($res){
                    $date_end = date("d.m.Y H:i",($res['expiry']));
                } else {
                    $date_end = false;
                }
                break;
    
    
            case 'heal':
                $res = DBVCA::FetchExecute("SELECT `expiry` FROM `luckperms_user_permissions` WHERE `uuid` = '".$_SESSION['uuid']."' AND `permission` = 'nucleus.heal.base'");
                if($res){
                    $date_end = date("d.m.Y H:i",($res['expiry']));
                } else {
                    $date_end = false;
                }
                break;

            case 'back':
                $res = DBVCA::FetchExecute("SELECT `expiry` FROM `luckperms_user_permissions` WHERE `uuid` = '".$_SESSION['uuid']."' AND `permission` = 'nucleus.back.targets.death'");
                if($res){
                    $date_end = date("d.m.Y H:i",($res['expiry']));
                } else {
                    $date_end = false;
                }
                break;
    
            case 'enderchest':
                $res = DBVCA::FetchExecute("SELECT `expiry` FROM `luckperms_user_permissions` WHERE `uuid` = '".$_SESSION['uuid']."' AND `permission` = 'nucleus.enderchest.base'");
                if($res){
                    $date_end = date("d.m.Y H:i",($res['expiry']));
                } else {
                    $date_end = false;
                }
                break;

        }
    
        return $date_end;
    }


}