const controller = require('../controller/controller');
const express = require('express');
const authenUser = require('../middleware/authen.user');
const validBody = require('../middleware/valid.body');
const { addItemSchema, addTypeSchema, passwordSchema, addOrderSchema, updateNameSchema, updateItemSchema } = require('../DTO/DTO');
const { uploadFile } = require('../middleware/upload.file');
const route = express.Router();

route.route('/items')
    .get(controller.getAllItem);

route.route('/item')
    .get(controller.getItems)
    .post(authenUser,uploadFile().single('image'),validBody(addItemSchema),controller.addItem);

route.route('/image/:id')
    .post(authenUser, uploadFile().single('image'), controller.updateImage);

route.route('/item/:id')
    .put(authenUser, validBody(updateItemSchema), controller.updateItem)
    .delete(authenUser, controller.deleteItem)
    .get(controller.getItem);

route.route('/type')
    .get(controller.getType)
    .post(authenUser, validBody(addTypeSchema) ,controller.addType);

route.route('/type/:id')
    .all(authenUser)
    .put(validBody(addTypeSchema),controller.updateType)
    .delete(controller.deleteType);

// route.route('/register')
//     .post(controller.createUser);

route.route('/login')
    .post(controller.login);

route.route('/refresh')
    .post(authenUser, controller.refresh);

route.route('/user')
    .get(authenUser, controller.getName);

route.route('/user/password')
    .post(authenUser, validBody(passwordSchema) ,controller.updateUser);

route.route('/user/name')
    .post(authenUser, validBody(updateNameSchema) ,controller.updateUserName);

route.route('/order')
    .all(authenUser)
    .get(controller.getOrders)
    .post(validBody(addOrderSchema),controller.createOrder);

route.route('/order/:id')
    .all(authenUser)
    .put(controller.checkOrder)
    .delete(controller.uncheckOrder);

route.route('/orders')
    .get(authenUser, controller.getAllOrders);

// route.route('/webhook')
//     .get(controller.verifyWebhook)
//     .post(controller.postWebhook);
    
module.exports = route;