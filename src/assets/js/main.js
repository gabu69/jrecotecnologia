import lazyLoad from 'lazysizes';
import svg4everybody from 'svg4everybody';
import isMobile from 'ismobilejs';
import { DOMUtil } from './util';
import init_selectSucursal from './topbar';
import linkeaTelefonos from './telefonos';
import Functions from './Functions/index';

require('es6-promise').polyfill();
console.log('--');
//import startBarba from './barba/index';
//startBarba();

DOMUtil.ready(function() {


  if (isMobile.phone) linkeaTelefonos();

  init_selectSucursal();

  svg4everybody();

  // Load the function based on the body tag data-function="" 
  var func = DOMUtil.getFunctionName(document.body.attributes);
  if (func !== undefined) {
    func.forEach(function (funcion) {
      if (Functions[funcion] !== undefined) {
        Functions[funcion]();
      }
    });
  }

  if (window.location.hostname == 'www.jrecotecnologia.com') {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/trabajador.js', {
        scope: '/'
      });
    }
  }
});