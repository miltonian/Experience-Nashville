require('dotenv').config();

const settings = {
   production: [{
      "type": "postgres",
      "url": process.env.DATABASE_URL,
      "ssl": true,
      "logging": ["error"],
      "entities": [
         "src/entity/**/*.ts"
      ],
      "migrations": [
         "src/migration/**/*.ts"
      ],
      "subscribers": [
         "src/subscriber/**/*.ts"
      ],
      "cli": {
         "entitiesDir": "src/entity",
         "migrationsDir": "src/migration",
         "subscribersDir": "src/subscriber"
      }
   }],
   test: [{
   "type": "postgres",
   "host": "127.0.0.1",
   "port": 5432,
   "username": "",
   "password": "",
   "database": "expnash",
   "synchronize": false,
   "logging": ["error"],
   "entities": [
      "src/entity/**/*.ts"
   ],
   "migrations": [
      "src/migration/**/*.ts"
   ],
   "subscribers": [
      "src/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
}]}

module.exports = settings[process.env.NODE_ENV] || settings.test;