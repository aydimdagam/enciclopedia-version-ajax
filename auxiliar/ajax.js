//
//inicializamos el objeto XMLHttpRequest
var peticion = null;
//
function inicializa_xhr() {
  if (window.XMLHttpRequest) {
    return new XMLHttpRequest(); 
  } else if (window.ActiveXObject) {
    return new ActiveXObject("Microsoft.XMLHTTP"); 
  } 
}

//
//Mostramos los Tipos de Criaturas
function muestraFamilias() {
  if (peticion.readyState == 4) {
    if (peticion.status == 200) {
      var lista = document.getElementById("familia");
	  //var familias = eval('(' + peticion.responseText + ')');
		var oJSON=peticion.responseText;
		var familias=JSON.parse(oJSON);
	  
      lista.options[0] = new Option("- Tipo de criaturas -");
      var i=1;
      for(var codigo in familias) {
        lista.options[i] = new Option(familias[codigo], codigo);
        i++;
      }
    }
  }
}

//cargamos las Criaturas
function cargaCriaturas() {
  var lista = document.getElementById("familia");
  var familia = lista.options[lista.selectedIndex].value;
  if(!isNaN(familia)) 
  {
    peticion = inicializa_xhr();
    if (peticion) 
	{
      peticion.onreadystatechange = muestraCriaturas;
      peticion.open("POST", "auxiliar/cargaCriaturas.php?nocache=" + Math.random(), true);
      peticion.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      peticion.send("familia=" + familia);
    }
  }
}

//Mostramos las Criaturas
function muestraCriaturas() {
  if (peticion.readyState == 4) {
    if (peticion.status == 200) {
      var lista = document.getElementById("criatura");
	  //var criaturas = eval('(' + peticion.responseText + ')');
		var oJSON=peticion.responseText;
		var criaturas =JSON.parse(oJSON);
		
	  lista.options.length = 0;
      lista.options[0] = new Option("- Criatura -");
      var i=1;
      for(var codigo in criaturas) {
        lista.options[i] = new Option(criaturas[codigo], codigo);
        i++;
      }
    }
  }
}


//
//cargamos los datos de la Criatura elegida desde la lista
function cargaDatosCriatura() {
	var lista = document.getElementById("criatura");
	var nombreCriatura = lista.options[lista.selectedIndex].text;
	//
	peticion = inicializa_xhr();
	if (peticion) 
	{
	  peticion.onreadystatechange = muestraDatosCriatura;
	  peticion.open("POST", "auxiliar/cargaDatosCriatura.php?nocache=" + Math.random(), true);
	  peticion.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	  peticion.send("nombreCriatura=" + nombreCriatura);
	}
}

//cargamos los datos de la Criatura elegida desde BUSCAR
function cargaDatosCriaturaBuscar() {
	var nombreCriatura = document.getElementById("buscar").value;
	//
	peticion = inicializa_xhr();
	if (peticion) 
	{
	  peticion.onreadystatechange = muestraDatosCriatura;
	  peticion.open("POST", "auxiliar/cargaDatosCriatura.php?nocache=" + Math.random(), true);
	  peticion.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	  peticion.send("nombreCriatura=" + nombreCriatura);
	}
}

//
function getElementsByClassName(oElm, strTagName, strClassName){
	var arrElements = (strTagName == "*" && oElm.all)? oElm.all : oElm.getElementsByTagName(strTagName);
	var arrReturnElements = new Array();
	strClassName = strClassName.replace(/\-/g, "\\-");
	var oRegExp = new RegExp("(^|\\s)" + strClassName + "(\\s|$)");
	var oElement;
	for(var i=0; i<arrElements.length; i++){
		oElement = arrElements[i];
		if(oRegExp.test(oElement.className)){
			arrReturnElements.push(oElement);
		}
	}
	return (arrReturnElements)
}

