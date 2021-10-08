import env from 'env-var';

let EMAIL_FROM;
let EMAIL_TO;

try {
  EMAIL_FROM =
      env.get('EMAIL_FROM')
         .required()
         .asString();
  EMAIL_TO =
      env.get('EMAIL_TO')
         .required()
         .asString();
} catch (e) {
  console.warn('Required environment variable was not found:')
  console.warn(e);
  process.exit();
}

const DEBUG =
    env.get('DEBUG')
       .default('false')
       .asBool();

export { EMAIL_FROM, EMAIL_TO, DEBUG };