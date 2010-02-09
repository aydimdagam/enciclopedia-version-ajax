<?php
include("conexion.php");
$conexion=db_connect();

$consultaFamilia=mysql_query("SELECT familia FROM familias", $conexion);

$num_resultados=mysql_num_rows($consultaFamilia);

for($i=1;$i<$num_resultados+1;$i++)
{
	$resultadoFamilia=mysql_fetch_array($consultaFamilia);
	$familia=utf8_encode($resultadoFamilia["familia"]);
	$elementos_json[] = "\"$i\": \"$familia\"";
}

echo "{".implode(",", $elementos_json)."}";

?>
