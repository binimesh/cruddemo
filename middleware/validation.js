const joi = require("joi");

function registrationValidation(data) {
    const schema = joi.object({
        firstName: joi.string().min(4).required(),
        lastName: joi.string().min(4).required(),
        email: joi.string().min(6).email().required(),
        password: joi.string().min(4).required(),
    });
    return schema.validate(data);
}

function login(data) {
    const schema = joi.object ({
        email: joi.string().min(6).email().required(),
        password: joi.string().min(4).required(),
    });
    return schema.validate(data);
}

module.exports = {registrationValidation,login};