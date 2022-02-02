'use strict';
let sequelize_mysql = require("../helpers/sequelize-mysql");
let Sequelize = require("sequelize");
let UsersModel = require('../models/Users');
const WalletModal = sequelize_mysql.define("walletModal",
    {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: Sequelize.INTEGER,
            references: 'users',
            referencesKey: 'id'
        },
        order_date: {
            type: Sequelize.DATE
        },
        trans_id: {
            type: Sequelize.STRING
        },
        client_secret: {
            type: Sequelize.STRING,            
        },
        amount: {
            type: Sequelize.STRING,            
        },         
        amountpaid: {
            type: Sequelize.STRING,            
        },       
        payment_method: {
            type: Sequelize.STRING,            
        },   
        txn_initiate_date: {
            type: Sequelize.STRING,            
        },       
        txn_completion_date: {
            type: Sequelize.STRING,            
        },       
        order_status: {
            type: Sequelize.STRING,            
        },       
        refundid: {
            type: Sequelize.STRING,            
        },       
        refundamount: {
            type: Sequelize.STRING,            
        },
        refundtime: {
            type: Sequelize.STRING
        },
        refundstatus: {
            type: Sequelize.STRING
        },
        currency: {
            type: Sequelize.STRING
        },       
        ordertype: {
            type: Sequelize.ENUM,
            values: ['1', '2','3','4'],            
            //1 = wallet transfer,2 = wallet to wallet transfer,3 = bank transfer,4 = cash pickup
        },       
        source_userId: {
            type: Sequelize.INTEGER,            
        },       
        destination_userId: {
            type: Sequelize.INTEGER,            
        },       
        source_wallet_id: {
            type: Sequelize.INTEGER,              
        }, 
        cashpickupId: {
            type: Sequelize.INTEGER,              
            references: 'cash_pickup',
            referencesKey: 'id'
        },       
        bank_transfer_id: {
            type: Sequelize.INTEGER,              
            references: 'bank_transfer',
            referencesKey: 'id'
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
        tableName: 'wallet'
    }
);
UsersModel.hasMany(WalletModal);
WalletModal.belongsTo(UsersModel,{foreignKey: 'userId', as: 'user_data'});
module.exports = WalletModal;

