import isMobile from 'ismobilejs';
import { $id, $class } from '../../util';

function regresarPosicion(_event) {
  if (_event.propertyName == 'opacity') {
    var hermano = this.className.baseVal.replace(' sucursal-', '').replace('suc', '');
    var nextSibling = this.parentNode.querySelectorAll('.sucursal-' + (Number(hermano) + 1))[0];
    this.parentNode.insertBefore(this, nextSibling);
  }
}

function animarMarcadores() {
  var square = $class('suc', true);
  
  for (var i = 0; i < square.length; i++) {
    square[i].onmouseenter = function(event) {
      this.removeEventListener("transitionend", regresarPosicion(event), false);
      this.parentNode.appendChild(this);
      var el_texto = $id("t_" + this.id).getComputedTextLength();
      var circulos = this.querySelectorAll('.circulo1, .circulo2');
      circulos[0].style.transform = 'translateX(' + (Number(el_texto) - 13.7) + 'px)';
      circulos[1].style.transform = 'translateX(' + (Number(el_texto) - 13.7) + 'px)';
      var rectangulos = this.querySelectorAll('.rect1, .rect2');
      rectangulos[0].style.transform = 'scaleX(' + (Number(el_texto) - 13.7) / 2 + ')';
      rectangulos[1].style.transform = 'scaleX(' + (Number(el_texto) - 13.7) / 2 + ')';
      var texto = this.querySelector('text');
      texto.style.visibility = 'visible';
      texto.style.opacity = 1;
      texto.style.transitionDelay = '0';
    };
    square[i].onmouseleave = function(event) {
      var circulos = this.querySelectorAll('.circulo1, .circulo2');
      circulos[0].style.transform = 'translateX(0px)';
      circulos[1].style.transform = 'translateX(0px)';
      var rectangulos = this.querySelectorAll('.rect1, .rect2');
      rectangulos[0].style.transform = 'scaleX(1)';
      rectangulos[1].style.transform = 'scaleX(1)';
      var texto = this.querySelector('text');
      texto.style.visibility = 'hidden';
      texto.style.opacity = 0;
      texto.style.transitionDelay = '0.2s';
        this.addEventListener("transitionend", regresarPosicion(event), false);
    };
    square[i].getElementsByTagName('a')[0].setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', document.location.origin + '/sucursales/' + square[i].getElementsByTagName('a')[0].attributes[0].nodeValue + '.html');
  }
}

export default function() {
  var ajax = new XMLHttpRequest();
  ajax.open("GET", "/assets/img/svg/mapaSucursales.svg", true);
  ajax.send();
  ajax.onload = function(e) {
  
    var div = document.createElement("div");
    div.innerHTML = ajax.responseText;
    $id('mapaSucursales').appendChild(div);
  
    if (!isMobile.any) animarMarcadores();
  };
}
