"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
(function (Highcharts) {
  var _this = this;
  if (!window.everviz) window.everviz = {};
  var fontSizes = {};
  var textFields = ['title', 'subtitle', 'caption', 'credits', 'legend', 'rangeSelector'];

  // Can be an object or array
  var arrayTextFields = ['xAxis', 'yAxis', 'yAxisTick', 'xAxisTick'];
  var defaultFontSizePx = {
    title: 18,
    subtitle: 13,
    caption: 13,
    credits: 10,
    legend: 13,
    xAxis: 13,
    yAxis: 13,
    xAxisTick: 11,
    yAxisTick: 11,
    rangeSelector: 11
  };
  var previousSize = {
    width: null,
    height: null
  };
  var resizeTimeout = null;

  // Used inside everviz
  window.everviz.disconnectResizeObservers = function () {
    Highcharts.charts.forEach(function (chart) {
      if (chart !== null && chart !== void 0 && chart.resizeObserver) chart.resizeObserver.disconnect();
    });
  };

  // Used in publish codes. Dont want to remove all of
  // the observers on a users page like the function above
  window.everviz.disconnectResizeObserver = function (chart) {
    if (chart !== null && chart !== void 0 && chart.resizeObserver) chart.resizeObserver.disconnect();
  };
  window.everviz.getLocalAndActiveFontSizes = function (options) {
    var _options$xAxis, _options$yAxis;
    var localFontSizes = getFontSizes({
      options: options,
      xAxis: (_options$xAxis = options === null || options === void 0 ? void 0 : options.xAxis) !== null && _options$xAxis !== void 0 ? _options$xAxis : {},
      yAxis: (_options$yAxis = options === null || options === void 0 ? void 0 : options.yAxis) !== null && _options$yAxis !== void 0 ? _options$yAxis : {}
    });
    return {
      local: localFontSizes,
      active: fontSizes
    };
  };
  var getFontSizes = function getFontSizes(chart) {
    var sizes = {};
    textFields.forEach(function (field) {
      return sizes[field] = getFontSizeForTextField(chart, field);
    });
    arrayTextFields.forEach(function (field) {
      var _chart$options, _chart$options2;
      var isFieldAnArray = Highcharts.isArray(chart === null || chart === void 0 || (_chart$options = chart.options) === null || _chart$options === void 0 ? void 0 : _chart$options[field]);
      if (isFieldAnArray && (chart === null || chart === void 0 || (_chart$options2 = chart.options) === null || _chart$options2 === void 0 || (_chart$options2 = _chart$options2[field]) === null || _chart$options2 === void 0 ? void 0 : _chart$options2.length) > 1) {
        var _chart$options3;
        sizes[field] = [];
        chart === null || chart === void 0 || (_chart$options3 = chart.options) === null || _chart$options3 === void 0 || _chart$options3[field].forEach(function (_, index) {
          sizes[field][index] = getFontSizeForTextField(chart, field, index);
        });
      } else sizes[field] = getFontSizeForTextField(chart, field, 0);
    });
    return sizes;
  };
  var resizeFonts = function resizeFonts(chart, fontSizes, updatableChartOption) {
    var _updatableChartOption, _chart$options4;
    var responsiveFontOptions;
    var width = chart.chartWidth;
    var height = (_updatableChartOption = updatableChartOption === null || updatableChartOption === void 0 ? void 0 : updatableChartOption.height) !== null && _updatableChartOption !== void 0 ? _updatableChartOption : chart.chartHeight;
    var conversionRate = Math.log(height / 200) + Math.log(width / 100);
    var computeNewFontSize = function computeNewFontSize(fieldValue) {
      return "".concat(conversionRate / (39 / fieldValue), "rem");
    };
    var computeNewPointSize = function computeNewPointSize() {
      return Math.round(conversionRate);
    };
    var addAxisFont = function addAxisFont(axisId, chartType) {
      return {
        title: {
          style: {
            fontSize: computeNewFontSize(fontSizes[axisId])
          }
        },
        labels: {
          style: {
            fontSize: computeNewFontSize(fontSizes["".concat(axisId, "Tick")])
          },
          step: chartType === 'column' || chartType === 'heatmap' ? 1 : Math.round(width / 1000)
        }
      };
    };
    responsiveFontOptions = {
      chart: _objectSpread({
        style: {
          fontSize: "".concat(conversionRate / 3, "rem")
        }
      }, updatableChartOption !== null && updatableChartOption !== void 0 ? updatableChartOption : {}),
      title: {
        style: {
          fontSize: computeNewFontSize(fontSizes.title)
        }
      },
      subtitle: {
        style: {
          fontSize: computeNewFontSize(fontSizes.subtitle)
        }
      },
      caption: {
        style: {
          fontSize: computeNewFontSize(fontSizes.caption)
        }
      },
      credits: {
        style: {
          fontSize: computeNewFontSize(fontSizes.credits)
        }
      },
      legend: {
        itemStyle: {
          fontSize: computeNewFontSize(fontSizes.legend)
        }
      },
      rangeSelector: {
        labelStyle: {
          fontSize: computeNewFontSize(fontSizes.rangeSelector)
        }
      }
    };
    var isMap = (chart === null || chart === void 0 || (_chart$options4 = chart.options) === null || _chart$options4 === void 0 || (_chart$options4 = _chart$options4.chart) === null || _chart$options4 === void 0 ? void 0 : _chart$options4.type) === 'map';
    if (!isMap) {
      ['xAxis', 'yAxis'].forEach(function (axis) {
        var _chart$axis, _chart$axis2;
        if (chart !== null && chart !== void 0 && (_chart$axis = chart[axis]) !== null && _chart$axis !== void 0 && (_chart$axis = _chart$axis[0]) !== null && _chart$axis !== void 0 && _chart$axis.visible && chart !== null && chart !== void 0 && (_chart$axis2 = chart[axis]) !== null && _chart$axis2 !== void 0 && (_chart$axis2 = _chart$axis2[0]) !== null && _chart$axis2 !== void 0 && (_chart$axis2 = _chart$axis2.options) !== null && _chart$axis2 !== void 0 && _chart$axis2.title) {
          var _chart$types, _chart$axis3;
          var chartType = chart === null || chart === void 0 || (_chart$types = chart.types) === null || _chart$types === void 0 ? void 0 : _chart$types[0];
          var axisOptions = addAxisFont(axis, chartType);

          // Filter out navigator objects from the axis list
          var filteredAxes = chart === null || chart === void 0 || (_chart$axis3 = chart[axis]) === null || _chart$axis3 === void 0 ? void 0 : _chart$axis3.filter(function (axisObj) {
            var _axisObj$userOptions;
            return !(axisObj !== null && axisObj !== void 0 && (_axisObj$userOptions = axisObj.userOptions) !== null && _axisObj$userOptions !== void 0 && (_axisObj$userOptions = _axisObj$userOptions.className) !== null && _axisObj$userOptions !== void 0 && _axisObj$userOptions.includes("highcharts-navigator-".concat(axis.toLowerCase())));
          });
          if (filteredAxes.length > 1) {
            responsiveFontOptions[axis] = filteredAxes.map(function () {
              return _objectSpread({}, axisOptions);
            });
          } else {
            responsiveFontOptions[axis] = axisOptions;
          }
        }
      });
    }
    if (chart.options.chart.type === 'map') {
      responsiveFontOptions.plotOptions = {
        mappoint: {
          marker: {
            radius: computeNewPointSize()
          }
        }
      };
    }

    // This resize logic is clashing with the responsive rules we have set up in the
    // data step of the wizard, causing some jumping behaviour in the chart. If theres
    // a responsive rule being used on the chart, skip this logic instead.
    if (!chart.currentResponsive) chart.update(responsiveFontOptions, true, true, false);

    /* Resetting the resizing action for the context button, to avoid the wrong scaling issues in HC.
    Ideally, it should be replaced in the future, and moved to the responsiveFontOptions, but for the moment
    HC api doesn't not provide the sufficient config options */
    var contextButton = document.querySelector('.highcharts-contextbutton');
    if (contextButton) contextButton.style.fontSize = '0.8em';
    if (!window.everviz) window.everviz = {};
    window.everviz.responsiveFontOptions = responsiveFontOptions;
    previousSize.width = width;
    previousSize.height = height;
  };
  var getStringValue = function getStringValue(chart, fieldId, index) {
    var _chart$fieldId, _window$everviz, _chart$options5, _window$everviz2, _chart$options6, _window$everviz3, _chart$options7, _window$everviz4, _window$everviz5, _chart$options$fieldI, _window$everviz6, _window$everviz7, _chart$options$fieldI2;
    var isAxisVisible = chart === null || chart === void 0 || (_chart$fieldId = chart[fieldId]) === null || _chart$fieldId === void 0 || (_chart$fieldId = _chart$fieldId[index]) === null || _chart$fieldId === void 0 ? void 0 : _chart$fieldId.visible;
    if ((fieldId === 'xAxis' || fieldId === 'yAxis') && !isAxisVisible) return '';
    switch (fieldId) {
      case 'title':
      case 'subtitle':
      case 'caption':
      case 'credits':
        return ((_window$everviz = window.everviz) === null || _window$everviz === void 0 || (_window$everviz = _window$everviz.clonedOptions) === null || _window$everviz === void 0 || (_window$everviz = _window$everviz[fieldId]) === null || _window$everviz === void 0 || (_window$everviz = _window$everviz.style) === null || _window$everviz === void 0 ? void 0 : _window$everviz.fontSize) || ((_chart$options5 = chart.options) === null || _chart$options5 === void 0 || (_chart$options5 = _chart$options5[fieldId]) === null || _chart$options5 === void 0 || (_chart$options5 = _chart$options5.style) === null || _chart$options5 === void 0 ? void 0 : _chart$options5.fontSize) || '';
      case 'legend':
        return ((_window$everviz2 = window.everviz) === null || _window$everviz2 === void 0 || (_window$everviz2 = _window$everviz2.clonedOptions) === null || _window$everviz2 === void 0 || (_window$everviz2 = _window$everviz2[fieldId]) === null || _window$everviz2 === void 0 || (_window$everviz2 = _window$everviz2.style) === null || _window$everviz2 === void 0 ? void 0 : _window$everviz2.fontSize) || ((_chart$options6 = chart.options) === null || _chart$options6 === void 0 || (_chart$options6 = _chart$options6[fieldId]) === null || _chart$options6 === void 0 || (_chart$options6 = _chart$options6.itemStyle) === null || _chart$options6 === void 0 ? void 0 : _chart$options6.fontSize) || '';
      case 'rangeSelector':
        return ((_window$everviz3 = window.everviz) === null || _window$everviz3 === void 0 || (_window$everviz3 = _window$everviz3.clonedOptions) === null || _window$everviz3 === void 0 || (_window$everviz3 = _window$everviz3[fieldId]) === null || _window$everviz3 === void 0 || (_window$everviz3 = _window$everviz3.style) === null || _window$everviz3 === void 0 ? void 0 : _window$everviz3.fontSize) || ((_chart$options7 = chart.options) === null || _chart$options7 === void 0 || (_chart$options7 = _chart$options7[fieldId]) === null || _chart$options7 === void 0 || (_chart$options7 = _chart$options7.labelStyle) === null || _chart$options7 === void 0 ? void 0 : _chart$options7.fontSize) || '';
      case 'xAxis':
      case 'yAxis':
        return ((_window$everviz4 = window.everviz) === null || _window$everviz4 === void 0 || (_window$everviz4 = _window$everviz4.clonedOptions) === null || _window$everviz4 === void 0 || (_window$everviz4 = _window$everviz4[fieldId]) === null || _window$everviz4 === void 0 || (_window$everviz4 = _window$everviz4[index]) === null || _window$everviz4 === void 0 || (_window$everviz4 = _window$everviz4.title) === null || _window$everviz4 === void 0 || (_window$everviz4 = _window$everviz4.style) === null || _window$everviz4 === void 0 ? void 0 : _window$everviz4.fontSize) || ((_window$everviz5 = window.everviz) === null || _window$everviz5 === void 0 || (_window$everviz5 = _window$everviz5.clonedOptions) === null || _window$everviz5 === void 0 || (_window$everviz5 = _window$everviz5[fieldId]) === null || _window$everviz5 === void 0 || (_window$everviz5 = _window$everviz5.title) === null || _window$everviz5 === void 0 || (_window$everviz5 = _window$everviz5.style) === null || _window$everviz5 === void 0 ? void 0 : _window$everviz5.fontSize) || ((_chart$options$fieldI = chart.options[fieldId]) === null || _chart$options$fieldI === void 0 || (_chart$options$fieldI = _chart$options$fieldI[index]) === null || _chart$options$fieldI === void 0 || (_chart$options$fieldI = _chart$options$fieldI.title) === null || _chart$options$fieldI === void 0 || (_chart$options$fieldI = _chart$options$fieldI.style) === null || _chart$options$fieldI === void 0 ? void 0 : _chart$options$fieldI.fontSize) || '';
      case 'xAxisTick':
      case 'yAxisTick':
        return ((_window$everviz6 = window.everviz) === null || _window$everviz6 === void 0 || (_window$everviz6 = _window$everviz6.clonedOptions) === null || _window$everviz6 === void 0 || (_window$everviz6 = _window$everviz6[fieldId]) === null || _window$everviz6 === void 0 || (_window$everviz6 = _window$everviz6[index]) === null || _window$everviz6 === void 0 || (_window$everviz6 = _window$everviz6.labels) === null || _window$everviz6 === void 0 || (_window$everviz6 = _window$everviz6.style) === null || _window$everviz6 === void 0 ? void 0 : _window$everviz6.fontSize) || ((_window$everviz7 = window.everviz) === null || _window$everviz7 === void 0 || (_window$everviz7 = _window$everviz7.clonedOptions) === null || _window$everviz7 === void 0 || (_window$everviz7 = _window$everviz7[fieldId]) === null || _window$everviz7 === void 0 || (_window$everviz7 = _window$everviz7.labels) === null || _window$everviz7 === void 0 || (_window$everviz7 = _window$everviz7.style) === null || _window$everviz7 === void 0 ? void 0 : _window$everviz7.fontSize) || ((_chart$options$fieldI2 = chart.options[fieldId]) === null || _chart$options$fieldI2 === void 0 || (_chart$options$fieldI2 = _chart$options$fieldI2[index]) === null || _chart$options$fieldI2 === void 0 || (_chart$options$fieldI2 = _chart$options$fieldI2.labels) === null || _chart$options$fieldI2 === void 0 || (_chart$options$fieldI2 = _chart$options$fieldI2.style) === null || _chart$options$fieldI2 === void 0 ? void 0 : _chart$options$fieldI2.fontSize) || '';
    }
  };
  var getFontSizeForTextField = function getFontSizeForTextField(chart, fieldId, index) {
    var stringValue = getStringValue(chart, fieldId, index !== null && index !== void 0 ? index : 0);
    stringValue = Highcharts.isNumber(stringValue) ? stringValue.toString() : stringValue;
    return stringValue.includes('px') ? parseInt(stringValue) : defaultFontSizePx[fieldId];
  };
  var getHeightForDynamic = function getHeightForDynamic(chart) {
    var _chart$fullscreen;
    return chart !== null && chart !== void 0 && (_chart$fullscreen = chart.fullscreen) !== null && _chart$fullscreen !== void 0 && _chart$fullscreen.isOpen ? undefined : chart.chartHeight + (chart.evervizMinPlotHeight - chart.plotHeight);
  };
  var getElementHeight = function getElementHeight(element) {
    var _dimensions, _dimensions2;
    var dimensions;
    if (element !== null && element !== void 0 && element.getBBox) dimensions = element.getBBox();else if (element !== null && element !== void 0 && element.getBoundingClientRect) dimensions = element.getBoundingClientRect();
    return (_dimensions = dimensions) !== null && _dimensions !== void 0 && _dimensions.width && (_dimensions2 = dimensions) !== null && _dimensions2 !== void 0 && _dimensions2.height ? dimensions.height : 0;
  };
  var getDecorationHeight = function getDecorationHeight(chart) {
    var _chart$title, _chart$subtitle, _chart$legend$box$get, _chart$legend;
    var titleHeight = getElementHeight((_chart$title = chart.title) === null || _chart$title === void 0 ? void 0 : _chart$title.element);
    var subtitleHeight = getElementHeight((_chart$subtitle = chart.subtitle) === null || _chart$subtitle === void 0 ? void 0 : _chart$subtitle.element);
    var legendHeight = (_chart$legend$box$get = (_chart$legend = chart.legend) === null || _chart$legend === void 0 || (_chart$legend = _chart$legend.box) === null || _chart$legend === void 0 ? void 0 : _chart$legend.getBBox().height) !== null && _chart$legend$box$get !== void 0 ? _chart$legend$box$get : 0;
    return {
      decorationHeight: titleHeight + subtitleHeight + legendHeight,
      offsetHeight: titleHeight + subtitleHeight
    };
  };
  var getHeightForScaled = function getHeightForScaled(chart) {
    var map = chart.container.querySelector('.highcharts-series-group');
    var mapBox = map.getBBox();
    var _getDecorationHeight = getDecorationHeight(chart),
      decorationHeight = _getDecorationHeight.decorationHeight;
    var heightFromWidth = mapBox.height / mapBox.width;
    return parseInt(chart.chartWidth * heightFromWidth, 10) + decorationHeight;
  };
  var offsetMap = function offsetMap(y) {
    var map = _this.container.querySelector('.highcharts-series-group');
    map.setAttribute('transform', "translate(0, ".concat(y, ")"));
  };
  var getResponsiveConfig = function getResponsiveConfig(chart) {
    var newHeight = chart.evervizScaleToFit ? getHeightForScaled(chart) : getHeightForDynamic(chart);
    var config = {
      height: newHeight
    };
    if (chart.evervizScaleToFit) {
      config.margin = [5, 5, 5, 5];
      var _getDecorationHeight2 = getDecorationHeight(chart),
        offsetHeight = _getDecorationHeight2.offsetHeight;
      if (offsetHeight) {
        // Add some small margin to prevent map from touching text directly
        var PAD = 25;
        offsetMap((offsetHeight + PAD) / 2);
      }
    }
    return config;
  };
  var handleDynamicOptions = function handleDynamicOptions(chart, isStub) {
    var _chart$options8, _chart$options9;
    var responsiveConfig = {};
    var evervizDynamicHeight = chart.evervizDynamicHeight;
    if (evervizDynamicHeight && !window.inEverviz && !isStub) responsiveConfig = getResponsiveConfig(chart);
    var useDynamicFonts = (_chart$options8 = chart.options) === null || _chart$options8 === void 0 || (_chart$options8 = _chart$options8.everviz) === null || _chart$options8 === void 0 || (_chart$options8 = _chart$options8.text) === null || _chart$options8 === void 0 ? void 0 : _chart$options8.dynamicFonts;
    var isSameSize = chart.chartWidth === previousSize.width && chart.chartHeight === previousSize.height;
    var forceRender = (_chart$options9 = chart.options) === null || _chart$options9 === void 0 || (_chart$options9 = _chart$options9.everviz) === null || _chart$options9 === void 0 || (_chart$options9 = _chart$options9.text) === null || _chart$options9 === void 0 ? void 0 : _chart$options9.forceRender;
    var shouldRenderInEverviz = window.inEverviz && (!isSameSize || forceRender);
    var shouldRender = !window.inEverviz || shouldRenderInEverviz;
    if (shouldRender) {
      if (useDynamicFonts) resizeFonts(chart, fontSizes, evervizDynamicHeight ? responsiveConfig : {});else if (!useDynamicFonts && evervizDynamicHeight) chart.update({
        chart: responsiveConfig
      });
    }
  };
  Highcharts.addEvent(Highcharts.Chart, 'load', function () {
    var _this$options$everviz, _this$userOptions, _this$userOptions2;
    var templateMinPlotHeight = {
      packedbubble: 400
    };
    var hasHeight = this.userOptions && this.userOptions.chart && this.userOptions.chart.height;
    this.evervizDynamicHeight = !hasHeight;
    this.evervizScaleToFit = (_this$options$everviz = this.options.everviz) === null || _this$options$everviz === void 0 || (_this$options$everviz = _this$options$everviz.animation) === null || _this$options$everviz === void 0 ? void 0 : _this$options$everviz.scaleToFit;
    this.evervizMinPlotHeight = templateMinPlotHeight[(_this$userOptions = this.userOptions) === null || _this$userOptions === void 0 || (_this$userOptions = _this$userOptions.chart) === null || _this$userOptions === void 0 ? void 0 : _this$userOptions.type] || 300;
    var isStub = this.evervizScaleToFit && ((_this$userOptions2 = this.userOptions) === null || _this$userOptions2 === void 0 || (_this$userOptions2 = _this$userOptions2.everviz) === null || _this$userOptions2 === void 0 ? void 0 : _this$userOptions2.stub);
    fontSizes = getFontSizes(this);
    handleDynamicOptions(this, isStub);
    if (typeof ResizeObserver === 'function') {
      var chart = this;
      chart.resizeObserver = new ResizeObserver(function () {
        var _chart$options10;
        var noRedraw = chart === null || chart === void 0 || (_chart$options10 = chart.options) === null || _chart$options10 === void 0 || (_chart$options10 = _chart$options10.everviz) === null || _chart$options10 === void 0 || (_chart$options10 = _chart$options10.text) === null || _chart$options10 === void 0 ? void 0 : _chart$options10.noRedraw;
        var hasChart = chart === null || chart === void 0 ? void 0 : chart.chartHeight;
        if (hasChart && chart !== null && chart !== void 0 && chart.reflow) chart.reflow();
        // Highmaps doesnt play well with reflowing here. Call a final
        // redraw at the end of the resize to align everything properly
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function () {
          if (hasChart && !noRedraw) chart.redraw();
        }, 10);
        handleDynamicOptions(chart, isStub);
      });
      chart.resizeObserver.observe(chart.renderTo);
    }
  });
})(window.Highcharts);