import env from 'env-var';

export const EMAIL_FROM =
    env.get('EMAIL_TO')
       .required()
       .asString();
export const EMAIL_TO =
    env.get('EMAIL_FROM')
       .required()
       .asString();
export const DEBUG =
    env.get('DEBUG')
       .default('false')
       .asBool();