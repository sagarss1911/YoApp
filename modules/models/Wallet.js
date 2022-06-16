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
            values: ['1', '2','3','4','5','6','7'],            
            //1 = wallet transfer,2 = wallet to wallet transfer,3 = bank transfer,4 = cash pickup,5= recharge, 6 =cash topup by admin,7 = send/request Money
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
        recharge_id: {
            type: Sequelize.INTEGER,              
            references: 'recharges',
            referencesKey: 'id'
        },
        reversed_wallet_recharge_id: {
            type: Sequelize.INTEGER,              
            references: 'wallet',
            referencesKey: 'id'
        },
        claim_id: {
            type: Sequelize.INTEGER,              
            references: 'wallet_claims',
            referencesKey: 'id'
        },
        request_money_id: {
            type: Sequelize.INTEGER,              
            references: 'request_money',
            referencesKey: 'id'
        },
        source_adminId: {
            type: Sequelize.INTEGER,            
        },  
        source_merchantId: {
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
UsersModel.hasMany(WalletModal);
WalletModal.belongsTo(UsersModel,{foreignKey: 'userId', as: 'user_data'});
module.exports = WalletModal;

