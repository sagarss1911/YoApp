'use strict';
let sequelize_mysql = require("../helpers/sequelize-mysql");
let Sequelize = require("sequelize");

const MerchantWalletModal = sequelize_mysql.define("merchant_wallet",
    {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: Sequelize.INTEGER            
        },
        ordertype: {
            type: Sequelize.INTEGER            
        },
        cashpickupId:{
            type: Sequelize.INTEGER
        },          
        bank_transfer_id:{
            type: Sequelize.INTEGER
        },    
        amount: {
            type: Sequelize.NUMBER,            
        },
        trans_id: {
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
        tableName: 'merchant_wallet'
    }
);

module.exports = MerchantWalletModal;

