"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/* eslint-disable wrap-iife */
/* eslint-disable no-use-before-define */
/**
 * The post utility
 *
 * @private
 * @function Highcharts.post
 * @param {string} url
 *        Post URL
 * @param {object} data
 *        Post data
 * @param {Highcharts.Dictionary<string>} [formAttributes]
 *        Additional attributes for the post request
 * @return {void}
 */
function strip(html) {
  var doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}
if (!window['everviz']) window['everviz'] = {};
window['everviz'].strip = strip;
(function (Highcharts) {
  if (!Highcharts) return;
  var cached = {
    googleSpreadsheetKey: false,
    range: false,
    data: false
  };
  if (Highcharts.HttpUtilities) {
    Highcharts.HttpUtilities.post = function (url, data, formAttributes) {
      // create the form
      var form = Highcharts.createElement('form', Highcharts.merge({
        method: 'post',
        action: url,
        enctype: 'multipart/form-data'
      }, formAttributes), {
        display: 'none'
      }, document.body);
      // add the data
      Highcharts.objectEach(data, function (val, name) {
        Highcharts.createElement('input', {
          type: 'hidden',
          name: name,
          value: val
        }, null, form);
      });
      var externalCSS = [];
      var hasCSS = false;
      if (window.HighchartsCloud && window.HighchartsCloud.externalCSS && window.HighchartsCloud.externalCSS.length) {
        externalCSS = window.HighchartsCloud.externalCSS || [];
        hasCSS = true;
      }
      if (window.evervizCSS && window.evervizCSS.externalCSS && window.evervizCSS.externalCSS.length) {
        externalCSS = externalCSS.concat(window.evervizCSS.externalCSS || []);
        hasCSS = true;
      }
      if (window.Everviz && window.Everviz.externalCSS && window.Everviz.externalCSS.length) {
        externalCSS = externalCSS.concat(window.Everviz.externalCSS || []);
        hasCSS = true;
      }
      if (hasCSS) {
        Highcharts.createElement('input', {
          type: 'hidden',
          name: 'cssModules',
          value: JSON.stringify(externalCSS || [])
        }, null, form);
      }
      if (formAttributes && formAttributes.uuid) {
        Highcharts.createElement('input', {
          type: 'hidden',
          name: 'uuid',
          value: formAttributes.uuid
        }, null, form);
      }

      // submit
      form.submit();
      // clean up
      Highcharts.discardElement(form);
    };
  }

  // Workaround for https://github.com/highcharts/highcharts/issues/16920
  // Delete this when they fix there and implement a proper solution
  Highcharts.wrap(Highcharts.Data.prototype, 'parsed', function () {
    try {
      var _this$chartOptions, _this$chartOptions2, _window, _this$chartOptions4, _this$chartOptions5;
      var mapUsed = this === null || this === void 0 || (_this$chartOptions = this.chartOptions) === null || _this$chartOptions === void 0 || (_this$chartOptions = _this$chartOptions.chart) === null || _this$chartOptions === void 0 ? void 0 : _this$chartOptions.map;
      var joinByCode = this === null || this === void 0 || (_this$chartOptions2 = this.chartOptions) === null || _this$chartOptions2 === void 0 || (_this$chartOptions2 = _this$chartOptions2.series) === null || _this$chartOptions2 === void 0 || (_this$chartOptions2 = _this$chartOptions2[0]) === null || _this$chartOptions2 === void 0 || (_this$chartOptions2 = _this$chartOptions2.joinBy) === null || _this$chartOptions2 === void 0 ? void 0 : _this$chartOptions2[0];
      var map = (_window = window) === null || _window === void 0 || (_window = _window.Highcharts) === null || _window === void 0 || (_window = _window.maps) === null || _window === void 0 ? void 0 : _window[mapUsed];
      if (map && joinByCode) {
        var _map$features, _this$chartOptions$ch, _this$chartOptions3;
        var mapCodesBasedOnCode = ((_map$features = map.features) !== null && _map$features !== void 0 ? _map$features : []).map(function (prop) {
          var _prop$properties$join, _prop$properties;
          return ((_prop$properties$join = (_prop$properties = prop.properties) === null || _prop$properties === void 0 ? void 0 : _prop$properties[joinByCode]) !== null && _prop$properties$join !== void 0 ? _prop$properties$join : '').toString();
        }).filter(function (d) {
          return d;
        });
        var codeMappingIndex = (_this$chartOptions$ch = this === null || this === void 0 || (_this$chartOptions3 = this.chartOptions) === null || _this$chartOptions3 === void 0 || (_this$chartOptions3 = _this$chartOptions3.chart) === null || _this$chartOptions3 === void 0 || (_this$chartOptions3 = _this$chartOptions3.data) === null || _this$chartOptions3 === void 0 || (_this$chartOptions3 = _this$chartOptions3.seriesMapping) === null || _this$chartOptions3 === void 0 ? void 0 : _this$chartOptions3[0][joinByCode !== null && joinByCode !== void 0 ? joinByCode : 'hc-key']) !== null && _this$chartOptions$ch !== void 0 ? _this$chartOptions$ch : 0;
        for (var i = 0; i < this.columns[0].length; i++) {
          var cell = this.columns[codeMappingIndex][i];
          var stringCell = cell !== null && cell !== void 0 ? cell : ''.toString();
          var length = stringCell.toString().length;
          if (length < 5) {
            var invalidFipsFound = !mapCodesBasedOnCode.includes(stringCell) && mapCodesBasedOnCode.includes('0' + cell);
            if (invalidFipsFound) this.columns[codeMappingIndex][i] = '0' + cell;
          }
        }
      }
      if (this !== null && this !== void 0 && (_this$chartOptions4 = this.chartOptions) !== null && _this$chartOptions4 !== void 0 && (_this$chartOptions4 = _this$chartOptions4.chart) !== null && _this$chartOptions4 !== void 0 && _this$chartOptions4.map && this !== null && this !== void 0 && (_this$chartOptions5 = this.chartOptions) !== null && _this$chartOptions5 !== void 0 && (_this$chartOptions5 = _this$chartOptions5.series) !== null && _this$chartOptions5 !== void 0 && _this$chartOptions5.some(function (series) {
        return series.type === 'mapbubble' || series.type === 'mappoint';
      })) {
        var _this$chartOptions6, _this$chartOptions7, _this$chartOptions8, _this$chartOptions$da;
        if (this !== null && this !== void 0 && (_this$chartOptions6 = this.chartOptions) !== null && _this$chartOptions6 !== void 0 && (_this$chartOptions6 = _this$chartOptions6.series) !== null && _this$chartOptions6 !== void 0 && _this$chartOptions6[0] && 'joinBy' in (this === null || this === void 0 || (_this$chartOptions7 = this.chartOptions) === null || _this$chartOptions7 === void 0 || (_this$chartOptions7 = _this$chartOptions7.series) === null || _this$chartOptions7 === void 0 ? void 0 : _this$chartOptions7[0])) {
          this.chartOptions.series[0]['joinBy'] = ' ';
        }
        if (this !== null && this !== void 0 && (_this$chartOptions8 = this.chartOptions) !== null && _this$chartOptions8 !== void 0 && (_this$chartOptions8 = _this$chartOptions8.data) !== null && _this$chartOptions8 !== void 0 && (_this$chartOptions8 = _this$chartOptions8.seriesMapping) !== null && _this$chartOptions8 !== void 0 && _this$chartOptions8[0] && 'hc-key' in ((_this$chartOptions$da = this.chartOptions.data) === null || _this$chartOptions$da === void 0 || (_this$chartOptions$da = _this$chartOptions$da.seriesMapping) === null || _this$chartOptions$da === void 0 ? void 0 : _this$chartOptions$da[0])) {
          delete this.chartOptions.data.seriesMapping[0]['hc-key'];
        }
      }
    } catch (e) {
      console.log(e);
    }
  });
  Highcharts.wrap(Highcharts.Data.prototype, 'parseGoogleSpreadsheet', function (proceed) {
    var data = this,
      options = this.options,
      googleSpreadsheetKey = options.googleSpreadsheetKey,
      chart = this.chart,
      refreshRate = Math.min((options.dataRefreshRate || 2) * 1000, 4000);
    /**
     * Form the `values` field after range settings, unless the
     * googleSpreadsheetRange option is set.
     */
    var getRange = function getRange() {
      if (options.googleSpreadsheetRange) {
        return options.googleSpreadsheetRange;
      }
      var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var start = (alphabet.charAt(options.startColumn || 0) || 'A') + ((options.startRow || 0) + 1);
      var end = alphabet.charAt(Highcharts.pick(options.endColumn, -1)) || 'ZZ';
      if (Highcharts.defined(options.endRow)) {
        end += options.endRow + 1;
      }
      return start + ':' + end;
    };

    /**
     * Fetch the actual spreadsheet using XMLHttpRequest.
     * @private
     */
    function fetchSheet(fn) {
      if (cached.data && !window.HighchartsCloud && !options.enablePolling) {
        // Cut down on requests to google
        if (googleSpreadsheetKey === cached.googleSpreadsheetKey && cached.range === getRange()) {
          // Errors if I dont set on a timeout, guessing a race condition

          var values = Highcharts.merge({}, cached.data);
          values.values = values.values.map(function (f) {
            return f.map(function (d) {
              return d;
            });
          });
          setTimeout(function () {
            return fn(values);
          }, 10);
          return;
        }
      }
      var url = '';
      if (!window.HighchartsCloud) {
        // We're inside the editor, 'HighchartsCloud' prop only gets set inside the publish codes
        url = ['https://sheets.googleapis.com/v4/spreadsheets', googleSpreadsheetKey, 'values', getRange(), '?alt=json&' + 'majorDimension=COLUMNS&' + 'valueRenderOption=FORMATTED_VALUE&' + 'dateTimeRenderOption=FORMATTED_STRING&' + 'key=AIzaSyCchblEzIdk4rPKD6sbi72c4OseEdqmyPQ'].join('/');
      } else {
        url = ['https://data.everviz.com/gsheet?googleSpreadsheetKey=', googleSpreadsheetKey, '&worksheet=', getRange()].join('');
      }
      Highcharts.ajax({
        url: url,
        dataType: 'json',
        success: function success(json) {
          var isInEvervizEditor = !window.HighchartsCloud && window.location.pathname.indexOf('/edit/');
          if (options.evervizRepublish && !isInEvervizEditor) {
            // This worksheet has recently been set to be viewable by everyone.
            // Republish this and any other chart that uses this worksheet automatically in everviz
            if (!window.everviz.publishingWorksheet) window.everviz.publishingWorksheet = {};
            if (!window.everviz.publishingWorksheet[googleSpreadsheetKey]) {
              window.everviz.publishingWorksheet[googleSpreadsheetKey] = 1;
              Highcharts.ajax({
                url: 'https://api.everviz.com/republish/googlesheet/' + googleSpreadsheetKey,
                dataType: 'json',
                success: function success() {},
                error: function error(xhr, text) {
                  return options.error && options.error(text, xhr);
                }
              });
            }
          }
          cached.data = Highcharts.merge({}, json);
          cached.googleSpreadsheetKey = googleSpreadsheetKey;
          cached.range = getRange();
          cached.data.values = cached.data.values.map(function (f) {
            return f.map(function (d) {
              return d;
            });
          });
          fn(json);
          if (options.enablePolling) {
            setTimeout(function () {
              fetchSheet(fn);
            }, refreshRate);
          }
        },
        error: function error(xhr, text) {
          return options.error && options.error(text, xhr);
        }
      });
    }
    if (googleSpreadsheetKey) {
      delete options.googleSpreadsheetKey;
      fetchSheet(function (json) {
        var columns = json.values;
        if (!columns || columns.length === 0) {
          return false;
        }
        columns = columns.map(function (col, colIndex) {
          if (colIndex === 0) return col;
          return col.map(function (cell, rowIndex) {
            if (rowIndex === 0) return cell;
            if (typeof cell === 'undefined') cell = null;
            if (typeof cell === 'string' && /\d/.test(cell)) {
              var num = parseFloat(cell.replace(/[^0-9.-]/g, ''));
              if (!isNaN(num)) {
                cell = num;
              }
            }
            return cell;
          });
        });
        if (chart && chart.series) {
          chart.update({
            data: {
              columns: columns
            }
          });
        } else {
          data.columns = columns;
          data.dataFound();
        }
      });
    }
    return false;
  });
  Highcharts.addEvent(Highcharts.Chart, 'exportData', function (params) {
    var _params$target,
      _params$dataRows,
      _this = this;
    var transpose = function transpose(matrix) {
      return matrix[0].map(function (label, colIndex) {
        return matrix.map(function (row) {
          return row[colIndex];
        });
      });
    };
    var transposedDataRows = transpose(params.dataRows);
    var header = Object.values(transposedDataRows !== null && transposedDataRows !== void 0 ? transposedDataRows : {}).map(function (arr) {
      return arr[0];
    });
    var targetSeriesType = params === null || params === void 0 || (_params$target = params.target) === null || _params$target === void 0 || (_params$target = _params$target.options) === null || _params$target === void 0 || (_params$target = _params$target.series[0]) === null || _params$target === void 0 ? void 0 : _params$target.type;
    if (targetSeriesType === 'heatmap') header.splice(2, 2);
    if (params !== null && params !== void 0 && (_params$dataRows = params.dataRows) !== null && _params$dataRows !== void 0 && _params$dataRows.length && targetSeriesType !== 'packedbubble') {
      var _params$target2, _targetOptions$export, _targetOptions$data$s, _targetOptions$data, _params$target3, _params$target4;
      var rawColumnsLength = Object.keys(this.data.rawColumns).length;
      var leng = Object.keys(this.data.rawColumns[0]).length;
      var targetOptions = params === null || params === void 0 || (_params$target2 = params.target) === null || _params$target2 === void 0 ? void 0 : _params$target2.options;
      var useMultiLevelHeaders = targetOptions === null || targetOptions === void 0 || (_targetOptions$export = targetOptions.exporting) === null || _targetOptions$export === void 0 ? void 0 : _targetOptions$export.useMultiLevelHeaders;
      var seriesMapping = (_targetOptions$data$s = targetOptions === null || targetOptions === void 0 || (_targetOptions$data = targetOptions.data) === null || _targetOptions$data === void 0 ? void 0 : _targetOptions$data.seriesMapping) !== null && _targetOptions$data$s !== void 0 ? _targetOptions$data$s : [];
      var rawColumns = params === null || params === void 0 || (_params$target3 = params.target) === null || _params$target3 === void 0 || (_params$target3 = _params$target3.data) === null || _params$target3 === void 0 ? void 0 : _params$target3.rawColumns;
      var transposedRawColumns = transpose(rawColumns);
      var seenLabels = {};
      var _iterator = _createForOfIteratorHelper(seriesMapping),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var series = _step.value;
          var labelValue = series.label;
          if (labelValue && !seenLabels[labelValue]) {
            var labelHeader = transposedRawColumns[0][labelValue];
            header.push(labelHeader);
            var initialIndex = 0,
              indexDecrement = 0;
            if (useMultiLevelHeaders) {
              initialIndex = 2;
              indexDecrement = 1;
            }
            for (var index = initialIndex; index < params.dataRows.length; index++) {
              var valueIndex = index - indexDecrement;
              params.dataRows[index].splice(labelValue, 0, this.data.rawColumns[labelValue][valueIndex]);
            }
            seenLabels[labelValue] = true;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      var reorderAndPush = function reorderAndPush(i, j) {
        switch (j) {
          case 0:
            return _this.data.rawColumns[1][i];
          case 1:
            return _this.data.rawColumns[0][i];
          default:
            return _this.data.rawColumns[j][i];
        }
      };
      var setDataRows = function setDataRows(length, callback) {
        for (var i = 0; i <= length; i++) {
          params.dataRows[i] = [];
          for (var j = 0; j < rawColumnsLength; j++) {
            params.dataRows[i].push(callback(i, j));
          }
        }
      };
      var seriesType = (params === null || params === void 0 || (_params$target4 = params.target) === null || _params$target4 === void 0 || (_params$target4 = _params$target4.options) === null || _params$target4 === void 0 || (_params$target4 = _params$target4.series) === null || _params$target4 === void 0 || (_params$target4 = _params$target4[1]) === null || _params$target4 === void 0 ? void 0 : _params$target4.type) || targetSeriesType;
      switch (seriesType) {
        case 'mappoint':
          setDataRows(rawColumnsLength, function (i, j) {
            return _this.data.rawColumns[j][i];
          });
          break;
        case 'tilemap':
          setDataRows(rawColumnsLength, reorderAndPush);
          break;
        case 'dependencywheel':
        case 'sankey':
          setDataRows(leng, reorderAndPush);
          break;
        case 'timeline':
          setDataRows(leng, function (i, j) {
            var _this$data$rawColumns;
            if (seriesType === 'timeline') j++;
            return (_this$data$rawColumns = _this.data.rawColumns[j]) === null || _this$data$rawColumns === void 0 ? void 0 : _this$data$rawColumns[i];
          });
          break;
        default:
          params.dataRows[0] = header;
          break;
      }
    }
    return params;
  });

  // This is basically just Highcharts code from their data module. Im tapping into this so
  // I can override the read function to the old way before a recent regression. Remove this whole
  // block when https://github.com/highcharts/highcharts/issues/20167 is fixed.
  Highcharts.wrap(Highcharts.Data.prototype, 'dataFound', function () {
    var _this$valueCount$seri, _this$valueCount;
    if (this.options.switchRowsAndColumns) {
      this.columns = this.rowsToColumns(this.columns);
    }

    // Interpret the info about series and columns
    this.getColumnDistribution();
    ((_this$valueCount$seri = this === null || this === void 0 || (_this$valueCount = this.valueCount) === null || _this$valueCount === void 0 ? void 0 : _this$valueCount.seriesBuilders) !== null && _this$valueCount$seri !== void 0 ? _this$valueCount$seri : []).forEach(function (builder) {
      builder.read = function (columns, rowIndex) {
        var builder = this,
          pointIsArray = builder.pointIsArray,
          point = pointIsArray ? [] : {};

        // Loop each reader and ask it to read its value.
        // Then, build an array or point based on the readers names.
        builder.readers.forEach(function (reader) {
          var value = columns[reader.columnIndex] ? columns[reader.columnIndex][rowIndex] : undefined;
          if (pointIsArray) {
            point.push(value);
          } else {
            if (reader.configName.indexOf('.') > 0) {
              // Handle nested property names
              Highcharts.Point.prototype.setNestedProperty(point, value, reader.configName);
            } else {
              point[reader.configName] = value;
            }
          }
        });

        // The name comes from the first column (excluding the x column)
        if (typeof this.name === 'undefined' && builder.readers.length >= 2) {
          var columnIndexes = [];
          builder.readers.forEach(function (reader) {
            if (reader.configName === 'x' || reader.configName === 'name' || reader.configName === 'y') {
              if (typeof reader.columnIndex !== 'undefined') {
                columnIndexes.push(reader.columnIndex);
              }
            }
          });
          if (columnIndexes.length >= 2) {
            // Remove the first one (x col)
            columnIndexes.shift();

            // Sort the remaining
            columnIndexes.sort(function (a, b) {
              return a - b;
            });
            // Now use the lowest index as name column
            var nameColumnIndex = Highcharts.pick(columnIndexes.shift(), 0);
            this.name = columns[nameColumnIndex] ? columns[nameColumnIndex].name : '';
          }
        }
        return point;
      };
    });
    // Interpret the values into right types
    this.parseTypes();

    // Handle columns if a handleColumns callback is given
    if (this.parsed() !== false) {
      // Complete if a complete callback is given
      this.complete();
    }
  });
  function createSortIcon(type) {
    return '<img style="margin-left: 0.25rem; margin-right: 0.25rem; width: 12px; height: 12px;" src="https://app.everviz.com/static/icons/' + type + '.svg"/>';
  }
  var sortIcon = createSortIcon('sort');
  var sortAscIcon = createSortIcon('sort-up');
  var sortDescIcon = createSortIcon('sort-down');
  function createSortIconContainer(innerHTML, icon) {
    return '<div style="flex-direction: row; display: flex; align-items: center;">' + innerHTML + icon + '<div>';
  }
  function sortOnClick(chart) {
    var dataTableDiv = chart === null || chart === void 0 ? void 0 : chart.dataTableDiv;
    if (dataTableDiv) {
      var tableHeader = dataTableDiv.querySelector('.highcharts-data-table tr');
      if (tableHeader) {
        tableHeader.querySelectorAll('th').forEach(function (elem) {
          if (!elem.innerHTMLCopy) return;
          // Set "sort" icon type by its highchart class
          if (elem.outerHTML.includes('highcharts-sort-descending')) {
            elem.innerHTML = createSortIconContainer(elem.innerHTMLCopy, sortDescIcon);
            elem.ariaSort = 'descending';
          } else if (elem.outerHTML.includes('highcharts-sort-ascending')) {
            elem.innerHTML = createSortIconContainer(elem.innerHTMLCopy, sortAscIcon);
            elem.ariaSort = 'ascending';
          } else {
            elem.innerHTML = createSortIconContainer(elem.innerHTMLCopy, sortIcon);
            elem.ariaSort = 'none';
          }
        });
      }
    }
  }

  // Strip data table HTML
  // Workaround for https://github.com/highcharts/highcharts/issues/16536
  Highcharts.addEvent(Highcharts.Chart, 'afterViewData', function () {
    var _this$options$chart,
      _this2 = this;
    var customTextFont = (_this$options$chart = this.options.chart) === null || _this$options$chart === void 0 || (_this$options$chart = _this$options$chart.style) === null || _this$options$chart === void 0 ? void 0 : _this$options$chart.fontFamily;
    // Strip table caption
    var tableCaptionElement = document.querySelector('.highcharts-table-caption');
    if (tableCaptionElement) {
      tableCaptionElement.innerText = strip(this.options.exporting.tableCaption || this.options.title.text);
      tableCaptionElement.style.fontFamily = customTextFont;
    }

    // Strip table headers. Not exposed through API, override DOM
    document.querySelectorAll('.highcharts-data-table .highcharts-text').forEach(function (el) {
      el.innerText = strip(el.innerText);
      el.style.fontFamily = customTextFont;
    });

    // Strip table numeric data/apply decimal point & thousands seperator
    var thousandsRegex = /\B(?=(\d{3})+(?!\d))/g;
    document.querySelectorAll('.highcharts-data-table .highcharts-number').forEach(function (el) {
      var _this2$options$lang$d;
      el.innerText = strip(el.innerText).replace('.', (_this2$options$lang$d = _this2.options.lang.decimalPoint) !== null && _this2$options$lang$d !== void 0 ? _this2$options$lang$d : '.').replace(thousandsRegex, _this2.options.lang.thousandsSep);
      el.style.fontFamily = customTextFont;
    });

    // Add sort icons and accessibility to chart data preview
    var dataTableDiv = this.dataTableDiv;
    if (dataTableDiv) {
      var tableHeader = dataTableDiv.querySelector('.highcharts-data-table tr');
      if (tableHeader) {
        tableHeader.addEventListener('click', function (current, _) {
          return sortOnClick(_this2);
        });

        // Append a "sort" icon to the element, and store a copy of the original innerHTML value
        tableHeader.querySelectorAll('th').forEach(function (elem) {
          elem.innerHTMLCopy = elem.innerHTML;
          elem.innerHTML = createSortIconContainer(elem.innerHTML, sortIcon);
          elem.title = elem.innerText;
        });
      }
    }
  });

  // Override for Highcharts a11y proxy button issue.
  // ToDo: Extend to also reposition Options. Only repositioning legend.
  // See: https://github.com/highcharts/highcharts/issues/17642
  var topOffset;
  var proxyButtons = '.highcharts-a11y-proxy-element';
  Highcharts.addEvent(Highcharts.Chart, 'render', function () {
    if (!topOffset) {
      var _document$querySelect;
      topOffset = (_document$querySelect = document.querySelector(proxyButtons)) === null || _document$querySelect === void 0 || (_document$querySelect = _document$querySelect.style) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.top;
    } else if (topOffset) {
      // Need to delay as Highcharts override our changes without it.
      setTimeout(function () {
        document.querySelectorAll(proxyButtons).forEach(function (button) {
          button.style.top = parseInt(button.style.top) > parseInt(topOffset) ? button.style.top : topOffset;
        });
      }, 1000);
    }
  });

  // Apply a theme like Highcharts v10
  // https://www.highcharts.com/samples/highcharts/members/theme-v10
  // Hopefully fixes visual regressions users are seeing
  Highcharts.setOptions({
    chart: {
      zooming: {
        // By default on with Stock, introduced 11.1.0
        // Traps mouse scroll on all published charts
        mouseWheel: false
      }
    },
    title: {
      style: {
        fontWeight: 'normal',
        fontSize: '18px'
      }
    },
    plotOptions: {
      area: {
        lineWidth: 2
      },
      column: {
        borderRadius: 0
      },
      pie: {
        borderRadius: 0,
        dataLabels: {
          connectorShape: 'fixedOffset'
        }
      },
      line: {
        lineWidth: 2
      },
      spline: {
        lineWidth: 2
      }
    },
    tooltip: {
      borderWidth: 1
    },
    legend: {
      itemStyle: {
        fontWeight: 'bold'
      }
    },
    xAxis: {
      labels: {
        distance: 8,
        style: {
          color: '#666666',
          fontSize: '11px'
        }
      }
    },
    yAxis: {
      labels: {
        distance: 8,
        style: {
          color: '#666666',
          fontSize: '11px'
        }
      }
    },
    scrollbar: {
      barBorderRadius: 0,
      barBorderWidth: 1,
      buttonsEnabled: true,
      height: 14,
      margin: 0,
      rifleColor: '#333',
      trackBackgroundColor: '#f2f2f2',
      trackBorderRadius: 0
    }
  });
  Highcharts.addEvent(Highcharts.Chart, 'load', function () {
    var _this$userOptions, _this$userOptions2, _this$userOptions3;
    var hasCustomizedHeightWidth = (this === null || this === void 0 || (_this$userOptions = this.userOptions) === null || _this$userOptions === void 0 || (_this$userOptions = _this$userOptions.chart) === null || _this$userOptions === void 0 ? void 0 : _this$userOptions.height) || (this === null || this === void 0 || (_this$userOptions2 = this.userOptions) === null || _this$userOptions2 === void 0 || (_this$userOptions2 = _this$userOptions2.chart) === null || _this$userOptions2 === void 0 ? void 0 : _this$userOptions2.width);
    var renderToId = this === null || this === void 0 || (_this$userOptions3 = this.userOptions) === null || _this$userOptions3 === void 0 || (_this$userOptions3 = _this$userOptions3.chart) === null || _this$userOptions3 === void 0 || (_this$userOptions3 = _this$userOptions3.renderTo) === null || _this$userOptions3 === void 0 ? void 0 : _this$userOptions3.id;
    if (hasCustomizedHeightWidth && renderToId) {
      var embedElements = document.querySelectorAll("div#".concat(renderToId, ".").concat(renderToId));
      if (embedElements.length > 0) {
        embedElements.forEach(function (element) {
          element.style.overflow = 'auto';
        });
      }
    }
  });

  // TODO: This whole if statement needs to be removed in future. The logic has been moved to highcharts-resize.js.
  // Only kept here for now so it doesnt break old publish charts that rely on it. We only need the highcharts-resize
  // file linked once on the users page for all embed charts on the page to pick it up so keep this section here running
  // in the interim and remove when enough time has passed that the resize file is more than likely on the users site.
  if (window.HighchartsCloud && !window.inEverviz) {
    Highcharts.addEvent(Highcharts.Chart, 'load', function () {
      var _window$HighchartsClo, _window2, _this$options$everviz, _this$userOptions4;
      // v6 of publish codes has new resizing logic in it. Dont run this function then as it'll just run the
      // one in the highcharts-resize file instead.
      this.hasNewFontSizing = ((_window$HighchartsClo = (_window2 = window) === null || _window2 === void 0 || (_window2 = _window2.HighchartsCloud) === null || _window2 === void 0 ? void 0 : _window2.versions) !== null && _window$HighchartsClo !== void 0 ? _window$HighchartsClo : []).includes(6);
      if (this.hasNewFontSizing) return;
      var templateMinPlotHeight = {
        packedbubble: 400
      };
      var hasHeight = this.userOptions && this.userOptions.chart && this.userOptions.chart.height;
      this.evervizDynamicHeight = !hasHeight;
      this.evervizScaleToFit = (_this$options$everviz = this.options.everviz) === null || _this$options$everviz === void 0 || (_this$options$everviz = _this$options$everviz.animation) === null || _this$options$everviz === void 0 ? void 0 : _this$options$everviz.scaleToFit;
      this.evervizMinPlotHeight = templateMinPlotHeight[(_this$userOptions4 = this.userOptions) === null || _this$userOptions4 === void 0 || (_this$userOptions4 = _this$userOptions4.chart) === null || _this$userOptions4 === void 0 ? void 0 : _this$userOptions4.type] || 300;
    });
    Highcharts.addEvent(Highcharts.Chart, 'render', function () {
      var _this$userOptions5;
      // Dont want to run the map dynamic scaling on stub or if the user
      // has the new resizing logic that was added in v6 of the embed codes

      if (this.hasNewFontSizing) return;
      if (this.evervizScaleToFit && (_this$userOptions5 = this.userOptions) !== null && _this$userOptions5 !== void 0 && (_this$userOptions5 = _this$userOptions5.everviz) !== null && _this$userOptions5 !== void 0 && _this$userOptions5.stub) return;

      // User has set explicit height
      if (!this.evervizDynamicHeight) return;
      var newHeight = this.evervizScaleToFit ? getHeightForScaled.call(this) : getHeightForDynamic.call(this);
      if (this.previousHeight === newHeight) return;
      this.previousHeight = newHeight;
      var updateConfig = {};
      if (this.evervizScaleToFit) {
        updateConfig = {
          margin: [5, 5, 5, 5]
        };
        var _getDecorationHeight$ = getDecorationHeight.call(this),
          offsetHeight = _getDecorationHeight$.offsetHeight;
        if (offsetHeight) {
          // Add some small margin to prevent map from touching text directly
          var PAD = 25;
          offsetMap((offsetHeight + PAD) / 2);
        }
      }
      this.update({
        chart: _objectSpread({
          height: newHeight
        }, updateConfig)
      });
      function getHeightForDynamic() {
        var _this$fullscreen;
        return (_this$fullscreen = this.fullscreen) !== null && _this$fullscreen !== void 0 && _this$fullscreen.isOpen ? undefined : this.chartHeight + (this.evervizMinPlotHeight - this.plotHeight);
      }
      function getHeightForScaled() {
        var map = this.container.querySelector('.highcharts-series-group');
        var mapBox = map.getBBox();
        var _getDecorationHeight$2 = getDecorationHeight.call(this),
          decorationHeight = _getDecorationHeight$2.decorationHeight;
        var heightFromWidth = mapBox.height / mapBox.width;
        return parseInt(this.chartWidth * heightFromWidth, 10) + decorationHeight;
      }
      function getElementHeight(element) {
        var _dimensions, _dimensions2;
        var dimensions;
        if (element !== null && element !== void 0 && element.getBBox) dimensions = element.getBBox();else if (element !== null && element !== void 0 && element.getBoundingClientRect) dimensions = element.getBoundingClientRect();
        return (_dimensions = dimensions) !== null && _dimensions !== void 0 && _dimensions.width && (_dimensions2 = dimensions) !== null && _dimensions2 !== void 0 && _dimensions2.height ? dimensions.height : 0;
      }
      function getDecorationHeight() {
        var _this$title, _this$subtitle, _this$legend$box$getB, _this$legend;
        var titleHeight = getElementHeight((_this$title = this.title) === null || _this$title === void 0 ? void 0 : _this$title.element);
        var subtitleHeight = getElementHeight((_this$subtitle = this.subtitle) === null || _this$subtitle === void 0 ? void 0 : _this$subtitle.element);
        var legendHeight = (_this$legend$box$getB = (_this$legend = this.legend) === null || _this$legend === void 0 || (_this$legend = _this$legend.box) === null || _this$legend === void 0 ? void 0 : _this$legend.getBBox().height) !== null && _this$legend$box$getB !== void 0 ? _this$legend$box$getB : 0;
        return {
          decorationHeight: titleHeight + subtitleHeight + legendHeight,
          offsetHeight: titleHeight + subtitleHeight
        };
      }
      function offsetMap(y) {
        var map = this.container.querySelector('.highcharts-series-group');
        map.setAttribute('transform', "translate(0, ".concat(y, ")"));
      }
    });
  }
})(window.Highcharts);