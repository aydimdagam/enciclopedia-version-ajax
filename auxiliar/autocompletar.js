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
	var texto = document.getElementById("buscar").value;
	
	// Si es la tecla de borrado y el texto es vacío, ocultar la lista
	if(tecla == 8 && texto == "") {
	  borraLista();
	  return;
	}
	
	// si se da al escape ocultar la lista porque se le están hinchando los huevos al usuario
	if(tecla == 27) {
	  borraLista();
	  return;
	}	
	
	if(cacheSugerencias[texto] == null) {
	  peticion = inicializa_xhr();
	  
	  peticion.onreadystatechange = function() { 
		if(peticion.readyState == 4) {
		  if(peticion.status == 200) {
			sugerencias = eval('('+peticion.responseText+')');
			if(sugerencias.length == 0) {
			  sinResultados();
			}
			else {
			  cacheSugerencias[texto] = sugerencias;
			  actualizaSugerencias();
			}
		  }
		}
	  };
	  
	  peticion.open('POST', 'auxiliar/autocompletaCriaturas.php?nocache='+Math.random(), true);
	  peticion.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	  peticion.send('buscar='+encodeURIComponent(texto));
	}
	else {
	  sugerencias = cacheSugerencias[texto];
	  actualizaSugerencias();
	}
  }
}

function sinResultados() {
  document.getElementById("sugerencias").innerHTML = "No existen criaturas que empiecen con ese texto";
  document.getElementById("sugerencias").style.display = "block";
}

function actualizaSugerencias() {
  elementoSeleccionado = -1;
  muestraSugerencias();
}

function seleccionaElemento() {
  if(sugerencias[elementoSeleccionado]) {
	document.getElementById("buscar").value = sugerencias[elementoSeleccionado];
	borraLista();
	//
	cargaDatosCriaturaBuscar();
  }
}

function muestraSugerencias() {
  var zonaSugerencias = document.getElementById("sugerencias");
  
  zonaSugerencias.innerHTML = sugerencias.formateaLista();
  zonaSugerencias.style.display = 'block';  
}

function borraLista() {
  document.getElementById("sugerencias").innerHTML = "";
  document.getElementById("sugerencias").style.display = "none";
}