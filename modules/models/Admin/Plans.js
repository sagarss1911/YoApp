'use strict';
let sequelize_mysql = require("../../helpers/sequelize-mysql");
let Sequelize = require("sequelize");

module.exports =  sequelize_mysql.define("plans",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        planname: { type: String },
        image: { type: String },
        bucketKey: { type: String },
        cash_pickup_limit: { type: String },
        cash_topup_limit: { type: String },
        isDefault: { type: Sequelize.INTEGER,defaultValue:0 },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    },
    {
        freezeTableName: true,
        tableName: 'plans'
    }
);