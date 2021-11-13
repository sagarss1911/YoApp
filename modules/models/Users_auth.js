'use strict';
let sequelize_mysql = require("../helpers/sequelize-mysql");
let Sequelize = require("sequelize");

module.exports = sequelize_mysql.define("users_auth",
    {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userid: {
            type: Sequelize.INTEGER,
            references: 'users',
            referencesKey: 'id'
        },
        token: {
            type: Sequelize.STRING
        },
        otp: {
            type: Sequelize.INTEGER
        },
        createdAt: {
            type: Sequelize.DATE,
            field: 'created_at',
            defaultValue: ()=>new Date()
        },
        updatedAt: {
            type: Sequelize.DATE,
            field: 'updated_at',
            defaultValue: ()=>new Date()
        },
    },
    {
        freezeTableName: true,
        tableName: 'users_auth'
    }
);


