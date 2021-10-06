import bodyParser from 'body-parser';

import { app, errorHandler } from 'mu';
import config from './config';
import ResourceExistsError from './src/error/resource-exists-error';

import ErrorRepository from './src/repository/error-repository';
import EmailRepository from './src/repository/email-repository';
import EmailFactory from './src/factory/email-factory';
import Delta from './src/model/delta';

import { DEBUG } from './env';
import AlertService from './src/service/alert-service';
import DeltaService from './src/service/delta-service';

if (DEBUG)
  console.debug('Config:', config);

app.use(bodyParser.json());

/**
 * Hello World.
 */
app.get('/', function(req, res) {
  res.send('Hello, you\'ve reached the loket-error-alert-service. Leave a message after the beep. *beeep*');
});

/**
 * Process incoming delta's, send alerts accordingly.
 */
app.post('/delta', (req, res) => {
  let errorURIs = new Delta(req.body).getInsertsFor(
      'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
      'http://open-services.net/ns/core#Error');

  if (!errorURIs.length) {
    console.log('Delta dit not contain any errors, awaiting the next batch!');
    return res.status(204).send();
  }

  // NOTE: to prevent missing delta's, we do not await the processing of the previous batch.
  DeltaService.process(errorURIs)
              .catch(e => {
                console.log(`Something went wrong while processing delta`);
                console.error(e);
              });

  console.log('Started processing delta, awaiting the next batch!');
  return res.status(204).send().end();
});

/**
 * Create an alert for the given {@link Error}.
 * Only {@link Email} for now.
 */
app.post('/alert', async (req, res, next) => {
  const {body} = req;

  if (!body.ref)
    res.status(422).send({errors: [{description: 'body needs to contain a ref to the error.'}]});

  try {
    const error = await ErrorRepository.findByURI(body.ref);
    if (!error)
      return res.status(404).send({errors: [{description: `could not retrieve error for <${body.ref}>`}]});

    const email = await AlertService.create(error);
    res.status(200).send({uri: email.uri});
  } catch (e) {
    if (e instanceof ResourceExistsError)
      return res.status(202).send({ref: e.resource.uri});
    console.error(e);
    return next(e);
  }
});

app.use(errorHandler);