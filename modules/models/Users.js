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
        customer_id: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,            
        },
        phone: {
            type: Sequelize.STRING,
            unique: true            
        },
        countrycode: {
            type: Sequelize.STRING, 
        },
        countryname: {
            type: Sequelize.STRING, 
        },        
        device_id: {
            type: Sequelize.STRING, 
        },
        socialtoken: {
            type: Sequelize.STRING
        },        
        currency: {
            type: Sequelize.STRING
        },
        dob: {
            type: Sequelize.STRING
        },
        dobformatted: {
            type: Sequelize.STRING
        },        
        latitude : {
            type: Sequelize.STRING
        },
        longitude : {
            type: Sequelize.STRING
        },
        gender : {
            type: Sequelize.STRING
        },        
        isactive: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        notification: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        }, 
        minage: {
            type: Sequelize.INTEGER,            
        },
        maxage: {
            type: Sequelize.INTEGER,            
        },
        shopping: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }, 
        cooking: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }, 
        reading: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }, 
        party: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }, 
        pets: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }, 
        sports: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }, 
        gaming: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }, 
        travel: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }, 
        cinema: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },    
        title :{
            type: Sequelize.STRING,            
        },
        sunsign :{
            type: Sequelize.STRING,            
        },    
        height :{
            type: Sequelize.STRING,            
        },
        mother_tongue :{
            type: Sequelize.STRING,            
        },
        marital_status :{
            type: Sequelize.STRING,            
        },
        faith :{
            type: Sequelize.STRING,            
        },
        community :{
            type: Sequelize.STRING,            
        },
        drinking :{
            type: Sequelize.STRING,            
        },
        smoking :{
            type: Sequelize.STRING,            
        },
        settle_down :{
            type: Sequelize.STRING,            
        },
        kids :{
            type: Sequelize.STRING,            
        },
        diet :{
            type: Sequelize.STRING,            
        },
        categories :{
            type: Sequelize.STRING,            
        },
        field_of_study :{
            type: Sequelize.STRING,            
        },
        qualification :{
            type: Sequelize.STRING,            
        },
        industry :{
            type: Sequelize.STRING,            
        },
        experience :{
            type: Sequelize.STRING,            
        },
        income :{
            type: Sequelize.STRING,            
        },
        interested_in  :{
            type: Sequelize.INTEGER,            
        },
        email_setting :{
            type: Sequelize.INTEGER, 
            defaultValue: 1           
        },
        sms_setting :{
            type: Sequelize.INTEGER,   
            defaultValue: 1         
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

