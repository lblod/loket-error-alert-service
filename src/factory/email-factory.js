import fs from 'fs';
import handlebars from 'handlebars';

import { uuid } from 'mu';
import config from '../../config';
import { EMAIL_FROM, EMAIL_TO, APP_NAME, EMAIL_HELP } from '../../env';

import EmailRepository from '../repository/email-repository';
import Email from '../model/email';

const ERROR_TEMPLATE = './app/template/error.hbs';

class EmailFactory {

  /**
   * Creates a new {@link Email} for an {@link Error}
   *
   * @param error the {@link Error}
   * @returns {Email}
   */
  static forError = function({uri: errorURI, subject, message, detail, created, reference}) {
    const template = handlebars.compile(fs.readFileSync(ERROR_TEMPLATE, 'utf8'));
    const content = template({subject, message, detail, reference, appName: APP_NAME, emailHelp: EMAIL_HELP});
    const id = uuid()
    const uri = EmailRepository.BASE + '/' + id;
    return new Email({
      uri,
      uuid: id,
      folder: config.email.folder,
      subject: `[ALERT] ${created.toISOString()} | ${subject} `,
      content,
      to: EMAIL_TO,
      from: EMAIL_FROM,
      creator: config.service.uri,
      reference: errorURI
    });
  };
}

export default EmailFactory;