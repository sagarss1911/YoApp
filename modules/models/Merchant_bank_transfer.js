'use strict';
let sequelize_mysql = require("../helpers/sequelize-mysql");
let Sequelize = require("sequelize");

const CashPickupModal = sequelize_mysql.define("merchant_bank_transfer",
    {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        sender_userId: {
            type: Sequelize.INTEGER,
            references: 'users',
            referencesKey: 'id'
        },
        wallet_id:{
            type: Sequelize.INTEGER,
            references: 'wallet',
            referencesKey: 'id'
        },
        name: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING,            
        },       
        phone: {
            type: Sequelize.STRING,            
        },               
        amount: {
            type: Sequelize.NUMBER,            
        },       
        bank_name: {
            type: Sequelize.STRING,            
        },       
        bank_account: {
            type: Sequelize.STRING,            
        }, 
        status: {
            type: Sequelize.STRING,            
            defaultValue: 'pending'
        },              
        country: {
            type: Sequelize.STRING,            
        },
        transaction_id:{
            type: Sequelize.STRING,
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
        tableName: 'merchant_bank_transfer'
    }
);

module.exports = CashPickupModal;

