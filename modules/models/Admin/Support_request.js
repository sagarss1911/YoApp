'use strict';
let sequelize_mysql = require("../../helpers/sequelize-mysql");
let Sequelize = require("sequelize");
let CategoryModel = require('../Admin/Support_category');
let UserModel = require('../Users');

const RequestModel =  sequelize_mysql.define("support_request",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        supportCategoryId :{
            type: Sequelize.INTEGER,
            references: 'support_category',
            referencesKey: 'id'
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

CategoryModel.hasMany(RequestModel);
RequestModel.belongsTo(CategoryModel,{foreignKey: 'supportCategoryId', as: 'Category'});
RequestModel.belongsTo(UserModel,{foreignKey: 'userId', as: 'Users'});

module.exports = RequestModel;


