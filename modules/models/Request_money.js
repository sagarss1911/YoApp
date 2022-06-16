'use strict';
let sequelize_mysql = require("../helpers/sequelize-mysql");
let Sequelize = require("sequelize");

module.exports = sequelize_mysql.define("request_money",
    {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },        
        source_userId: {
            type: Sequelize.INTEGER,
            references: 'users',
            referencesKey: 'id'
        },
        destination_userId: {
            type: Sequelize.INTEGER,
            references: 'users',
            referencesKey: 'id'
        },
        amount: {
            type: Sequelize.NUMBER
        },      
        source_walletId: {
            type: Sequelize.INTEGER,
            references: 'wallet',
            referencesKey: 'id'
        },
        destination_walletId: {
            type: Sequelize.INTEGER,
            references: 'wallet',
            referencesKey: 'id'
        },
        status: {
            type: Sequelize.ENUM,
            values: ['Pending','Declined','Completed'],  
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: ()=>new Date()
        },
        updatedAt: {
            type: Sequelize.DATE,          
            defaultValue: ()=>new Date()
        }
    },
    {
        freezeTableName: true,
        tableName: 'request_money'
    }
);


