/* eslint-disable no-tabs,indent */

import createError from 'http-errors';
import express from 'express';
import logger from 'morgan';
import accountRouter from './routes/v1/account';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const apiVersion = '/api/v1';
app.use(`${apiVersion}/account`, accountRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});
// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  const code = err.status || 500;
  res.status(code);
  res.send({code, message: err.message});
});

module.exports = app;
