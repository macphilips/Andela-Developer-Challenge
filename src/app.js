import createError from 'http-errors';
import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import Auth from './middlewares/jwt-filter';
import accountRouter from './routes/v1/account';
import entriesRouter from './routes/v1/entries';
import authenticateRouter from './routes/v1/user-jwt-authentication';
import config from './config/config';

const app = express();

if (config.nodeEnv !== 'test') {
  app.use(logger('combined'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(config.cors));

app.use(Auth);
const apiVersion = '/api/v1';
app.use(`${apiVersion}/account`, accountRouter);
app.use(`${apiVersion}/authenticate`, authenticateRouter);
app.use(`${apiVersion}/entries`, entriesRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  const code = err.status || 500;
  res.status(code);
  res.send({ code, message: err.message });
});

module.exports = app;
