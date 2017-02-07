import { $id, $class } from './util';

var selectSucursal = $id('selectSucursal');

function cambioSucursal(myArr) {
  var telefono = $class('siteHeader-topBar-telefono');
  var correo = $class('siteHeader-topBar-correo');
  var ubicacion = document.querySelector('.siteHeader-topBar-ubicacion a');
  var ubicaurl = document.location.origin + '/sucursales/' + selectSucursal.value + '.html';
  telefono.innerHTML = myArr.telefono;
  correo.innerHTML = myArr.correo;
  ubicacion.setAttribute('href', ubicaurl);
}

function init_selectSucursal() {
  selectSucursal.addEventListener('change', function(evt) {
    // dataLayer.push({'event' : 'sucursalChanged', 'sucursalSlug' : selectSucursal.value});
    var posturl = document.location.origin + '/sucursalData/' + selectSucursal.value + '.json';
    // Set up the AJAX request
    var request = new XMLHttpRequest();
    request.open('GET', posturl, true);
    request.send();
    request.onreadystatechange = function() {
      // 4 = Response from server has been completely loaded.
      if (request.readyState === 4) {
        // 200 - 299 = successful
        if (request.status == 200 && request.status < 300) {
          var myArr = JSON.parse(this.responseText);
          cambioSucursal(myArr);
        }
      }
    };
  });
}

export default init_selectSucursal;