'use strict';
let sequelize_mysql = require("../helpers/sequelize-mysql");
let Sequelize = require("sequelize");

module.exports = sequelize_mysql.define("country",
    {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },        
        name: {
            type: Sequelize.STRING
        },
        iso_code_2: {
            type: Sequelize.STRING
        },
        iso_code_3: {
            type: Sequelize.STRING
        },
        isd_code: {
            type: Sequelize.STRING
        },
    },
    {
        freezeTableName: true,
        tableName: 'country'
    }
);


