import { $class } from './util';

export default function linkeaTelefonos() {
  $class('phone-number', true).forEach(function(el) {
    let tel = el.dataset.href;
    el.outerHTML = '<a href="' + tel + '">' + el.innerHTML + '</a>';
  });
}