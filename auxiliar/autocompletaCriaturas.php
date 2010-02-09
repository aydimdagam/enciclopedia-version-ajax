<?php
include('conexion.php');
$conexion=db_connect();

$texto = strtolower(trim($_POST["buscar"]));

//hay que consultar las  criaturas que empiezan con ese texto
$consulta=mysql_query("SELECT nombre FROM criaturas", $conexion);
$num_resultados=mysql_num_rows($consulta);

$sugerencias = array();
for($i=1;$i<$num_resultados+1;$i++)
{
	$resultado=mysql_fetch_array($consulta);
	$nombre=utf8_encode($resultado["nombre"]);
	//
	if(preg_match('/^('.$texto.')/i',$nombre))
	{
		$sugerencias[] = $nombre;
		if(count($sugerencias)>20) { break; }
	}	
}

if(isset($_GET["modo"]) && $_GET["modo"] != null) {
	$modo = $_GET["modo"];
}
else {
	$modo = "json";
}

if($modo == "ul") {
	if(count($sugerencias)>0) {
	  echo "<ul>\n<li>";
	  echo implode($sugerencias, "</li>\n<li>");
	  echo "</li>\n</ul>";
	}
	else {
	  echo "<ul></ul>";
	}
}
else {
	if(count($sugerencias)>0) {
	  echo "[ \"";
	  echo implode($sugerencias, "\", \"");
	  echo "\"]";
	}
	else {
	  echo "[]";
	}
}
?>