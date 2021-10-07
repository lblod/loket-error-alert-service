import Resource from './resource';

/**
 * Simple Error POJO
 */
class Error extends Resource {

  constructor({uri, uuid, subject, message, detail, created, creator, reference}) {
    super(uri, uuid);
    this.subject = subject;
    this.message = message;
    this.detail = detail;
    this.created = created;
    this.creator = creator;
    this.reference = reference;
  }

  /**
   *
   * Returns the validity of a given {@link Error}.
   *
   * @param error
   * @returns {boolean}
   */
  static isValid = function(error) {
    if(!error)
      return false
    if(!error.subject)
      return false;
    if(!error.message)
      return false;
    if(!error.created)
      return false;
    return error.creator;
  }
}

export default Error;