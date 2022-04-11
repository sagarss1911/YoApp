'use strict';
let sequelize_mysql = require("../../helpers/sequelize-mysql");
let Sequelize = require("sequelize");

module.exports =  sequelize_mysql.define("permission",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: { type: String },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    },
    {
        freezeTableName: true,
        tableName: 'permission'
    }
);