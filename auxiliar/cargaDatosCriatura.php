<?php
//Conectamos a la base de datos
include("conexion.php");
$conexion=db_connect();

//recuperamos el nombre de la criatura a consultar desde el formulario
$nombreCriatura=$_POST["nombreCriatura"];

//quitamos los caracteres extra�os del nombre de la criatura (si no falla la consulta)
//a parte de sustituir los caracteres extra�os debemos decodificar la cadena de UTF-8 a ISO
//(no s� por qu� ya que la BD est� en UTF-8)
$putosAnglosajones=strtr(utf8_decode($nombreCriatura),"������������������������","aeiouAEIOUaeouAEOUiuIUnN");	//sin acentos hace la consulta igual...

//realizamos la consulta para conseguir los datos de la CRIATURA
$consultaDatosCriatura=mysql_query("SELECT nombre, intro, descripcion, notas, id_familia, restriccion FROM criaturas WHERE nombre='".$putosAnglosajones."'", $conexion);

$resultadoDatosCriatura=mysql_fetch_array($consultaDatosCriatura);

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