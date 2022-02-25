'use strict';
let sequelize_mysql = require("../helpers/sequelize-mysql");
let Sequelize = require("sequelize");
let UsersModel = require('../models/Users');
const RechargeModal = sequelize_mysql.define("recharges",
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
        walletId: {
            type: Sequelize.INTEGER,
            references: 'wallet',
            referencesKey: 'id'
        },
        
        mobile_no: {
            type: Sequelize.STRING
        },
        selectedplan: {
            type: Sequelize.STRING,            
        },
        benifits: {
            type: Sequelize.STRING,            
        },         
        referenceid: {
            type: Sequelize.STRING,            
        },       
        amount: {
            type: Sequelize.STRING,            
        },
        wholesaleprice: {
            type: Sequelize.DECIMAL,            
        },
        wholesalepricecurrency: {
            type: Sequelize.STRING,            
        },
        retailprice: {
            type: Sequelize.DECIMAL,            
        },
        retailpricecurrency: {
            type: Sequelize.STRING,            
        },
        status: {
            type: Sequelize.ENUM,
            values: ['1', '2','3','4','5','6','7','8'],            
            // 1 = created
            // 2 = confirmed
            // 3=submitted
            // 4=completed
            // 5=reversed
            // 6=rejected
            // 7=cancelled
            // 8=declined
        },       
        transaction_date: {
            type: Sequelize.DATE,            
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
        tableName: 'recharges'
    }
);
UsersModel.hasMany(RechargeModal);
RechargeModal.belongsTo(UsersModel,{foreignKey: 'userId', as: 'user_data'});
module.exports = RechargeModal;

