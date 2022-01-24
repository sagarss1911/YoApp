"use strict";
let UserModel = require("../models/Users"),
BadRequestError = require('../errors/badRequestError');


let createCustomer = async (data) => {
	const stripe = require("stripe")(process.env.STRIPE_KEY);
	const customer = await stripe.customers.create(data);
	return customer.id;
};

let ephemeralKeys = async (userid) => {
	let user = await UserModel
	.findOne({ where: { id: userid }, attributes: ['customer_id'] });
	const stripe = require("stripe")(process.env.STRIPE_KEY);
	return stripe.ephemeralKeys.create(
		{ customer: user.customer_id },
		{ apiVersion: process.env.STRIPE_API_VERSION }
	);
	
};

let paymentIntent = async (userid,amount) => {
	try {
	let user = await UserModel
	.findOne({ where: { id: userid }, attributes: ['customer_id'] });
	const stripe = require("stripe")(process.env.STRIPE_KEY);

	return await stripe.paymentIntents.create({
		amount: amount * 100,
		currency: process.env.CURRENCY,
		customer: user.customer_id
	});

}
catch (err) {
	console.log(err.raw.code);
	if(err.raw.code == 'err.raw.code'){
		throw new BadRequestError(err.raw.message);
	}
	throw new BadRequestError(err);
}
};




module.exports = {
	createCustomer: createCustomer,
	ephemeralKeys: ephemeralKeys,
	paymentIntent: paymentIntent
};
