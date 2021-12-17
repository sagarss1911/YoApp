'use strict';
let sequelize_mysql = require("../helpers/sequelize-mysql");
let Sequelize = require("sequelize");

const UpdatesModal = sequelize_mysql.define("updates",
    {
        updates_id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        text: {
            type: Sequelize.STRING,            
        },  
        friend_one: {
            type: Sequelize.INTEGER,
                
        },      
        friend_two: {
            type: Sequelize.INTEGER,
                  
        },              
    },
    {
        freezeTableName: true,
        tableName: 'updates'
    }
);

module.exports =UpdatesModal;
