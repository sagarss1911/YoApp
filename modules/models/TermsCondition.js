'use strict';
let sequelize_mysql = require("../helpers/sequelize-mysql");
let Sequelize = require("sequelize");

module.exports = sequelize_mysql.define("termscondition",
    {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING
        },        
        text: {
            type: Sequelize.STRING
        },
        displayorder: {
            type: Sequelize.INTEGER,
            defaultValue: 0            
        }
    },
    {
        freezeTableName: true,
        tableName: 'termscondition'
    }
);


