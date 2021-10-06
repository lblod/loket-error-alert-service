/**
 * Will take a SPARQL query-result and map the bindings to the given Class.
 *
 * @param result
 * @param clazz
 *
 * @returns [Class] | Class | null
 */
export const mapQueryResultToClazz = ({head, results}, clazz) => {
  if (!head)
    throw 'virtuoso query-result did not contain a head, cannot map.';
  if (!head.vars || head.vars.length === 0)
    throw 'virtuoso query-result did not contain any vars, cannot map.';

  if (!results || !results.bindings || results.bindings.length === 0)
    return null;

  let result = results.bindings.map(binding => {
    const map = {};
    head.vars.forEach(variable => {
      map[variable] = binding[variable] && binding[variable].value;
    });
    return new clazz(map);
  });

  if (result.length === 1)
    return result[0];
  return result;
};

export const deriveUUIDFromURI = (uri) => {
  let split = uri.split("/");
  return split[split.length - 1];
};