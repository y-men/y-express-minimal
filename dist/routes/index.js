"use strict";

var _swaggerJsdoc = _interopRequireDefault(require("swagger-jsdoc"));

var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var express = require('express');

var router = express.Router();

var redis = require("redis");

var client = redis.createClient();
/**
 * Resolve async answer from redis
 * @param key
 * @param method
 * @param vals
 * @returns {Promise<unknown>}
 */

var dbCall = function dbCall() {
  var method = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'get';
  var key = arguments.length > 1 ? arguments[1] : undefined;

  for (var _len = arguments.length, vals = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    vals[_key - 2] = arguments[_key];
  }

  var promise = new Promise(function (resolve, reject) {
    client[method].apply(client, [key].concat(vals, [function (err, reply) {
      if (err) reject(err);else resolve(reply);
    }]));
  });
  return promise;
}; // todo If there is no redis - craches very unelgantly

/**
 * @swagger
 * path:
 *  /cache/{key}:
 *    get:
 *      summary: Get a cache entry by key
 *      parameters:
 *        - in: path
 *          name: key
 *          schema:
 *            type: string
 *          required: true
 *          description: Key of the entry
 *      responses:
 *        "200":
 *          description: An users object
 *          content:
 *            application/json:
 */


router.get('/cache', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    var _req$query, _yield$promise;

    var key, d, promise, value;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            key = (_req$query = req.query) === null || _req$query === void 0 ? void 0 : _req$query.key;
            d = {}; // console.log(`key: ${key}`)

            promise = dbCall('get', key);
            _context.next = 5;
            return promise;

          case 5:
            _context.t1 = _yield$promise = _context.sent;
            _context.t0 = _context.t1 !== null;

            if (!_context.t0) {
              _context.next = 9;
              break;
            }

            _context.t0 = _yield$promise !== void 0;

          case 9:
            if (!_context.t0) {
              _context.next = 13;
              break;
            }

            _context.t2 = _yield$promise;
            _context.next = 14;
            break;

          case 13:
            _context.t2 = "NA";

          case 14:
            value = _context.t2;
            d[key] = value;
            res.json(d);

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
router.post('/cache', /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
    var _req$query2, _yield$promise2;

    var key, body, promise, value;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            key = (_req$query2 = req.query) === null || _req$query2 === void 0 ? void 0 : _req$query2.key;
            body = req.body;
            promise = dbCall('set', key, JSON.stringify(body));
            _context2.next = 5;
            return promise;

          case 5:
            _context2.t1 = _yield$promise2 = _context2.sent;
            _context2.t0 = _context2.t1 !== null;

            if (!_context2.t0) {
              _context2.next = 9;
              break;
            }

            _context2.t0 = _yield$promise2 !== void 0;

          case 9:
            if (!_context2.t0) {
              _context2.next = 13;
              break;
            }

            _context2.t2 = _yield$promise2;
            _context2.next = 14;
            break;

          case 13:
            _context2.t2 = "NA";

          case 14:
            value = _context2.t2;
            res.json("OK: ".concat(value));

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}()); // Swagger set up

var options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Express Minimal",
      version: "1.0.0",
      description: "An Express minimal application"
    },
    servers: [{
      url: "http://localhost:3000/api/cache"
    }]
  },
  apis: ['./routes/index.js']
};
var specs = (0, _swaggerJsdoc["default"])(options);
router.use("/docs", _swaggerUiExpress["default"].serve);
router.get("/docs", _swaggerUiExpress["default"].setup(specs, {
  explorer: true
})); // todo Why does not work, scoping of internal call ? : this.internal_send_command
// function asyncCall(f, key) {
//   const promise = new Promise((resolve, reject) => {
//     try {
//       f(key, (err, reply) => resolve(reply))
//     } catch (e) {
//       reject( e)
//     }
//   })
//   return promise;
// }
//----

module.exports = router;