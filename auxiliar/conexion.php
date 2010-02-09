<?php
//conecta a la BD
function db_connect()
{
	$server="localhost";
	$usuario="enciclop_aydim";
	$password="4yd1md4g4m";
	$base_datos="enciclop_criaturas";
	//$base_datos="enciclop_criaturasajax";	//para producci&oacute;n
	$result = mysql_connect($server, $usuario, $password)  or die(mysql_error()); 
	if (!$result) return false;
	if (!mysql_select_db($base_datos)) return false;
	//
	return $result;
}

?>