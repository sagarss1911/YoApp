'use strict';
let sequelize_mysql = require("../helpers/sequelize-mysql");
let Sequelize = require("sequelize");

const CashPickupModal = sequelize_mysql.define("cash_pickup",
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
        name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,            
        },       
        phone: {
            type: Sequelize.STRING,            
        }, 
        amount: {
            type: Sequelize.STRING,            
        },       
        wallet_id: {
            type: Sequelize.INTEGER,
            references: 'wallet',
            referencesKey: 'id'            
        },       
        receiver_id_document: {
            type: Sequelize.STRING,            
        },       
        uploaded_id_document1: {
            type: Sequelize.STRING,            
        },
        uploaded_id_document2: {
            type: Sequelize.STRING
        },
        transaction_id: {
            type: Sequelize.STRING
        },       
        confirmation_pin: {
            type: Sequelize.STRING,            
        },       
        merchant_confirmed_pin: {
            type: Sequelize.STRING,            
        },       
        claimed_by: {
            type: Sequelize.INTEGER,            
        },       
        merchant_wallet_id: {
            type: Sequelize.INTEGER               
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
        tableName: 'cash_pickup'
    }
);

module.exports = CashPickupModal;

