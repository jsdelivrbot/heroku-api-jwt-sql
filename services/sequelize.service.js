'use strict';

const Sequelize = require('sequelize');

module.exports = {

    connect: function() {
        let sequelize;
        if (process.env.CLEARDB_DATABASE_URL) {
            console.log(process.env.CLEARDB_DATABASE_URL);
            return sequelize = require('sequelize-heroku');
        }
        if (!process.env.CLEARDB_DATABASE_URL) {
            // Set here local database connection
            process.env.CLEARDB_DATABASE_URL='mysql://root:@localhost:3306/node_api';
        }

        let userOptions, dbOptions, config;
        // Look for ClearDB MySQL Add-on
        if (process.env.CLEARDB_DATABASE_URL) {
            userOptions = process.env.CLEARDB_DATABASE_URL.split('@')[0].split('//')[1].split(':');
            dbOptions = process.env.CLEARDB_DATABASE_URL.split('@')[1].split('/');

            config = {
                user: userOptions[0],
                pass: userOptions[1],
                base: dbOptions[1],
                options: {
                    dialect: 'mysql',
                    protocol: 'mysql',
                    host: dbOptions[0].split(':')[0],
                    port: dbOptions[0].split(':')[1],
                    logging: false,
                    dialectOptions: {
                        ssl: false
                    }
                }
            };
        }
        
        // Else, lookf for Heroky Postgresql
        else if (process.env.DATABASE_URL) {
            userOptions = process.env.DATABASE_URL.split('@')[0].split('//')[1].split(':');
            dbOptions = process.env.DATABASE_URL.split('@')[1].split('/');
            
            config = {
                user: userOptions[0],
                pass: userOptions[1],
                base: dbOptions[1],
                options: {
                    dialect: 'postgres',
                    protocol: 'postgres',
                    host: dbOptions[0].split(':')[0],
                    port: dbOptions[0].split(':')[1],
                    logging: false,
                    dialectOptions: {
                        ssl: true
                    }
                }
            };
        }
        
        if (typeof config !== 'undefined') {
            return new Sequelize(config.base, config.user, config.pass, config.options);
        }
        
        return false;
    }
};
