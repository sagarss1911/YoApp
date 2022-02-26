'use  strict'



let BadRequestError = require('../../errors/badRequestError'),
    BankModal = require('../../models/Bank_transfer');


let getAllBankDetails = async(body) => {
    let alldetails = await BankModal.findAll()
    return alldetails;
}



module.exports = {
    getAllBankDetails: getAllBankDetails

}