import { $id } from '../util';

var Flickity = require('flickity');

export default function() {
  let sliders = [].slice.call(document.querySelectorAll('.main-carousel')),
      flkties = [];
  sliders.forEach(function(slider) {
    let flkty = new Flickity(slider, {
      cellSelector: '.carousel-cell',
      pageDots: false,
      wrapAround: true,
      cellAlign: 'left',
      imagesLoaded: true,
      percentPosition: true,
      resize: true
    });
    flkties.push(flkty);
  });

  let filtro = $id('filtro');
  if (filtro) {
    require.ensure([], function(require) {
      var mixitup = require('mixitup');
      mixitup('.productos', {
        selectors: {
          target: '.producto'
        },
        animation: {
          duration: 300
        }
      });
    }, 'mixitup');
  }
}