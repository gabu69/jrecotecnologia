export const DOMUtil = {
  ready: function(fn) {
    if (document.readyState != 'loading') {
      fn();
    }
    else if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', fn);
    }
    else {
      document.attachEvent('onreadystatechange', function() {
        if (document.readyState != 'loading')
          fn();
      });
    }
  },

  getFunctionName: function(attributes) {
    var func = undefined;

    Array.prototype.slice.call(attributes).forEach(function(item) {
      if (item.name === 'data-function') {
        func = item.value.split(',');
      }
    });

    return func;
  }
};

export const $class = (className, all = false) => {
  const selection = document.getElementsByClassName(className);
  return (all) ? Array.from(selection) : selection[0];
};

export const $id = (id) => {
  return document.getElementById(id);
};