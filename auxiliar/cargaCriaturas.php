<?php
include('conexion.php');
$conexion=db_connect();

$familia=$_POST["familia"];

$consulta=mysql_query("SELECT nombre FROM criaturas WHERE id_familia='".$familia."'", $conexion);

$num_resultados=mysql_num_rows($consulta);

for($i=1;$i<$num_resultados+1;$i++)
{
	$resultado=mysql_fetch_array($consulta);
	$nombre=utf8_encode($resultado["nombre"]);
	$criatura=ucfirst($nombre);
	$elementos_json[] = "\"$i\": \"$criatura\"";
}

echo "{".implode(",", $elementos_json)."}";

?>