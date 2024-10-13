import convict from 'convict';
// eslint-disable-next-line camelcase
import convict_format_with_validator from 'convict-format-with-validator';
import dotenv from 'dotenv';

dotenv.config();

convict.addFormats(convict_format_with_validator);

const config = convict({
  port: {
    doc: 'Номер порта для сервера',
    format: 'port',
    default: undefined,
    env: 'DB_PORT',
  },
  dbHost: {
    doc: 'IP-адрес сервера базы данных',
    format: 'ipaddress',
    default: undefined,
    env: 'DB_HOST',
  },
  salt: {
    doc: 'Соль для хеширования паролей',
    format: String,
    default: undefined,
    env: 'SALT',
  },
});

config.validate({ allowed: 'strict' });

export default config;
