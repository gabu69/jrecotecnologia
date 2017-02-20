

Sucursal Hermosillo borrada 31/08/16
  {
      "id": 18,
      "slug": "hermosillo",
      "nombre": "Hermosillo",
      "ciudad": "Hermosillo",
      "estado": "Sonora",
      "direccion1": "Calle Ignacio Romero 147",
      "direccion2": "",
      "colonia": "Col. San Benito",
      "cp": 83190,
      "tel": 6622105814,
      "correo": "hermosillo@jrecotecnologia.com",
      "gmaps": "https://goo.gl/K2s6EH",
      "facebook": "https://www.facebook.com/jrecotec.hermosillo/",
      "gplus": "https://plus.google.com/+JREcotecnolog%C3%ADaHermosillo",
      "horario": "1-5:0900-1800,6:0900-1500",
      "lng": -110.9690381,
      "lat": 29.0972849,
      "color": "#f2e659"
  }
Sucursal Monterrey borrada 10/11/16 > cambia 15/12/16

  
usar en lugar de lastitem:
{% assign items = items | split: "|||" | join: ',' %}


http://galt.mx/contact/
http://enerbiomex.com/cotizacion-sin-costo/
http://www.ecotrends.mx/cotizacion
http://www.panelessolares.com.mx/CONTACTO.aspx
http://www.revoteck.com/page/cotiza


Hay que hacer que webappmanifest.json sea dinámico









https://philipwalton.com/articles/the-google-analytics-setup-i-use-on-every-site-i-build/
https://github.com/philipwalton/analyticsjs-boilerplate

<script>addEventListener('error', window.__e=function f(e){f.q=f.q||[];f.q.push(e)});</script>

export const init = () => {
  // ...
  trackErrors();
  // ...
};

export const trackError = (error, fieldsObj = {}) => {
  ga('send', 'event', Object.assign({
    eventCategory: 'Script',
    eventAction: 'error',
    eventLabel: (error && error.stack) || '(not set)',
    nonInteraction: true,
  }, fieldsObj));
};

const trackErrors = () => {
  const loadErrorEvents = window.__e && window.__e.q || [];
  const fieldsObj = {eventAction: 'uncaught error'};

  // Replay any stored load error events.
  for (let event of loadErrorEvents) {
    trackError(event.error, fieldsObj);
  }

  // Add a new listener to track event immediately.
  window.addEventListener('error', (event) => {
    trackError(event.error, fieldsObj);
  });
};




const dimensions = {
  CLIENT_ID: 'dimension1',
};


ga((tracker) => {
  var clientId = tracker.get('clientId');
  tracker.set(dimensions.CLIENT_ID, clientId);
});

