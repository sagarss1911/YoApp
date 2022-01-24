'use strict';
let sequelize_mysql = require("../helpers/sequelize-mysql");
let Sequelize = require("sequelize");

module.exports = sequelize_mysql.define("balance_log",
    {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },        
        user_id: {
            type: Sequelize.STRING
        },
        amount: {
            type: Sequelize.NUMBER
        },
        oldbalance: {
            type: Sequelize.NUMBER
        },
        newbalance: {
            type: Sequelize.NUMBER
        },
        wallet_id: {
            type: Sequelize.INTEGER,
            references: 'wallet',
            referencesKey: 'id'
        },
        transaction_type: {
            type: Sequelize.ENUM,
            values: ['1', '2','3','4'],   //1 credit, 2=debit    
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
        tableName: 'balance_log'
    }
);


