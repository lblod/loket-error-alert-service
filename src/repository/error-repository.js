import { sparqlEscapeUri as URI } from 'mu';
import { querySudo as query } from '@lblod/mu-auth-sudo';

import Error from '../model/error';
import { parseResultToClazz } from '../util/sparql-util';

class ErrorRepository {

  /**
   * Tries to find an {@link Error} for the given URI.
   *
   * @param uri URI of the {@link Error} to be found
   * @returns {Promise<Error|null>}
   */
  static findByURI = async function(uri) {
    if (!uri)
      throw 'uri can not be null.';
    const result = parseResultToClazz(await query(`
      PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
      PREFIX oslc: <http://open-services.net/ns/core#>
      PREFIX dct: <http://purl.org/dc/terms/>
      
      SELECT ?uri ?uuid ?subject ?message ?detail ?created ?creator ?reference WHERE {
        VALUES ?uri { ${URI(uri)} }
        ?uri a oslc:Error ;
             mu:uuid ?uuid ;
             dct:subject ?subject ;
             oslc:message ?message ;
             dct:created ?created ;
             dct:creator ?creator .
        OPTIONAL { ?uri dct:references ?reference . }                 
        OPTIONAL { ?uri oslc:largePreview ?detail . }                 
      }
    `), Error);
    if (!result)
      return result;
    if (result.length > 1)
      throw `multiple results exists while doint lookup on URI <${uri}>, data corrupt?`;
    return result;
  };
}

export default ErrorRepository;