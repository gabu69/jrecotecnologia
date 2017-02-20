import axios from 'axios';
import isMobile from 'ismobilejs';
import { cambiaTamano } from './func/resize';

export default {
  name: 'App',
  data: function() {
    return {
      tipo: 'casa',
      nombre: '',
      correo: '',
      telefono: '',
      ciudad: '',
      estado: '',
      consumo: '',
      mensaje: '',
      usuario_cfe: '',
      servicio_cfe: '',
      autorizo: false,
      gotchaz: '',
      recibo: '',
      errores: {}
    };
  },
  computed: {
    labelNombre() {
      return this.tipo == 'casa' ? 'Nombre' : 'Empresa';
    },
    doUpload() {
      //return (window.File && window.FileReader && window.FormData);
      return (window.File && window.FileReader && window.FormData && isMobile.any);
    },
    cargandoRecibo() {
      return (this.recibo == '/assets/img/sun.gif');
    }
  },
  methods: {
    onSubmit() {

      axios.post('/server/cotizar', this.$data)
        .then(response => alert('todo chido'))
        .catch(error => this.errores = error.response.data);
  
    },
    onFileChange(e) {

      let vm = this;
      vm.recibo = '/assets/img/sun.gif';
      let file = e.target.files[0];
      if ( !file )
        return;
      if ( /^image\//i.test(file.type) )
        this.procesaImagen(file);

    },
    procesaImagen(file) {

      let reader = new FileReader();
      let vm = this;

      reader.onprogress = (e) => {
        var percentage = Math.round((e.loaded * 100) / e.total);
        console.log('Cargado : ' + percentage + '%');
      };
      
      reader.onloadend = (e) => {
        let image = new Image();
        let dataURL = e.target.result;
        let mimeType = dataURL.split(",")[0].split(":")[1].split(";")[0];

        image.src = dataURL;

        image.onload = () => {
		      vm.recibo = cambiaTamano(image, mimeType);
        };
      };
      
      reader.onerror = () => {
    		alert('Error leyendo imágen.');
    		vm.recibo = '';
    	};
      console.log('--');
      reader.readAsDataURL(file);

    },
    removeImage: function (e) {

      this.recibo = '';

    }
  }
};