'use strict';
let sequelize_mysql = require("../helpers/sequelize-mysql");
let Sequelize = require("sequelize");
let CategoryModel = require('../models/Support_category');

const RequestModal = sequelize_mysql.define("support_request",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        categoryId :{
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {         // catid belongsTo category 1:1
                model: 'CategoryModel',
                key: 'id'
            }
        },
        userId: {
            type: Sequelize.INTEGER,
            references: 'users',
            referencesKey: 'id'
        },
        text: { type: String },
        status: {
            type: Sequelize.ENUM,
            values: ['0', '1'],
            default: 0
        },   
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    },
    {
        freezeTableName: true,
        tableName: 'support_request'
    }
);
CategoryModel.hasMany(RequestModal);
RequestModal.belongsTo(CategoryModel,{foreignKey: 'categoryId', as: 'support_category'});

module.exports = RequestModal;




