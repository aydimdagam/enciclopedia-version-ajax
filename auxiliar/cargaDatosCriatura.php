<?php
//
if (isset($_POST["numAleatorio"]))
{
	include("consultaAleatoria.php");
	$consultaCriatura=consultaAleatoria();
}
else if (isset($_POST["nombreCriatura"]))
{
	include("consultaCriatura.php");
	$consultaCriatura=consultaCriatura();
}
//
//llamamos a la funci�nd e conexi�n a la BD pues a�n nos queda realizar otra conexi�n
//(la conexi�n est� incluida en uno de los dos ficheros .php anteriorees que se cargan)
$conexion=db_connect();
//
$resultadoDatosCriatura=mysql_fetch_array($consultaCriatura);

//recogemos el campo id_familia que lo necesitaremos para otra consulta
$id_familia=$resultadoDatosCriatura["id_familia"];
//consultamos la gama de colores de la familia de criaturas gracias al campo anterior
$consultaColoresCriatura=mysql_query("SELECT distinct familias.gama_colores FROM familias INNER JOIN criaturas ON familias.id_familia=".$id_familia."", $conexion);

$resultadoColoresCriatura=mysql_fetch_array($consultaColoresCriatura);

//el campo tiene los cuatro colores juntos, as� que pasamos a separarlos y meterlos en un array
$gamaColores=$resultadoColoresCriatura["gama_colores"];
$gamaColoresCriatura=explode(',',$gamaColores);

foreach($resultadoDatosCriatura as $codigo => $nombre)
{
	//repite los valores (siendo el c�digo un �ndice y el nombre; no s� por qu� lo del �ndice).
	//en cualquier caso s�lo nos interesan los que no son num�ricos (nombre)
	if (!is_numeric($codigo))
	{
		//print_r($codigo."<br />");
		if ($codigo=="id_familia")
		{
			for($i=0;$i<count($gamaColoresCriatura);$i++)
			{
				$elementos_json[] = "\"color$i\": \"$gamaColoresCriatura[$i]\"";
			}			
		}
		else
		{
			if ($codigo=="intro")
			{
				//la referencia del intro debe ir en otra l�nea y en negrita
				$nombre=str_replace(".De ",".<br /><br /><strong>De ",$nombre);
				$nombre=str_replace("Mario Palomino Gordon","Aydim Dagam",$nombre);
			}
			//cuando el campo de la BD est� vac�o pondremos 'en construcci�n'
			//if ($nombre==null && !="restriccion")	$nombre="<i>Referencia en construcci&oacute;n. Perdonen las molestias</i>.";
			$elementos_json[] = "\"$codigo\": \"$nombre\"";
		}
	}
}

$criatura_json = "{".implode(",", $elementos_json)."}";

echo utf8_encode($criatura_json);

?>