'use strict';
let sequelize_mysql = require("../helpers/sequelize-mysql");
let Sequelize = require("sequelize");

module.exports = sequelize_mysql.define("transactional_otp",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: Sequelize.INTEGER,
            references: 'users',
            referencesKey: 'id'
        },
        type: {
            type: Sequelize.INTEGER            
        },
        hash: { type: String },
        otp: { type: String },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    },
    {
        freezeTableName: true,
        tableName: 'transactional_otp'
    }
);





