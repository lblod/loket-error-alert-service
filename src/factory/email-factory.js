import fs from 'fs';
import handlebars from 'handlebars';

import { uuid } from 'mu';
import config from '../../config';
import { EMAIL_FROM, EMAIL_TO } from '../../env';

import EmailRepository from '../repository/email-repository';
import Email from '../model/email';

import { deriveUUIDFromURI } from '../util/sparql-util';

const ERROR_TEMPLATE = './app/template/error.hbs';

class EmailFactory {

  /**
   * Creates a new {@link Email} for an {@link Error}
   *
   * @param error the {@link Error}
   * @returns {Email}
   */
  static forError = function({uri: errorURI, subject, message, stacktrace, created, reference}) {
    const template = handlebars.compile(fs.readFileSync(ERROR_TEMPLATE, 'utf8'));
    const content = template({subject, message, stacktrace, reference});
    const uri = EmailRepository.BASE + '/' + uuid();
    return new Email({
      uri,
      uuid: deriveUUIDFromURI(uri),
      folder: config.email.folder,
      subject: `[ERROR] ${subject} | ${created.toISOString()}`,
      content,
      to: EMAIL_TO,
      from: EMAIL_FROM,
      creator: config.service.uri,
      reference: errorURI
    });
  };
}

export default EmailFactory;