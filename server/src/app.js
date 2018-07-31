import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import AuthenticationMiddleware from './middlewares/jwt-filter';
import accountRouter from './routes/v1/account';
import entriesRouter from './routes/v1/entries';
import reminderRouter from './routes/v1/reminder';
import authenticateRouter from './routes/v1/user-jwt-authentication';
import config from './config/config';
import db from './db';
import path from "path";

// process.on('unhandledRejection', (error) => {
//   // Will print "unhandledRejection err is not defined"
//   console.log('unhandledRejection', error);
// });
// eslint-disable-next-line import/prefer-default-export
export const app = express();

const pathToSwaggerUi = path.join(__dirname, '../../../api-doc/dist');
console.log('API path => ', pathToSwaggerUi);
app.use('/docs/api/v1', express.static(pathToSwaggerUi));

if (config.nodeEnv !== 'test') {
  db.init().then();
  app.use(logger('combined'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(config.cors));


app.use(AuthenticationMiddleware.doFilter);
const apiVersion = '/api/v1';
app.use(`${apiVersion}/account`, accountRouter);
app.use(`${apiVersion}/account`, reminderRouter);
app.use(`${apiVersion}/auth`, authenticateRouter);
app.use(`${apiVersion}/entries`, entriesRouter);

// catch 404 and forward to error handler

// catch 404
app.use((req, res) => {
  res.status(404).send({ status: 404, error: 'Not found' });
});

// catch errors
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  const code = err.status || 500;
  res.status(code);
  res.send({ code, message: err.message });
});