//
//
//SUSTITUCIÓN DE CARACTERES EXTRAÑOS
//para poder reutilizar el nombre de la criatura sacado del campo análogo de la base de datos para que coincida con el nombre 
//de la imagen hay que cambiar los caracteres extraños (espacios, ñ, acentos, etc), ya que las imágenes en Internet 
//no pueden tener caracteres extraños
//
//primero creamos el array de pares valor a sustituir por valor de sustitución ('á' : 'a') pero codificados en utf-8 
//(es decir, que hay que poner su valor Unicode): á-Á-ä-Ä-î
var CharsTranslation = {'\u00e1' : 'a','\u00e9' : 'e','\u00ed' : 'i', '\u00f3' : 'o', '\u00fa' : 'u', 
						'\u00c1' : 'A', '\u00c9' : 'E', '\u00cd' : 'I', '\u00d3' : 'O', '\u00da' : 'U', 
						'\u00E4' : 'a', '\u00EB' : 'e', '\u00EF' : 'i', '\u00F6' : 'o', '\u00FC' : 'u',
						'\u00C4' : 'A', '\u00CB' : 'E', '\u00CF' : 'I', '\u00D6' : 'O', '\u00CC' : 'U',
						'\u00EE' : 'i', '\u00FB' : 'u', '\u00CE' : 'I', '\u00DB' : 'U', '\u00f1' : 'n', '\u00d1' : 'N', ' ': '-'};
//
//función para sustituir caracter extraños en una cadena
function strtr(str, list)
{
  for(var c in list) {
    str = String(str).replace(new RegExp(c, "g"), list[c]);
  }
 //
  return str;
}

//
//función para aplicar colores (estilos CSS) a cada criatura
//se le pasa la gama de colroes de cada familia de criaturas (extraido de la BD)
function aplicarColoresCriatura(color0, color1, color2)
{
	document.body.style.background=color1;							//fondo: color base
	document.getElementById("dcha").style.background=color2;		//izquierda: color claro
	document.getElementById("dcha").style.color=color1;				//derecha: color base	
	document.getElementById("imagen").style.background=color0;		//imagen: color oscuro
	document.getElementById("imagen").style.opacity=0.7;			//imagen: opacidad
	document.getElementById("nombre").style.color=color1;			//el nombre: color base	
	document.getElementById("izda").style.color=color2;				//izquierda: color claro
	document.getElementById("aleatoria").style.color=color2;		//aleatoria: color claro
	document.getElementById("intro").style.color=color0;			//intro: color oscuro
	//
	var enlaces=document.getElementsByTagName("a");
	for(var i=0;i<enlaces.length;i++)
	{
		enlaces[i].style.textDecoration="none";
		enlaces[i].style.color=color2;
		//enlaces[i].style.color=color0;		//pendiente del rollover
	}
	//
	var etiquetas=document.getElementsByTagName("label");
	for(var i=0;i<etiquetas.length;i++)
	{
		etiquetas[i].style.color=color2;
	}
	//
	var listas=document.getElementsByTagName("select");
	for(var i=0;i<listas.length;i++)
	{
		
		listas[i].style.borderColor=color2;
	}
	//
	document.getElementsByTagName("input")[0].style.borderColor=color2;
	//color para el título principal de la página: Enciclopedia de Criaturas
	document.getElementsByTagName("h1")[0].style.color=color2;
}
 
