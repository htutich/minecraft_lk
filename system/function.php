<?php
function display($view_name, $data = NULL){
    include(THEME . $view_name . '.php');
}

function redirect($data, $force=false){
    global $controller_short;
    global $function_name;
    $path = explode('/' , $data);
    if(!isset($path[2]) || ($path[2] == '')) {
        $path[2] = 'index';    
    }    
    if($path[1] == $controller_short && $path[2] == $function_name && !$force) {
        return;
    }
    //var_dump($controller_short, $function_name, $path);
    if (!in_array($controller_short, unserialize(UNREDIRECTED_CONTROLLERS))) {
        $_SESSION['redirect'] = $_SERVER['REQUEST_URI'];
    }
    //header('Location: '.CP.$data,true, 301);
    echo "<script> window.location.href = '".CP.$data."'; </script>";
    exit();
}
function email_send($e_mail, $subj, $message,$attach=null)
{
    $mail = new PHPMailer\PHPMailer\PHPMailer;
    $mail->isSMTP();
    $mail->Host = 'smtp.mail.ru';
    $mail->SMTPAuth = true;
    $mail->CharSet = 'utf-8';
    $mail->Username = 'no-reply@solmx.ru';
    $mail->Password = '';
    $mail->From = 'no-reply@solmx.ru';
    $mail->FromName = "Solmics";
    $mail->addAddress($e_mail, '');
    $mail->Subject = $subj;
    $mail->Body = $message;
    $mail->isHTML(true);
    $mail->SMTPSecure = false;
    $mail->SMTPAutoTLS = true;
    if($attach!=null)
        foreach ($attach as $key => $value) {
            $mail->AddAttachment($value);
        }
        
    if(!$mail->send())
    {
        $error = 'Message could not be sent. Error: ' . $mail->ErrorInfo;
        return false;
    }
    
    return true;
}


function logintouuid($string){
    $string = "OfflinePlayer:".$string;
    $val = md5($string, true);
    $byte = array_values(unpack('C16', $val));

    $tLo = ($byte[0] << 24) | ($byte[1] << 16) | ($byte[2] << 8) | $byte[3];
    $tMi = ($byte[4] << 8) | $byte[5];
    $tHi = ($byte[6] << 8) | $byte[7];
    $csLo = $byte[9];
    $csHi = $byte[8] & 0x3f | (1 << 7);

    if (pack('L', 0x6162797A) == pack('N', 0x6162797A)) {
        $tLo = (($tLo & 0x000000ff) << 24) | (($tLo & 0x0000ff00) << 8) | (($tLo & 0x00ff0000) >> 8) | (($tLo & 0xff000000) >> 24);
        $tMi = (($tMi & 0x00ff) << 8) | (($tMi & 0xff00) >> 8);
        $tHi = (($tHi & 0x00ff) << 8) | (($tHi & 0xff00) >> 8);
    }

    $tHi &= 0x0fff;
    $tHi |= (3 << 12);

    $uuid = sprintf(
        '%08x-%04x-%04x-%02x%02x-%02x%02x%02x%02x%02x%02x',
        $tLo, $tMi, $tHi, $csHi, $csLo,
        $byte[10], $byte[11], $byte[12], $byte[13], $byte[14], $byte[15]
    );
    return $uuid;
}

function checkCapcha($response){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL,"https://www.google.com/recaptcha/api/siteverify");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, "secret=6LcQB34UAAAAAEpwP2RctCzTJ1ohiIpckezgtCRX&response=".$response);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $server_output = curl_exec($ch);
    curl_close ($ch);
    return $server_output;
}


function randomPassword() {
    $alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    $pass = array(); //remember to declare $pass as an array
    $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
    for ($i = 0; $i < 8; $i++) {
        $n = rand(0, $alphaLength);
        $pass[] = $alphabet[$n];
    }
    return implode($pass); //turn the array into a string
}