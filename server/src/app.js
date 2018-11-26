import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import path from 'path';
import AuthenticationMiddleware from './middlewares/jwtFilter';
import accountRouter from './routes/v1/accountRouter';
import entriesRouter from './routes/v1/entriesRouter';
import reminderRouter from './routes/v1/reminderRouter';
import authenticateRouter from './routes/v1/authenticationRouter';
import config from './config/config';
import db from './db';
import ScheduleTask from './task';

// eslint-disable-next-line import/prefer-default-export
export const app = express();

const pathToSwaggerUi = path.join(__dirname, '../../../api-doc/dist');
const client = path.join(__dirname, '../../../client/dist');
const apiVersion = '/api/v1';

app.use('/docs/api/v1', express.static(pathToSwaggerUi));

if (config.nodeEnv !== 'test') {
  db.init()
    .then(() => {
      const task = new ScheduleTask();
      task.init();
    });
  app.use(logger('combined'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(config.cors));


app.use(AuthenticationMiddleware.doFilter);
app.use(`${apiVersion}/account`, accountRouter);
app.use(`${apiVersion}/account`, reminderRouter);
app.use(`${apiVersion}/auth`, authenticateRouter);
app.use(`${apiVersion}/entries`, entriesRouter);

app.use(express.static(client));
app.use('/', (req, res) => {
  const resolve = path.resolve(__dirname, '../../../client/dist/index.html');
  res.sendFile(resolve);
});

app.use((req, res) => {
  res.status(404)
    .send({
      status: 404,
      error: 'Not found'
    });
});
