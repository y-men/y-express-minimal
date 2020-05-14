"use strict";

var _helmet = _interopRequireDefault(require("helmet"));

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _morgan = _interopRequireDefault(require("morgan"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _path = _interopRequireDefault(require("path"));

var _express = _interopRequireDefault(require("express"));

var _fs = _interopRequireDefault(require("fs"));

var _consoleTablePrinter = require("console-table-printer");

require("dotenv/config");

var _routes = _interopRequireDefault(require("./routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Security
// import swaggerUi from "swagger-ui-express";
// import swaggerDocument from "./swagger.json";
var app = (0, _express["default"])();
app.set('views', _path["default"].join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use((0, _morgan["default"])('dev'));
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
}));
app.use((0, _cookieParser["default"])());
app.use(_express["default"]["static"](_path["default"].join(__dirname, 'public')));
app.use('/api/v1', _routes["default"]);
/* GET home page. */

app.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});
app.use((0, _helmet["default"])());
app.use(function (req, res, next) {
  next((0, _httpErrors["default"])(404));
});
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
}); //app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Start server

app.listen(3000, function () {
  // Banner and startup message
  var banner = _fs["default"].readFileSync('./banner.txt', 'utf8');

  console.log(banner);
  console.log('The server is listening on port: 3000'); // Display environment

  var p = new _consoleTablePrinter.Table({
    columns: [{
      name: 'name',
      alignment: 'left'
    }, {
      name: 'value',
      alignment: 'left'
    }]
  });
  var variables = Object.entries(process.env).map(function (e) {
    return {
      name: e[0],
      value: e[1]
    };
  }).filter(function (_ref) {
    var name = _ref.name;
    return name.startsWith("NODEMIN.");
  });
  p.addRows(variables);
  p.printTable();
});