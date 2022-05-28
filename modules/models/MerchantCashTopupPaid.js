'use strict';
let sequelize_mysql = require("../helpers/sequelize-mysql");
let Sequelize = require("sequelize");

const UsersModal = sequelize_mysql.define("merchant_cash_topup_paid",
    {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        merchant_id: {
            type: Sequelize.INTEGER
        },
        admin_id: {
            type: Sequelize.INTEGER
        },
        amount_due: {
            type: Sequelize.DECIMAL,            
        },
        amount_paid: {
            type: Sequelize.DECIMAL,            
        },
        total_pending: {
            type: Sequelize.DECIMAL,            
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: ()=>new Date()
        },
        updatedAt: {
            type: Sequelize.DATE,          
            defaultValue: ()=>new Date()
        },
    },
    {
        freezeTableName: true,
        tableName: 'merchant_cash_topup_paid'
    }
);

module.exports = UsersModal;

