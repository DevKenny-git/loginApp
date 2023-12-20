const joi = require("joi");

const registerValidation = joi.object({
    username: joi.string().required(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    password: joi.string().required().min(6),
    email: joi.string().email().required()
});

const otpValidation = joi.object({
    otp: joi.number().required()
})


const loginValidation = joi.object({
    username: joi.string().required(),
    password: joi.string().required().min(6)
})

module.exports = {
    registerValidation,
    otpValidation,
    loginValidation
}