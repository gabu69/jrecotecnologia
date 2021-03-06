import Barba from 'barba.js'

import HomePage from './HomePage';
import DefaultPage from './DefaultPage';

export default function startBarba() {
  new BarbaWrapper({
    cache: false,
    prefetch: false,
    navId: 'navegacion',
    refreshOnSameHrefClick: false
  })
    .match('HomePage', new HomePage())
    .match('DefaultPage', new DefaultPage())
    .start();
}

const DEFAULT_OPTIONS = {
  cache: false,
  prefetch: false,
  navId: null,
  refreshOnSameHrefClick: false
}

class BarbaWrapper {
  /**
   * Merge options
   *
   * @param options See available options in DEFAULT_OPTIONS
   * @returns {BarbaWrapper}
   */
  constructor (options) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options)
    this.pages = []
    this.navLinks = (this.options.navId) ? Array.from(document.getElementById(this.options.navId).getElementsByTagName('a')) : null
    return this
  }

  /**
   * Create a Barba view
   *
   * @param namespace that is set in front matter
   * @param page instance which extends Page
   * @returns {BarbaWrapper}
   */
  match (namespace, page) {
    page.initializeBarba(namespace)
    this.pages.push(page)
    return this
  }

  /**
   * Call it after all match()
   */
  start () {
    Barba.Pjax.cacheEnabled = this.options.cache

    Barba.Pjax.start()

    if (this.options.prefetch) Barba.Prefetch.init()

    // Transitions
    Barba.Dispatcher.on('linkClicked', this.onBarbaLinkClicked.bind(this))

    // Refresh
    if (!this.options.refreshOnSameHrefClick) {
      Array.from(document.querySelectorAll('a[href]')).forEach((link) => {
        link.addEventListener('click', this.onLinkClicked.bind(this))
      })
    }

    // Update links
    if (this.navLinks && this.navLinks.length) {
      this.onBarbaNewPageReady()
      Barba.Dispatcher.on('newPageReady', this.onBarbaNewPageReady.bind(this))
    }
  }

  onLinkClicked (event) {
    if (event.currentTarget.href === window.location.href) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  /**
   * Define transition on link click, getting it from active page instance or use default
   *
   * @param el element clicked
   */
  onBarbaLinkClicked (el) {
    const transition = this.getActivePage().getTransition({
      el,
      datas: Object.assign({}, el.dataset)
    }) || this.getDefaultTransition()

    Barba.Pjax.getTransition = () => {
      return Barba.BaseTransition.extend(transition)
    }
  }

  /**
   * Return current page
   *
   * @returns {*}
   */
  getActivePage () {
    return this.pages.find(page => page.active)
  }

  /**
   * Return a fade transition
   *
   * @returns {{start: start, finish: finish}}
   */
  getDefaultTransition () {
    // Note : Do not use arrow function to keep Barba.BaseTransition context
    return {
      start: function () {
        this.fadeOut.bind(this);
        this.newContainerLoading
          .then(this.fadeIn.bind(this));
      },
      fadeOut: function() {
        this.oldContainer.classList.toggle('ocultar');
      },
      fadeIn: function() {
        document.body.scrollTop = 0;
        this.newContainer.classList.toggle('mostrar');
        this.done();
      }
    };
  }

  /**
   * Add active class on all links matching current url
   */
  onBarbaNewPageReady () {
    this.navLinks.forEach((link) => {
      if (link.getAttribute('href') === window.location.pathname) {
        link.classList.add('activo');
      } else {
        link.classList.remove('activo');
      }
    });
  }
}