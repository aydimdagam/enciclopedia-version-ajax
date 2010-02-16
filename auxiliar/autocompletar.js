//AUTOCOMPLETADO BUSCAR
var peticion = null;
//
var elementoSeleccionado = -1;
var sugerencias = null;
var cacheSugerencias = {};

Array.prototype.formateaLista = function() {
  var codigoHtml = "";

  codigoHtml = "<ul>";
  for(var i=0; i<this.length; i++) {
	if(i == elementoSeleccionado) {
	  codigoHtml += "<li class=\"seleccionado\">"+this[i]+"</li>";
	}
	else {
	  codigoHtml += "<li>"+this[i]+"</li>";
	}
  }
  codigoHtml += "</ul>";

  return codigoHtml;
};

function autocompleta() {
  var elEvento = arguments[0] || window.event;
  var tecla = elEvento.keyCode;
  //
  if(tecla == 40) { // Flecha Abajo
	if(elementoSeleccionado+1 < sugerencias.length) {
	  elementoSeleccionado++;
	}
	muestraSugerencias();
  }
  else if(tecla == 38) { // Flecha Arriba
	if(elementoSeleccionado > 0) {
	  elementoSeleccionado--;
	}
	muestraSugerencias();
  }
  else if(tecla == 13) { // ENTER o Intro
	seleccionaElemento();
  }
  else {
	var texto = $("buscar").value;
	
	// Si es la tecla de borrado y el texto es vac√≠o, ocultar la lista
	if(tecla == 8 && texto == "") {
	  borraLista();
	  return;
	}
	
	// si se da al escape ocultar la lista porque se le est√°n hinchando los huevos al usuario
	if(tecla == 27) {
	  borraLista();
	  return;
	}
	//
	if(cacheSugerencias[texto] == null)
	{
		new Ajax.Request("auxiliar/autocompletaCriaturas.php?nocache=" + Math.random(), {	//usamos Prototype para llamar a XMLHttpRequest
			method: 'POST',
			requestHeaders:{'Content-Type' : 'application/x-www-form-urlencoded'},
			parameters: 'buscar='+encodeURIComponent(texto),
			onSuccess: cargaSugerencias
			});
	}
	else {	  
	  actualizaSugerencias();
	  sugerencias = cacheSugerencias[texto];
	}
  }
}

function cargaSugerencias(peticion)
{
	if(peticion.readyState == 4) {
	  if(peticion.status == 200) {
		sugerencias = eval('('+peticion.responseText+')');
		if(sugerencias.length == 0)	sinResultados();
		else{		  
		  actualizaSugerencias();
		  cacheSugerencias[texto] = sugerencias;
		}
	  }
	}	
}

function sinResultados() {
  $("sugerencias").innerHTML = "No existen criaturas que empiecen con ese texto";
  $("sugerencias").style.display = "block";
}

function actualizaSugerencias() {
  elementoSeleccionado = -1;
  muestraSugerencias();
}

function seleccionaElemento() {
  if(sugerencias[elementoSeleccionado]) {
	criaturaSeleccionada = sugerencias[elementoSeleccionado];
	borraLista();
	//
	//finalmente llamamos a cargaDatosCriaturaBuscar() que está en el archivo ajax.js
	cargaDatosCriaturaBuscar();
  }
}

function muestraSugerencias() {
  var zonaSugerencias = $("sugerencias");
  zonaSugerencias.innerHTML = sugerencias.formateaLista();
  zonaSugerencias.style.display = 'block';  
}

function borraLista() {
  $("sugerencias").innerHTML = "";
  $("sugerencias").style.display = "none";
}

//Nótese que he tenido que añadir  autocomplete="off" al formulario (form) para que nos despliegue el propio autocompletado 
//que algunos navegadores tienen configurados por defecto (aunque también puede desactivarlo el propio usuario; al menos en safari)