import Resource from './resource';

/**
 * Simple Error POJO
 */
class Error extends Resource {

  constructor({uri, uuid, subject, message, stacktrace, created, creator, reference}) {
    super(uri, uuid);
    this.subject = subject;
    this.message = message;
    this.stacktrace = stacktrace;
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
    if(error == null)
      return false
    if(error.subject == null || error.subject === "")
      return false;
    if(error.message == null || error.message === "")
      return false;
    if(error.created == null || error.created === "")
      return false;
    if(error.creator == null || error.creator === "")
      return false;
    return true;
  }
}

export default Error;