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
	  
      lista.options[0] = new Option("- selecciona un Tipo de criaturas -");
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
      lista.options[0] = new Option("- selecciona una criatura -");
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
//función para sustituir caracter extraños
//para utilizar el nombre de la criatura directamente desde el campo de la base de datos
//pero hay que cambiar los caracteres extraños (espacios, ñ, acentos, etc) para que coincida con 
//el nombre de la imagen (ya que las imágenes en Internet no pueden tener caracteres extraños)
//
//primero creamos el array de pares valor a sustituir por valor de sustitución ('á' : 'a') pero codificados en utf-8 (es decir, que hay que poner su valor Unicode)
CharsTranslation = {'\u00e1' : 'a','\u00e9' : 'e','\u00ed' : 'i', '\u00f3' : 'o', '\u00fa' : 'u', '\u00c1' : 'A', '\u00c9' : 'E', '\u00cd' : 'I', '\u00d3' : 'O', '\u00da' : 'U', '\u00f1' : 'n', '\u00d1' : 'N', '\u00E4' : 'a',  '\u00EB' : 'e', '\u00EF' : 'i', '\u00F6' : 'o', '\u00FC' : 'u', '\u00EE' : 'i', '\u00FB' : 'u', ' ': '-'};


function strtr(str, list)
{
  for(var c in list) {
    str = String(str).replace(new RegExp(c, "g"), list[c]);
  }
 //
  return str;
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
						document.getElementById("imagen").innerHTML="<img width=\"300\" height=\"300\" border=\"0\" src=\"imagenes/"+imagen.toLowerCase()+".jpg\" />";
						document.getElementById(nombre).innerHTML=datosCriatura[nombre];
						break
					case "intro":
					case "descripcion":					
					case "notas":					
						document.getElementById(nombre).innerHTML=datosCriatura[nombre];						
						break;					
					case "color0":
					case "color1":
					case "color2":
						break;
					case "color3":					
						//color0: gama-color más oscuro de la gama (Hex); color1: nombre color base; 
						//color2: color intermedio de la gama (Hex), color3: color más claro de la gama
						document.body.style.background=datosCriatura.color1;
						document.getElementById("dcha").style.background="#"+datosCriatura.color2;
						document.getElementById("imagen").style.background="#"+datosCriatura.color0;
						document.getElementById("imagen").style.opacity=0.7;
						document.body.style.color="#"+datosCriatura.color1;
						document.getElementById("nombre").style.color=datosCriatura.color1;		
						document.getElementById("izda").style.color="#"+datosCriatura.color2;
						document.getElementById("intro").style.color="#"+datosCriatura.color0;
						//
						//
						var flashvars = {color: "0x"+datosCriatura.color2};
						var params = {menu: "false", wmode: "transparent" };
						swfobject.embedSWF("auxiliar/bso.swf", "bso", "360", "330", 
									   "9.0.0","", flashvars, params);
						break;
					case "restriccion":
						var valorRestriccion=parseInt(datosCriatura[nombre]);
						//if (datosCriatura[nombre]==null)	valorRestriccion=4;
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
	  peticion.open("POST", "auxiliar/criaturaAleatoria.php?nocache=" + Math.random(), true);
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
	var params = {menu: "false", wmode: "transparent"};
	swfobject.embedSWF("auxiliar/bso.swf", "bso", "360", "330", "9.0.0","", params);
}