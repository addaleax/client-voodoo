"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) {
            return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) {
                resolve(value);
            });
        }
        function onfulfill(value) {
            try {
                step("next", value);
            } catch (e) {
                reject(e);
            }
        }
        function onreject(value) {
            try {
                step("throw", value);
            } catch (e) {
                reject(e);
            }
        }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
var fs = require('fs');
var url = require('url');
var path = require('path');
var events_1 = require('events');
var _ = require('lodash');
var request = require('request');
var StreamSpeed = require('./stream-speed');
var common_1 = require('../common');

var Downloader = (function () {
    function Downloader() {
        (0, _classCallCheck3.default)(this, Downloader);
    }

    (0, _createClass3.default)(Downloader, null, [{
        key: "download",
        value: function download(from, to, options) {
            return new DownloadHandle(from, to, options);
        }
    }]);
    return Downloader;
})();

exports.Downloader = Downloader;
(function (DownloadHandleState) {
    DownloadHandleState[DownloadHandleState["STARTED"] = 0] = "STARTED";
    DownloadHandleState[DownloadHandleState["STARTING"] = 1] = "STARTING";
    DownloadHandleState[DownloadHandleState["STOPPED"] = 2] = "STOPPED";
    DownloadHandleState[DownloadHandleState["STOPPING"] = 3] = "STOPPING";
    DownloadHandleState[DownloadHandleState["FINISHED"] = 4] = "FINISHED";
})(exports.DownloadHandleState || (exports.DownloadHandleState = {}));
var DownloadHandleState = exports.DownloadHandleState;

