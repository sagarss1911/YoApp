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
        status: {
            type: Sequelize.ENUM,
            values: ['1', '2','3','4'],            
            //1 = pending,2 = success,3 = failed,4 = cancelled
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

