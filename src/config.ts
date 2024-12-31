import convict from 'convict';
import ipaddress from 'convict-format-with-validator';
import dotenv from 'dotenv';

dotenv.config();

convict.addFormats(ipaddress);

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
  dbUri: {
    doc: 'MongoDB URI',
    format: String,
    default: 'mongodb://localhost:27017/database',
    env: 'DB_URI',
  },
  uploadsDirectory: {
    doc: 'Путь к директории, где хранятся загружаемые файлы',
    format: String,
    default: 'uploads',
    env: 'UPLOADS_DIRECTORY'
  },
  jwtSecret: {
    doc: 'JWT Secret Key',
    format: String,
    default: 'supersecret',
    env: 'JWT_SECRET'
  }
});

config.validate({ allowed: 'strict' });

export default config;
