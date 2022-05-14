'use strict';
let sequelize_mysql = require("../helpers/sequelize-mysql");
let Sequelize = require("sequelize");

module.exports = sequelize_mysql.define("admin_master",
    {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: Sequelize.STRING,            
        },
        password: {
            type: Sequelize.STRING,
            unique: true            
        },
        token: {
            type: Sequelize.STRING, 
        },
        type: {
            type: Sequelize.INTEGER, 
            defaultValue: 2
        },
        isEnabled: {
            type: Sequelize.INTEGER, 
            defaultValue: 1
        },
        modules: {
            type: Sequelize.STRING, 
        },         
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: ()=>new Date()
        },
        updatedAt: {
            type: Sequelize.DATE,          
            defaultValue: ()=>new Date()
        },
    },
    {
        freezeTableName: true,
        tableName: 'admin_master'
    }
);