//mostramos los datos de la criatura elegida
function muestraDatosCriatura()
{	
	if (peticion.readyState == 4) {
		if (peticion.status == 200) 
		{
			var oJSON=peticion.responseText;			
			var datosCriatura=JSON.parse(oJSON);
			//
			var i=1;
			for(var nombre in datosCriatura)	//notación JSON: pares {"parametro": "valor"}
			{
				//alert(nombre+":  "+datosCriatura[nombre]);
				//
				switch(nombre)
				{
					case "nombre":						
						var imagen=strtr(datosCriatura[nombre], CharsTranslation);						
						document.getElementById("imagen").innerHTML="<a href=\"imagenes/"+imagen.toLowerCase()+".jpg\" target=\"_blank\"><img width=\"300\" height=\"300\" border=\"0\" src=\"imagenes/"+imagen.toLowerCase()+".jpg\" /></a>";
						document.getElementById(nombre).innerHTML=datosCriatura[nombre];
						break
					case "intro":
					case "descripcion":					
					case "notas":					
						document.getElementById(nombre).innerHTML=datosCriatura[nombre];						
						break;					
					case "color0":
					case "color1":
						break;						
					case "color2":
						//aplicamos los colores (mediante estilos CSS)
						aplicarColoresCriatura("#"+datosCriatura.color0, datosCriatura.color1, "#"+datosCriatura.color2);
						//
						var flashvars = {color: "0x"+datosCriatura.color2};
						var params = {menu: "false", wmode: "transparent" };
						swfobject.embedSWF("auxiliar/bso.swf", "bso", "360", "330", "9.0.0","", flashvars, params);
						break;
					case "restriccion":
						var valorRestriccion=parseInt(datosCriatura[nombre]);
						var lista="<ul>\n";
						for(var j=0; j<10; j++) 
						{
							if(j < valorRestriccion) 
							{
							  lista +="<li class=\"lleno\"></li>\n";
							}
							else {
							  lista +="<li class=\"vacio\"></li>\n";
							}
						}
						lista +="</ul>\n";
						//
						document.getElementById(nombre).innerHTML=lista;
						//
						var claseLleno=getElementsByClassName(document.getElementById(nombre), "li", "lleno");
						var claseVacio=getElementsByClassName(document.getElementById(nombre), "li", "vacio");
						for(var k=0; k<claseLleno.length; k++) 
						{
							claseLleno[k].style.background=datosCriatura.color1;
						}
						for(var c=0; c<claseVacio.length; c++) 
						{
							claseVacio[c].style.background=datosCriatura.color1;
							claseVacio[c].style.opacity=0.3;
						}
						break;						
					default:
						//
						break;						
				}
				//
				i++;			
			}	
		}
	}
}
//
//
//cargamos los datos de la Criatura aleatoria elegida desde el enlace
function cargarCriaturaAleatoria() {
	//consulta el numero de campos de la BD
	//generamos un valor aleatorio de 0 al valor de campos y se lo paamos y que busquye por id
	var numAleatorio=Math.floor(Math.random()*150);
	//
	peticion = inicializa_xhr();
	if (peticion) 
	{
	  peticion.onreadystatechange = muestraDatosCriatura;
	  peticion.open("POST", "auxiliar/cargaDatosCriatura.php?nocache=" + Math.random(), true);
	  peticion.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	  peticion.send("numAleatorio=" + numAleatorio);
	}
}

//Nos aseguramos que se ha caregado el DOM para gestionar los eventos y cargar los datos
window.onload = function() 
{
	//Cargamos las Familias de criaturas en la Lista
	peticion = inicializa_xhr();	//esta primera petición AJAX no depende del usuario
	//
	if(peticion)
	{
		peticion.onreadystatechange = muestraFamilias;
		peticion.open("GET", "auxiliar/cargaFamilias.php?nocache="+Math.random(), true);
		peticion.send(null);
	}
	//Y preparamos los manejadores de eventos para la selección de familias y criaturas
	document.getElementById("familia").onchange = cargaCriaturas;
	document.getElementById("criatura").onchange = cargaDatosCriatura;
	//
	//
	//borramos el input de buscar
	document.getElementById("buscar").value="";
	//preparamos el AUTOCOMPLETADO de Buscar criatura
	// Crear elemento de tipo <div> para mostrar las sugerencias del servidor
	var elDiv = document.createElement("div");
	elDiv.id = "sugerencias";
	//para que inserte las sugerencias antes que otros divs
	document.getElementById("diosguarro").appendChild(elDiv);
	//Y preparamos los manejadores de eventos para las sugerencias en la búsqueda de criaturas
	document.getElementById("buscar").onkeyup = autocompleta;
	//
	//
	var enlaceCriaturaAleatoria=document.getElementById("aleatoria");
	enlaceCriaturaAleatoria.style.cursor="pointer";
	enlaceCriaturaAleatoria.style.cursor="hand";
	enlaceCriaturaAleatoria.onclick=cargarCriaturaAleatoria;
	//
	//
	var flashvars = {color: "0xFEBF91"};
	var params = {menu: "false", wmode: "transparent"};
	swfobject.embedSWF("auxiliar/bso.swf", "bso", "360", "330", "9.0.0","", flashvars, params);
	//
	//document.getElementById('dcha').style.minHeight="580px";
}