var DownloadHandle = (function () {
    function DownloadHandle(_url, _to, _options) {
        (0, _classCallCheck3.default)(this, DownloadHandle);

        this._url = _url;
        this._to = _to;
        this._options = _options;
        this._options = _.defaults(this._options || {}, {
            overwrite: false
        });
        this._state = DownloadHandleState.STOPPED;
        this._emitter = new events_1.EventEmitter();
    }

    (0, _createClass3.default)(DownloadHandle, [{
        key: "start",
        value: function start(url) {
            return __awaiter(this, void 0, _promise2.default, _regenerator2.default.mark(function _callee() {
                var _this = this;

                var stat, unlinked, toDir, dirStat;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!(this._state !== DownloadHandleState.STOPPED)) {
                                    _context.next = 2;
                                    break;
                                }

                                return _context.abrupt("return", false);

                            case 2:
                                this._state = DownloadHandleState.STARTING;
                                this._promise = this.promise; // Make sure a promise exists when starting.
                                this._url = url || this._url;
                                this._totalSize = 0;
                                this._totalDownloaded = 0;
                                _context.prev = 7;
                                _context.next = 10;
                                return common_1.default.fsExists(this._to);

                            case 10:
                                if (!_context.sent) {
                                    _context.next = 28;
                                    break;
                                }

                                _context.next = 13;
                                return common_1.default.fsStat(this._to);

                            case 13:
                                stat = _context.sent;

                                if (stat.isFile()) {
                                    _context.next = 18;
                                    break;
                                }

                                throw new Error('Can\'t resume downloading because the destination isn\'t a file.');

                            case 18:
                                if (!this._options.overwrite) {
                                    _context.next = 25;
                                    break;
                                }

                                _context.next = 21;
                                return common_1.default.fsUnlink(this._to);

                            case 21:
                                unlinked = _context.sent;

                                if (!unlinked) {
                                    _context.next = 24;
                                    break;
                                }

                                throw new Error('Can\'t download because destination cannot be overwritten.');

                            case 24:
                                stat.size = 0;

                            case 25:
                                this._totalDownloaded = stat.size;
                                _context.next = 43;
                                break;

                            case 28:
                                toDir = path.dirname(this._to);
                                _context.next = 31;
                                return common_1.default.fsExists(toDir);

                            case 31:
                                if (!_context.sent) {
                                    _context.next = 39;
                                    break;
                                }

                                _context.next = 34;
                                return common_1.default.fsStat(toDir);

                            case 34:
                                dirStat = _context.sent;

                                if (dirStat.isDirectory()) {
                                    _context.next = 37;
                                    break;
                                }

                                throw new Error('Can\'t download to destination because the path is invalid.');

                            case 37:
                                _context.next = 43;
                                break;

                            case 39:
                                _context.next = 41;
                                return common_1.default.mkdirp(toDir);

                            case 41:
                                if (_context.sent) {
                                    _context.next = 43;
                                    break;
                                }

                                throw new Error('Couldn\'t create the destination folder path');

                            case 43:
                                this._options.overwrite = false;
                                _context.next = 50;
                                break;

                            case 46:
                                _context.prev = 46;
                                _context.t0 = _context["catch"](7);

                                this.onError(_context.t0);
                                return _context.abrupt("return", false);

                            case 50:
                                return _context.abrupt("return", new _promise2.default(function (resolve) {
                                    return _this.download(resolve);
                                }));

                            case 51:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[7, 46]]);
            }));
        }
    }, {
        key: "stop",
        value: function stop() {
            return __awaiter(this, void 0, _promise2.default, _regenerator2.default.mark(function _callee2() {
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!(this._state !== DownloadHandleState.STARTED)) {
                                    _context2.next = 2;
                                    break;
                                }

                                return _context2.abrupt("return", false);

                            case 2:
                                this._state = DownloadHandleState.STOPPING;
                                this._streamSpeed.stop();
                                this._response.removeAllListeners();
                                this._destStream.removeAllListeners();
                                this._response.unpipe(this._destStream);
                                this._destStream.close();
                                this._request.abort();
                                this._state = DownloadHandleState.STOPPED;
                                return _context2.abrupt("return", true);

                            case 11:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));
        }
    }, {
        key: "download",
        value: function download(resolve) {
            var _this2 = this;

            var hostUrl = url.parse(this._url);
            var httpOptions = {
                headers: {
                    'Range': 'bytes=' + this._totalDownloaded.toString() + '-'
                }
            };
            this._destStream = fs.createWriteStream(this._to, {
                flags: 'a'
            });
            this._request = request.get(this._url, httpOptions).on('response', function (response) {
                if (response.statusCode === 301) {
                    return;
                }
                _this2._response = response;
                _this2._streamSpeed = new StreamSpeed.StreamSpeed(_this2._options);
                _this2._streamSpeed.onSample(function (sample) {
                    return _this2.emitProgress({
                        progress: _this2._totalDownloaded / _this2._totalSize,
                        timeLeft: Math.round((_this2._totalSize - _this2._totalDownloaded) / sample.currentAverage),
                        sample: sample
                    });
                });
                _this2._state = DownloadHandleState.STARTED;
                resolve(true);
                // Unsatisfiable request - most likely we've downloaded the whole thing already.
                // TODO - send HEAD request to get content-length and compare.
                if (_this2._response.statusCode === 416) {
                    return _this2.onFinished();
                }
                // Expecting the partial response status code
                if (_this2._response.statusCode !== 206) {
                    return _this2.onError(new Error('Bad status code ' + _this2._response.statusCode));
                }
                if (!_this2._response.headers || !_this2._response.headers['content-range']) {
                    return _this2.onError(new Error('Missing or invalid content-range response header'));
                }
                try {
                    _this2._totalSize = parseInt(_this2._response.headers['content-range'].split('/')[1]);
                } catch (err) {
                    return _this2.onError(new Error('Invalid content-range header: ' + _this2._response.headers['content-range']));
                }
                if (_this2._options.decompressStream) {
                    _this2._request.pipe(_this2._streamSpeed).pipe(_this2._options.decompressStream).pipe(_this2._destStream);
                } else {
                    _this2._request.pipe(_this2._streamSpeed).pipe(_this2._destStream);
                }
                _this2._destStream.on('finish', function () {
                    return _this2.onFinished();
                });
                _this2._destStream.on('error', function (err) {
                    return _this2.onError(err);
                });
            }).on('data', function (data) {
                _this2._totalDownloaded += data.length;
            }).on('error', function (err) {
                return _this2.onError(err);
            });
            // 	this._response.on( 'data', ( data ) =>
            // 	{
            // 		this._totalDownloaded += data.length;
            // 	} );
            // 	this._destStream.on( 'finish', () => this.onFinished() );
            // 	this._response.on( 'error', ( err ) => this.onError( err ) );
            // 	this._destStream.on( 'error', ( err ) => this.onError( err ) );
            // } );
            // this._request.on( 'error', ( err ) => this.onError( err ) );
            // this._request.end();
        }
    }, {
        key: "onProgress",
        value: function onProgress(unit, fn) {
            this._emitter.addListener('progress', function (progress) {
                progress.sample = StreamSpeed.StreamSpeed.convertSample(progress.sample, unit);
                fn(progress);
            });
            return this;
        }
    }, {
        key: "emitProgress",
        value: function emitProgress(progress) {
            this._emitter.emit('progress', progress);
        }
    }, {
        key: "onError",
        value: function onError(err) {
            this.stop();
            this._rejector(err);
            this._promise = null;
        }
    }, {
        key: "onFinished",
        value: function onFinished() {
            this.stop();
            this._state = DownloadHandleState.FINISHED;
            this._resolver();
        }
    }, {
        key: "url",
        get: function get() {
            return this._url;
        }
    }, {
        key: "to",
        get: function get() {
            return this._to;
        }
    }, {
        key: "state",
        get: function get() {
            return this._state;
        }
    }, {
        key: "totalSize",
        get: function get() {
            return this._totalSize;
        }
    }, {
        key: "totalDownloaded",
        get: function get() {
            return this._totalDownloaded;
        }
    }, {
        key: "promise",
        get: function get() {
            var _this3 = this;

            if (!this._promise) {
                this._promise = new _promise2.default(function (resolve, reject) {
                    _this3._resolver = resolve;
                    _this3._rejector = reject;
                });
            }
            return this._promise;
        }
    }]);
    return DownloadHandle;
})();

exports.DownloadHandle = DownloadHandle;
//# sourceMappingURL=index.js.map
