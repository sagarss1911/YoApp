'use strict';
let sequelize_mysql = require("../helpers/sequelize-mysql");
let Sequelize = require("sequelize");

const AdminCashTopupModal = sequelize_mysql.define("admin_cash_topup_log",
    {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        adminId: {
            type: Sequelize.INTEGER,
            references: 'admin_master',
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
        tableName: 'admin_cash_topup_log'
    }
);

module.exports =AdminCashTopupModal;
