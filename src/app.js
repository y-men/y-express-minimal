// Security
import helmet from "helmet";
import createError from "http-errors";
import logger from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import express from "express";
import fs from "fs";
import {printTable, Table} from "console-table-printer";
import 'dotenv/config';
import router from "./routes"

// import swaggerUi from "swagger-ui-express";
// import swaggerDocument from "./swagger.json"; zz

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', router);

/* GET home page. */
app.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

app.use(helmet())
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});


//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start server
app.listen( 3000, () =>{
  // Banner and startup message
  const banner = fs.readFileSync('./banner.txt', 'utf8');
  console.log(banner);
  console.log('The server is listening on port: 3000');

  // Display environment
  const p = new Table({
    columns: [
      {name: 'name', alignment: 'left'},
      {name: 'value', alignment: 'left'},
    ],
  });

  const variables = Object.entries(process.env)
                          .map((e) => ({name: e[0], value: e[1]}))
                          .filter(({name}) => name.startsWith("NODEMIN."))
  p.addRows(variables)
  p.printTable()
})


