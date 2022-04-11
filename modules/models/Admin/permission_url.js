'use strict';
let sequelize_mysql = require("../../helpers/sequelize-mysql");
let Sequelize = require("sequelize");

module.exports  =  sequelize_mysql.define("permission_url",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        permission_id :{
            type: Sequelize.INTEGER,
            references: 'permission',
            referencesKey: 'id'
        },
        url: { type: String },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    },
    {
        freezeTableName: true,
        tableName: 'permission_url'
    }
);