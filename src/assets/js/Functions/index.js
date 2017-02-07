export default {

  home: function() {
    require.ensure([], function(require) {
  		var Home = require('./home/index').default;
      Home();
  	}, 'home');
  },

  productosGrid: function() {
    require.ensure([], function(require) {
  		var Productos = require('./productosGrid').default;
      Productos();
  	}, 'productos');
  },

  form: require('./form').default,

  cotizaSolar: function() {
    require.ensure([], function(require) {
  		var Cotizador = require('./cotizaSolar/index').default;
      Cotizador();
  	}, 'cotizaSolar');
  }

};