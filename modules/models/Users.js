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
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,            
        },       
        phone: {
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
    },
    {
        freezeTableName: true,
        tableName: 'users'
    }
);

module.exports = UsersModal;

