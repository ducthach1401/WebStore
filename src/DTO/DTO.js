const Joi = require("joi");

module.exports.loginSchema = Joi.object({
    username: Joi.string().required().max(30),
    password: Joi.string().required().max(30).min(8)
});

module.exports.addItemSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    cost: Joi.number().required().min(1),
    type: Joi.string().required()
});

module.exports.addTypeSchema = Joi.object({
    type: Joi.string().required()
});

module.exports.passwordSchema = Joi.object({
    password: Joi.string().required().min(8).max(30)
});

module.exports.addOrderSchema = Joi.object({
    nameUser: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    goods: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        quantity: Joi.number().required().min(1),
        cost: Joi.number().required().min(1),
    })).required()
});

module.exports.updateNameSchema = Joi.object({
    name: Joi.string().required().min(3)
});