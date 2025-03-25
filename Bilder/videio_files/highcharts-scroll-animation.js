"use strict";

if (!window['everviz']) window['everviz'] = {};
window['everviz'].pendingRenders = {};
window['everviz'].isElementInViewport = function (el) {
  // Special bonus for those using jQuery
  if (typeof jQuery === 'function' && el instanceof jQuery) {
    el = el[0];
  }
  var rect = el.getBoundingClientRect();
  if (rect.height > window.innerHeight) {
    return rect.top <= 0 && rect.left >= 0 && rect.bottom / 2 <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
  }
  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
};
window['everviz'].isSpecialCase = function (options) {
  return options.chart && (options.chart.type === 'pie' || options.chart.type === 'wordcloud' || options.chart.type === 'mappoint' || options.chart.type === 'timeline') || window['everviz'].isArr(options.series) && options.series.some(function (series) {
    return series.type === 'pie' || series.type === 'wordcloud' || series.type === 'mappoint' || series.type === 'timeline';
  });
};
window['everviz'].shouldDeleteSeriesMapping = function (options) {
  return options.chart && options.chart.type === 'dependencywheel';
};
window['everviz'].deleteSpecialTemplateTypes = function (options) {
  if (options.chart && options.chart.type === 'timeline') {
    delete options.chart.type;
  }
  if (options.series) {
    var isSpecial = options.series.some(function (s) {
      return s.type === 'timeline';
    });
    if (isSpecial) {
      options.series.forEach(function (s) {
        delete s.type;
      });
      //Hide legend as well
      if (!options.legend) options.legend = {};
      options.legend.enabled = false;
    }
  }
};
window['everviz'].createStub = function (options) {
  if (window['everviz'].merge) {
    var optionsStub = window['everviz'].merge({}, options);
    var isSpecialCase = window['everviz'].isSpecialCase(options);
    var shouldDeleteData = window['everviz'].shouldDeleteSeriesMapping(options);
    if (!optionsStub.plotOptions) optionsStub.plotOptions = {};
    if (isSpecialCase) {
      if (!optionsStub.plotOptions.pie) optionsStub.plotOptions.pie = {};
      optionsStub.plotOptions.pie.visible = false;
    }
    window['everviz'].merge(optionsStub, {
      everviz: {
        stub: true
      }
    });
    window['everviz'].deleteSpecialTemplateTypes(optionsStub);
    if (optionsStub.plotOptions && optionsStub.plotOptions.series && optionsStub.plotOptions.series.hasOwnProperty('center')) {
      delete optionsStub.plotOptions.series.center;
    }
    optionsStub = _stubAxes(optionsStub);
    if (optionsStub.mapNavigation) delete optionsStub.mapNavigation;
    //Some template types have a data label shown by default, for example: Tilemap
    //Disable this so we dont get weird 0's showing on the screen
    if (!optionsStub.plotOptions.series) optionsStub.plotOptions.series = {};
    if (!optionsStub.plotOptions.series.dataLabels) optionsStub.plotOptions.series.dataLabels = {};
    optionsStub.plotOptions.series.dataLabels.enabled = false;
    if (optionsStub.data) {
      if (!isSpecialCase && !shouldDeleteData && optionsStub.data.csv) {
        var headers = optionsStub.data.csv.split('\n')[0];
        if (headers) {
          var emptyFields = headers.split(';').map(function () {
            return null;
          }).join(';');
          optionsStub.data.csv = headers + '\n' + emptyFields;
          optionsStub.data.itemDelimiter = ';';
        }
      } else delete optionsStub.data;
    }
    return optionsStub;
  }
  return options;
};
window['everviz'].updateRenderTo = function (options, element) {
  //Allow for rendering chart to more than one container
  if (!options.chart) options.chart = {};
  options.chart.renderTo = element;
};
window['everviz'].modifyMapType = function (options) {
  if (window['everviz'].isArr && window['everviz'].isArr(options.series) && options.series.length > 1 && window['everviz'].isMapBubbleOrPoint(options.series)) {
    //Stop animation on the map so it doesnt load again when recreating
    options.series[0].animation = false;
  }
  return options;
};
window['everviz'].recalculate = function () {
  Object.keys(window['everviz'].pendingRenders).forEach(function (key) {
    var item = window['everviz'].pendingRenders[key];
    var inViewport = window['everviz'].isElementInViewport(item.element);
    if (inViewport) {
      item.element.style.minHeight = item.element.offsetHeight + 'px';
      item.appear();
      delete window['everviz'].pendingRenders[key];
    }
  });
};
window['everviz'].pendingIframeAnim = function (chart) {
  var loadOnPageLoad = chart.options && chart.options.everviz && chart.options.everviz.animation && chart.options.everviz.animation.loadOnPageLoad === true;
  if (loadOnPageLoad) {
    chart.appear();
    return;
  }
  if (window.IntersectionObserver) {
    window['everviz'].pendingRenders[chart.id] = chart;
    window['everviz'].pendingRenders[chart.id].loaded = false;
    var observerOptions = {
      threshold: 0.3
    };
    var callback = function callback(bodyElement) {
      if (bodyElement[0].isIntersecting && window['everviz'].pendingRenders[chart.id] && !window['everviz'].pendingRenders[chart.id].loaded) {
        // Element is visible.
        window['everviz'].pendingRenders[chart.id].loaded = true;
        chart.appear();
        window['everviz'].pendingRenders[chart.id].observer.unobserve(chart.element);
        window['everviz'].pendingRenders[chart.id].observer.disconnect();
        delete window['everviz'].pendingRenders[chart.id];
      }
    };
    window['everviz'].pendingRenders[chart.id].observer = new window.IntersectionObserver(callback, observerOptions);
    var bodyElement = chart.element;
    window['everviz'].pendingRenders[chart.id].observer.observe(bodyElement);
  } else {
    //Does not support IntersectionObserver,
    //Fallback to just creating the chart
    chart.appear();
  }
};
window['everviz'].showChart = function (chart) {
  window['everviz'].pendingRenders[chart.id].loaded = true;
  chart.element.style.minHeight = chart.element.offsetHeight + 'px';
  chart.appear();
  window['everviz'].pendingRenders[chart.id].observer.unobserve(window['everviz'].pendingRenders[chart.id].element);
  window['everviz'].pendingRenders[chart.id].observer.disconnect();
  delete window['everviz'].pendingRenders[chart.id];
};
window['everviz'].pendingAnim = function (chart) {
  var loadOnPageLoad = chart.options && chart.options.everviz && chart.options.everviz.animation && chart.options.everviz.animation.loadOnPageLoad === true;
  if (loadOnPageLoad) {
    chart.appear();
    return;
  }
  window['everviz'].pendingRenders[chart.id] = chart;
  if (window.IntersectionObserver) {
    var observerOptions = {
      threshold: 0.3
    };
    var callback = function callback(bodyElement) {
      if (bodyElement[0].isIntersecting && window['everviz'].pendingRenders[chart.id] && !window['everviz'].pendingRenders[chart.id].loaded) {
        // Element is visible.

        window['everviz'].showChart(chart);
      }
    };
    window['everviz'].pendingRenders[chart.id].observer = new window.IntersectionObserver(callback, observerOptions);
    var bodyElement = chart.element;
    window['everviz'].pendingRenders[chart.id].observer.observe(bodyElement);
  } else {
    //Does not support IntersectionObserver,
    //Fallback to manual option
    window['everviz'].recalculate();
  }
};
window['everviz'].beforePrint = function () {
  Object.keys(window['everviz'].pendingRenders).forEach(function (key) {
    if (window['everviz'].pendingRenders[key] && !window['everviz'].pendingRenders[key].loaded) {
      var chart = window['everviz'].pendingRenders[key];
      (chart.options.series || []).forEach(function (series) {
        series.animation = false;
      });
      window['everviz'].showChart(window['everviz'].pendingRenders[key]);
    }
  });
};

//Only use this on old browsers
if (!window.IntersectionObserver && window.addEventListener) {
  ['DOMContentLoaded', 'load', 'scroll', 'resize'].forEach(function (eventType) {
    addEventListener(eventType, window['everviz'].recalculate, false);
  });
}
if ('matchMedia' in window) {
  window.matchMedia('print').addListener(function () {
    window['everviz'].beforePrint();
  });
} else window.onbeforeprint = function () {
  window['everviz'].beforePrint();
};

// Context: https://github.com/Visual-Elements/everviz/pull/826
function _stubAxes(optionsStub) {
  var clear = function clear(axis) {
    return window.everviz.isArr(axis) ? axis.map(function () {
      return {};
    }) : {};
  };
  optionsStub.xAxis = clear(optionsStub.xAxis);
  optionsStub.yAxis = clear(optionsStub.yAxis);
  return optionsStub;
}