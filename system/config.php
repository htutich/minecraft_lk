<?php
class DBVCA{

	static $shost = ""; // IP базы
	static $suser = ""; // Пользователь базы
	static $spass = ""; // Пароль пользователя
	static $sname = ""; // Имя базы

	// Подключение к базе сайта
		static function WebDBconnect(){
			$conn = new mysqli(DBVCA::$shost, DBVCA::$suser, DBVCA::$spass, DBVCA::$sname);
			if (mysqli_connect_errno()) {
				printf("Не удалось подключиться: %s\n", mysqli_connect_error());
				exit();
			}
			$conn->query("SET NAMES 'utf8");
			$conn->query("SET CHARACTER SET 'utf8'");
			$conn->query("SET SESSION collation_connection = 'utf8_general_ci'");
			return $conn;
		}

		/*** WEB БД ***/
	// Отправка запроса на исполнение(сайт) с получением ассоциативного массива
		static function FetchExecute($query){
			$DBMysqliConnect = self::WebDBconnect();
			$res = $DBMysqliConnect->query($query);
			$res_array = false;
			if ($res) {
				$res_array = $res->fetch_assoc();
			}
			return $res_array;
		}
	// Отправка запроса на исполнение(сайт) БЕЗ получения ассоциативного массива
		static function Execute($query){
			$DBMysqliConnect = self::WebDBconnect();
			$res = $DBMysqliConnect->query($query);
			return $res;
		}
}

