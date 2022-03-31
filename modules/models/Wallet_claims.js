'use strict';
let sequelize_mysql = require("../helpers/sequelize-mysql");
let Sequelize = require("sequelize");

module.exports = sequelize_mysql.define("wallet_claims",
    {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },        
        phone: {
            type: Sequelize.STRING
        },
        reference_id: {
            type: Sequelize.STRING
        },        
        amount: {
            type: Sequelize.STRING,            
        },
        senderWalletId: {
            type: Sequelize.INTEGER,            
        },   
        receiverWalletId: {
            type: Sequelize.INTEGER,           
        },       
        isClaimed: {
            type: Sequelize.INTEGER,            
            defaultValue:0
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
        tableName: 'wallet_claims'
    }
);


