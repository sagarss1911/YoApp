"use strict";

let _ = require("lodash"),
	config = process.config.global_config,
	multer = require("multer"),
	fs = require("fs-promise");

const mime_type = {
	"application/vnd.ms-excel": "csv",
	"application/json": "json",
	"text/csv": "csv",
	"image/png": "png",
	"image/jpg": "jpg",
	"image/jpeg": "jpg",
	"image/gif": "gif",
};

let uploadUserProfileImage = multer({
	storage: multer.diskStorage({
		destination: function (req, file, callback) {			
			callback(null, config.upload_folder + config.upload_entities.user_images);
		},
		filename: function (req, file, callback) {			
			let fileName = Date.now() + Math.round(Math.random() * 10000) + '.' + file.originalname.split(".")[file.originalname.split(".").length - 1]
			callback(null, fileName);
		}
	})
});
	
module.exports = {
	uploadUserProfileImage: uploadUserProfileImage
};
