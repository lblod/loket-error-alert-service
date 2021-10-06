import ResourceExistsError from '../error/resource-exists-error';
import EmailFactory from '../factory/email-factory';
import EmailRepository from '../repository/email-repository';

class AlertService {

  /**
   * Create an alert for the given {@link Error}
   *
   * @param error
   * @returns {Promise<Email>}
   * @throws ResourceExistsError if an alert for the given {@link Error} was already created.
   */
  static create = async function(error) {
    let email = await EmailRepository.findOneByError(error);
    if (email)
      throw new ResourceExistsError('Alert for error has already been created before.', email);
    return await EmailRepository.create(EmailFactory.forError(error));
  };
}

export default AlertService;