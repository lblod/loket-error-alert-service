import { sparqlEscapeUri as URI, sparqlEscapeString } from 'mu';
import { querySudo as query, updateSudo as update } from '@lblod/mu-auth-sudo';
import config from '../../config';

import { mapQueryResultToClazz } from '../util/sparql-util';
import Email from '../model/email';

class EmailRepository {

  static BASE = config.base + '/emails';

  /**
   * Convenience method to find by {@link Error}
   *
   * @param error
   * @returns {Promise<Error|null>}
   */
  static findOneByError = async function(error) {
    if (!error)
      throw 'error can not be null';
    return EmailRepository.findOneByRef(error.uri);
  };

  /**
   * Tries to find an {@link Email} for the given {@link Email.reference}.
   *
   * @param ref URI of the {@link Email.reference} to be found
   * @returns {Promise<Email|null>}
   */
  static findOneByRef = async function(ref) {
    if (!ref)
      throw 'ref can not be null.';
    const result = mapQueryResultToClazz(await query(`
      PREFIX nmo: <http://www.semanticdesktop.org/ontologies/2007/03/22/nmo#>
      PREFIX mu:  <http://mu.semte.ch/vocabularies/core/>
      PREFIX dct: <http://purl.org/dc/terms/>
      
      SELECT ?uri ?uuid ?folder ?content ?subject ?to ?from ?creator ?references WHERE {
        VALUES ?references { ${URI(ref)} }
        ?uri a nmo:Email ;
             mu:uuid ?uuid ;
             nmo:isPartOf ?folder ;
             nmo:messageSubject ?subject ;
             nmo:htmlMessageContent ?content ;
             nmo:emailTo ?to ;
             nmo:messageFrom ?from ;
             dct:creator ?creator ;
             dct:references ?references .                
      }
    `), Email);
    if (!result)
      return result;
    if (result.length > 1)
      return result[0];
    return result;
  };

  /**
   * Create a new email.
   *
   * @param email
   * @returns {Promise<Email>} the same email as given
   */
  static create = async function(email) {
    const {uri, uuid, folder, subject, content, to, from, creator, reference} = email;
    await update(`
      PREFIX nmo: <http://www.semanticdesktop.org/ontologies/2007/03/22/nmo#>
      PREFIX mu:  <http://mu.semte.ch/vocabularies/core/>
      PREFIX dct: <http://purl.org/dc/terms/>
      
      INSERT DATA {
        GRAPH ${URI(config.graph.email)} {
            ${URI(uri)} a nmo:Email ;
                        mu:uuid ${sparqlEscapeString(uuid)} ;
                        nmo:isPartOf ${URI(folder)} ;
                        nmo:messageSubject ${sparqlEscapeString(subject)} ;
                        nmo:htmlMessageContent ${sparqlEscapeString(content)} ;
                        nmo:emailTo ${sparqlEscapeString(to)} ;
                        nmo:messageFrom ${sparqlEscapeString(from)} ;
                        dct:creator ${URI(creator)} ;
                        dct:references ${URI(reference)} .
        }
      }
    `);
    return email;
  };
}

export default EmailRepository;