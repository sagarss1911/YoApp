'use strict';
let sequelize_mysql = require("../helpers/sequelize-mysql");
let Sequelize = require("sequelize");

const MerchantCashTopupModal = sequelize_mysql.define("merchant_cash_topup_log",
    {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        merchantId: {
            type: Sequelize.INTEGER,
            references: 'users',
            referencesKey: 'id'
        },
        walletId: {
            type: Sequelize.INTEGER,
            references: 'wallet',
            referencesKey: 'id'
        },
        amount: {
            type:Sequelize.NUMBER
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
        tableName: 'merchant_cash_topup_log'
    }
);

module.exports =MerchantCashTopupModal;
