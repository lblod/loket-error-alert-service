import config from '../../config';
import ErrorRepository from '../repository/error-repository';
import Error from '../model/error';
import AlertService from './alert-service';

class DeltaService {

  /**
   * Process the given list of uri's
   *
   * @param uris
   * @returns {Promise<void>}
   */
  static process = async function(uris) {
    let errors = await Promise.all(uris.map(uri => ErrorRepository.findByURI(uri)));

    const ignored = errors.filter(error => !Error.isValid(error));
    if (ignored.length !== 0) {
      console.warn(
          `[WARN] ${ignored.length} uri's will be ignored. Either they don't exist, are not errors or are malformed.`);
    }

    errors = errors.filter(error => Error.isValid(error));
    if (config.creators.length > 0)
      errors = errors.filter(error => config.creators.includes(error.creator));

    if (errors.length === 0)
      return console.log('Delta did not contain anything of interest, nothing should happen.');

    await Promise.allSettled(errors.map(error => AlertService.create(error)));
    console.log('Processed delta, sent out alerts.');
  };
}

export default DeltaService;