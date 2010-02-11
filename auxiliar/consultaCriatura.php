<?php
//
function consultaCriatura()
{
	//Conectamos a la base de datos
	include("conexion.php");
	$conexion=db_connect();
	//recuperamos el nombre de la criatura a consultar desde el formulario
	$nombreCriatura=$_POST["nombreCriatura"];
	//quitamos los caracteres extra–os del nombre de la criatura (si no falla la consulta)
	//a parte de sustituir los caracteres extra–os debemos decodificar la cadena de UTF-8 a ISO
	//(no sŽ por quŽ ya que la BD est‡ en UTF-8; de hecho para que se muestren bien los caracteres en el editor de
	//Eclipse tambiŽn hay que ponerlo en ISO. Algœn d’a lo entenderŽ...)
	$putosAnglosajones=strtr(utf8_decode($nombreCriatura),"‡Ž’—œçƒêîòŠ‘šŸ€è…†”žëó–„","aeiouAEIOUaeouAEOUiuIUnN");	//sin acentos hace la consulta igual...
	//realizamos la consulta para conseguir los datos de la CRIATURA
	$consultaCriatura=mysql_query("SELECT nombre, intro, descripcion, notas, id_familia, restriccion FROM criaturas WHERE nombre='".$putosAnglosajones."'", $conexion);	
	
	return $consultaCriatura;
}
?>