require('dotenv').config();

const settings = {
   production: [{
      "type": "postgres",
      "url": `$(heroku config:get DATABASE_URL -a your-app)`,
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

module.exports = settings[process.env.NODE_ENV] || settings.development;