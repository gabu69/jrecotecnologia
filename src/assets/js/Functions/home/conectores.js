import { $id, $class } from '../../util';

// Basado en https://gist.github.com/alojzije/11127839

// Funciones auxiliares

function signum(x) {
  return (x < 0) ? -1 : 1;
}

function absolute(x) {
  return (x < 0) ? -x : x;
}

// Para evitar JQuery
function isWindow(obj) {
  return obj != null && obj === obj.window;
}

function getWindow(elem) {
  return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
}

function offset(elem) {

  var docElem, win,
    box = {
      top: 0,
      left: 0
    },
    doc = elem && elem.ownerDocument;

  docElem = doc.documentElement;

  if (typeof elem.getBoundingClientRect !== typeof undefined) {
    box = elem.getBoundingClientRect();
  }
  win = getWindow(doc);
  return {
    top: box.top + win.pageYOffset - docElem.clientTop,
    left: box.left + win.pageXOffset - docElem.clientLeft
  };
}

// ¡Dibujar!
function dibujaConector(svg, path, startX, startY, endX, endY) {
  // obtener el ancho de linea
  var stroke = parseFloat(path.getAttribute("stroke-width"));
  // revisar dimensiones (No es necesario en este caso)
  //if (svg.getAttribute("height") < endY) svg.getAttribute("height", endY);
  //if (svg.getAttribute("width") < (startX + stroke)) svg.getAttribute("width", (startX + stroke));
  //if (svg.getAttribute("width") < (endX + stroke)) svg.getAttribute("width", (endX + stroke));

  var deltaX = (endX - startX) * 0.15;
  var deltaY = (endY - startY) * 0.15;
  // Tomar la distancia más corta como Delta
  var delta = deltaY < absolute(deltaX) ? deltaY : absolute(deltaX);

  // Establecer dirección del arco (contra/reloj)
  var arc1 = 0;
  var arc2 = 1;
  if (startX > endX) {
    arc1 = 1;
    arc2 = 0;
  }
  // Dibujar la línea
  // 1. hacia abajo, 2. arco,  3. a un lado, 4.arco, 5. hacia abajo 
  path.setAttribute("d", "M" + startX + " " + startY +
    " V" + (startY + delta) +
    " A" + delta + " " + delta + " 0 0 " + arc1 + " " + (startX + delta * signum(deltaX)) + " " + (startY + 2 * delta) +
    " H" + (endX - delta * signum(deltaX)) +
    " A" + delta + " " + delta + " 0 0 " + arc2 + " " + endX + " " + (startY + 3 * delta) +
    " V" + endY);
}

function conectaElementos(svg, path, startElem, endElem, porX, porY) {
  var svgContainer = $id("svgConectores");
  
  // Poner como inicial al que esté más alto
  if (offset(startElem).top > (offset(endElem).top + porY * endElem.offsetHeight)) {
    //var temp = $id(startElem.id);
    //startElem = endElem;
    //endElem = temp;
    endElem = [startElem, startElem = endElem][0];
  }
  
  // Obtener coordenadas del contenedor
  var svgTop = offset(svgContainer).top;
  var svgLeft = offset(svgContainer).left;
  
  // Obtener coordenadas de ambos elementos
  var startCoord = offset(startElem);
  var endCoord = offset(endElem);

  // Calcular coordenadas del inicio
  var startX = startCoord.left + 0.5 * startElem.offsetWidth - svgLeft;
  var startY = startCoord.top + startElem.offsetHeight - svgTop;

  // Calcular coordenadas del final
  var endX = endCoord.left + porX * endElem.offsetWidth - svgLeft;
  var endY = endCoord.top + porY * endElem.offsetHeight - svgTop;

  // ¡dibujar!
  dibujaConector(svg, path, startX, startY, endX, endY);
}

function connectAll() {
  var svg01 = $id("svg01");
  
  if ((svg01 != null) & window.matchMedia("(min-width: 520px)").matches) {
    var planetaCiudad = $id("planeta-ciudad");
    
    conectaElementos(svg01, $id("path01"), $id("svgEnergia"), planetaCiudad, 0.4045, 0.3560);
    conectaElementos(svg01, $id("path02"), $id("svgCalentador"), planetaCiudad, 0.5892, 0.3102);
    conectaElementos(svg01, $id("path03"), $id("svgBlanca"), planetaCiudad, 0.2902, 0.3899);
    conectaElementos(svg01, $id("path04"), $id("svgAire"), planetaCiudad, 0.3517, 0.4516);
    conectaElementos(svg01, $id("path05"), $id("svgImper"), planetaCiudad, 0.6578, 0.3747);
    conectaElementos(svg01, $id("path06"), $id("svgLed"), planetaCiudad, 0.1953, 0.3809);
    conectaElementos(svg01, $id("path07"), $id("svgAgua"), planetaCiudad, 0.7457, 0.4251);
  }
}

export default connectAll;