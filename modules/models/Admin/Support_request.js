'use strict';
let sequelize_mysql = require("../../helpers/sequelize-mysql");
let Sequelize = require("sequelize");

module.exports = sequelize_mysql.define("support_request",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        categoryId :{
            type: Sequelize.INTEGER,
            references: 'support_category',
            referencesKey: 'id'
        },
        userId: {
            type: Sequelize.INTEGER,
            references: 'users',
            referencesKey: 'id'
        },
        text: { type: String },
        status: {
            type: Sequelize.ENUM,
            values: ['0', '1'],
            default: 0
        },   
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    },
    {
        freezeTableName: true,
        tableName: 'support_request'
    }
);




