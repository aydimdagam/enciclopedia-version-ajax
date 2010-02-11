<?php
//
function consultaAleatoria()
{
	//Conectamos a la base de datos
	include("conexion.php");
	$conexion=db_connect();
	//recuperamos el dato para acceder a la criatura
	//en este caso un nœmero generado aleatoriamente que coincidir‡ con uno de los ids de la tabla criaturas
	$numAleatorio=$_POST["numAleatorio"];
	//realizamos la consulta para conseguir los datos de la CRIATURA
	$consultaCriatura=mysql_query("SELECT nombre, intro, descripcion, notas, id_familia, restriccion FROM criaturas WHERE id='".(int)$numAleatorio."'", $conexion);

	return $consultaCriatura;
}
?>