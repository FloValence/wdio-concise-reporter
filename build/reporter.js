'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Initialize a new `Concise` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

var ConciseReporter = function (_events$EventEmitter) {
  _inherits(ConciseReporter, _events$EventEmitter);

  function ConciseReporter(baseReporter, config) {
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, ConciseReporter);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ConciseReporter).call(this));

    _this.baseReporter = baseReporter;
    _this.config = config;
    _this.options = options;

    var epilogue = _this.baseReporter.epilogue;


    _this.on('end', function () {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(_this.baseReporter.stats.runners)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var cid = _step.value;

          var runnerInfo = _this.baseReporter.stats.runners[cid];
          var start = _this.baseReporter.stats.start;
          var end = _this.baseReporter.stats.end;
          var json = _this.prepareJson(start, end, runnerInfo);
          console.log('\x1b[33m', '========= Your concise report ==========', '\x1b[0m');
          console.log(_this.prepareConsole(json));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      epilogue.call(baseReporter);
    });
    return _this;
  }

  _createClass(ConciseReporter, [{
    key: 'prepareConsole',
    value: function prepareConsole(jsonReport) {
      var mainMessage = jsonReport.capabilities.browserName + ':' + jsonReport.capabilities.browser_version + '::' + jsonReport.capabilities.os + ':' + (jsonReport.capabilities.os_version && 'latest') + '::' + jsonReport.capabilities.resolution + '\n';
      // time = `(time: ${jsonReport.start}-${jsonReport.end})`

      if (jsonReport.state.failed === 0) {
        mainMessage += '\x1b[32mAll went well !!\x1b[0m';
      } else {
        mainMessage += 'Test' + (jsonReport.state.failed > 1 ? 's' : '') + ' failed (' + jsonReport.state.failed + '): \n';

        jsonReport.fails.forEach(function (test) {
          mainMessage += '\tFail : \u001b[31m' + test.suiteName + ' => ' + test.name + '\u001b[0m\n\t\t ' + test.errorType + ' : \u001b[33m' + test.error + '\u001b[0m\n';
        });
      }

      return mainMessage;
    }
  }, {
    key: 'prepareJson',
    value: function prepareJson(start, end, runnerInfo) {
      var resultSet = {};
      var skippedCount = 0;
      var passedCount = 0;
      var failedCount = 0;
      resultSet.start = start;
      resultSet.end = end;
      resultSet.capabilities = runnerInfo.capabilities;
      resultSet.baseUrl = runnerInfo.config.baseUrl;
      resultSet.suites = [];
      resultSet.fails = [];

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Object.keys(runnerInfo.specs)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var specId = _step2.value;

          var spec = runnerInfo.specs[specId];

          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = Object.keys(spec.suites)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var suiteName = _step3.value;

              var suite = spec.suites[suiteName];

              var _iteratorNormalCompletion4 = true;
              var _didIteratorError4 = false;
              var _iteratorError4 = undefined;

              try {
                for (var _iterator4 = Object.keys(suite.tests)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                  var testName = _step4.value;

                  var test = suite.tests[testName];
                  var testCase = {};

                  testCase.name = testName;
                  testCase.start = suite.tests[testName].start;
                  testCase.end = suite.tests[testName].end;
                  testCase.duration = suite.tests[testName].duration;

                  if (test.state === 'pending') {
                    skippedCount = skippedCount + 1;
                    testCase.state = 'skipped';
                  } else if (test.state === 'pass') {
                    passedCount = passedCount + 1;
                    testCase.state = test.state;
                  } else if (test.state === 'fail') {
                    testCase.suiteName = suiteName;
                    failedCount = failedCount + 1;
                    testCase.state = test.state;
                    testCase.error = test.error.message;
                    testCase.errorType = test.error.type;
                    resultSet.fails.push(testCase);
                  }
                  resultSet.state = {};
                  resultSet.state.passed = passedCount;
                  resultSet.state.failed = failedCount;
                  resultSet.state.skipped = skippedCount;
                }
              } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    _iterator4.return();
                  }
                } finally {
                  if (_didIteratorError4) {
                    throw _iteratorError4;
                  }
                }
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          return resultSet;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }]);

  return ConciseReporter;
}(_events2.default.EventEmitter);

ConciseReporter.reporterName = 'Concise';

exports['default'] = ConciseReporter;
module.exports = exports['default'];
