'use strict';
let sequelize_mysql = require("../helpers/sequelize-mysql");
let Sequelize = require("sequelize");

const WalletModal = sequelize_mysql.define("walletModal",
    {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: Sequelize.INTEGER
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
            values: ['1', '2','3'],            
            //1 = wallet transfer,2 = wallet to wallet transfer,3 = bank transfer
        },       
        source_user_id: {
            type: Sequelize.INTEGER,            
        },       
        destination_user_id: {
            type: Sequelize.INTEGER,            
        },       
        source_wallet_id: {
            type: Sequelize.INTEGER,              
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

module.exports = WalletModal;

