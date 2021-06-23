<?php 
error_reporting(E_ERROR | E_WARNING | E_PARSE);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
ini_set('max_execution_time', 240);
session_set_cookie_params(1080000);
session_start();
define( "CP" , 'http://'.$_SERVER['HTTP_HOST'] );
define( "ROOT" , './');
define( "HTDOCS" , dirname(__FILE__) . '/' );
define( "THEME" , HTDOCS . 'theme/' );
define( "STYLE" , CP . '/theme/src/' ); 
define( "SYSTEM" , ROOT . 'system/' );
define( "SKINS" , ROOT . 'uploads/skins/' );
define( "CLOAKS" , ROOT . 'uploads/cloaks/' );
define( "UNREDIRECTED_CONTROLLERS",	serialize(array('auth', 'error', 'favicon.ico', 'theme', 'uploads')));
define( "RECEIVING_CONTROLLERS", serialize(array('auth')));
include_once( SYSTEM . 'config.php' );
include_once( SYSTEM . 'function.php' );
include_once( SYSTEM . 'PHPMailer.php' );
include_once( SYSTEM . 'SMTP.php' );
include_once( SYSTEM . 'Exception.php' );
include_once( SYSTEM . 'webapi.class.php' );



$curent_page = 1;
$function_name = 'index';
$controller_short = 'index';

$_SESSION['redirect_back'] = $_SERVER['REQUEST_URI'];

spl_autoload_register(function ($class_name) {
    $class_name = strtolower($class_name);
    $line = explode("_" , $class_name);
    $file = SYSTEM . $line[0] . '/' . $line[1] . '.php';

    if (!file_exists($file)){
    	redirect('/error/');
    } else {
    	include $file;
    }
});

$line = explode( "/", $_GET['mode']);
array_shift($line);
$ajax = false;
if ($line[0] == 'ajax') {
	array_shift($line);
	$ajax = true;
}
/*
if(!isset($line[0])){
    redirect('/main/');
}*/

$controller_short = 'main';
if(isset($line[0]) && $line[0] != '') {
    $controller_short = $line[0];
} 
if(in_array($controller_short, unserialize(RECEIVING_CONTROLLERS))){
	$function_name = NULL;
}
if(isset($line[1]) && $line[1] != ''){
    $function_name = $line[1];
}

define("CONTROLLER", $controller_short);
$controller_name = "controller_" . $controller_short;

//if(!model_main::is_autorized()) redirect('/main/');

if(!preg_match('|^[a-z]+$|i', $controller_short)) redirect('/error/');
$controller = new $controller_name();
if ($ajax) {
	$controller->$function_name();
} else {
	if(!$ajax)
		display('header');
        if(in_array($controller_short, unserialize(RECEIVING_CONTROLLERS))){
                if(is_null($function_name)){!method_exists($controller, 'index')?redirect('/error/'):$controller->index();}
                else {!method_exists($controller, 'index')?redirect('/error/'):$controller->index($function_name);}
            } else {
                !method_exists($controller, $function_name)?redirect('/error/'):$controller->$function_name();
            }
	if(!$ajax) 
            display('right');
    if(!$ajax) 
			display('footer');
}
?>