"use strict";

(function (Highcharts) {
  Highcharts.wrap(Highcharts.Data.prototype, 'trim', function (proceed, str, inside) {
    if (typeof str === 'string') {
      var _this$options$decimal;
      str = str.replace(/^\s+|\s+$/g, '');

      // Clear white space inside the string, like thousands separators
      if (inside && /[\d\s]+/.test(str)) {
        str = str.replace(/\s/g, '');
      }
      var decimalPoint = (_this$options$decimal = this.options.decimalPoint) !== null && _this$options$decimal !== void 0 ? _this$options$decimal : '.';
      if (str.includes(decimalPoint) && this.decimalRegex) {
        str = str.replace(this.decimalRegex, '$1.$2');
      }
    }
    return str;
  });
})(window.Highcharts);