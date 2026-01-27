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

const APP_NAME =
    env.get('APP_NAME')
        .default('Loket')
        .asString();

const EMAIL_HELP =
    env.get('EMAIL_HELP')
        .default('loketlokaalbestuur@vlaanderen.be')
        .asString();

export { EMAIL_FROM, EMAIL_TO, DEBUG, APP_NAME, EMAIL_HELP };