'use strict';
let sequelize_mysql = require("../helpers/sequelize-mysql");
let Sequelize = require("sequelize");

const UsersModal = sequelize_mysql.define("users",
    {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_unique_id: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING
        },
        username: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,            
        },       
        phone: {
            type: Sequelize.STRING,            
        },       
        customer_id: {
            type: Sequelize.STRING,            
        },   
        facebook_id: {
            type: Sequelize.STRING,            
        },       
        twitter_id: {
            type: Sequelize.STRING,            
        },       
        linkedin_id: {
            type: Sequelize.STRING,            
        },       
        gmail_id: {
            type: Sequelize.STRING,            
        },
        profileimage: {
            type: Sequelize.STRING
        },
        bucketKey: {
            type: Sequelize.STRING
        },       
        region: {
            type: Sequelize.STRING,            
        },       
        password: {
            type: Sequelize.STRING,            
        },       
        dob: {
            type: Sequelize.STRING,            
        },       
        latitude: {
            type: Sequelize.STRING,
            defaultValue: "0"                     
        },       
        longitude: {
            type: Sequelize.STRING,            
            defaultValue: "0"
        },       
        gender: {
            type: Sequelize.INTEGER,            
            defaultValue: 1         
        },       
        isactive: {
            type: Sequelize.INTEGER,
            defaultValue: 1            
        },       
        notification_token: {
            type: Sequelize.STRING,            
        },       
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: ()=>new Date()
        },
        updatedAt: {
            type: Sequelize.DATE,          
            defaultValue: ()=>new Date()
        },
        isVerified: {
            type: Sequelize.INTEGER,           
            defaultValue: 0
        },
        isSound: {
            type: Sequelize.INTEGER,           
            defaultValue: 1
        },
        isVibration: {
            type: Sequelize.INTEGER,           
            defaultValue: 1
        },
        isNotification: {
            type: Sequelize.INTEGER,           
            defaultValue: 1
        },
        isTermsConditionAccepted: {
            type: Sequelize.INTEGER,           
            defaultValue: 1
        },
        language: {
            type: Sequelize.ENUM,
            values: ['1', '2','3','4'],            
        }, 
        balance: {
            type: Sequelize.NUMBER,
            defaultValue: 0            
        }, 
        reference_id: {
            type: Sequelize.STRING        
        }, 
    },
    {
        freezeTableName: true,
        tableName: 'users'
    }
);

module.exports = UsersModal;

