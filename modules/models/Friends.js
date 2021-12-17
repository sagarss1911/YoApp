'use strict';
let sequelize_mysql = require("../helpers/sequelize-mysql");
let Sequelize = require("sequelize");
const FriendsModal = sequelize_mysql.define("friends",
    {
        friends_id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        status: {
            type: Sequelize.ENUM,
            values: ['0', '1', '2','3','4'],            
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
        tableName: 'friends'
    }
);
module.exports =FriendsModal;
