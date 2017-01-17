import lazyLoad from 'lazysizes';
import svg4everybody from 'svg4everybody';
import DOMUtil from './util';
import init_selectSucursal from './topbar';
import Functions from './Functions/index';

DOMUtil.ready(function() {

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
});