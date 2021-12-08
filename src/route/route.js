const controller = require('../controller/controller');
const express = require('express');
const authenUser = require('../middleware/authen.user');
const validBody = require('../middleware/valid.body');
const { addItemSchema, addTypeSchema, passwordSchema } = require('../DTO/DTO');
const multer = require('multer');
const maxSize = 5 * 1024 * 1024;
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, 'public/upload');
    },
    filename: function (req, file, callback) {
      callback(null, file.originalname);
    },
    onFileUploadStart: function(file, req, res){
      if(req.files.file.length > maxSize) {
        return false;
      }
    }  
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: maxSize
    }
})
const route = express.Router();

route.route('/items')
    .get(controller.getAllItem);

route.route('/item')
    .get(controller.getItems)
    .post(authenUser, validBody(addItemSchema),controller.addItem);

route.route('/item/:id')
    .put(authenUser, validBody(addItemSchema), controller.updateItem)
    .delete(authenUser, controller.deleteItem)
    .get(controller.getItem);

route.route('/type')
    .get(controller.getType)
    .post(authenUser, validBody(addTypeSchema) ,controller.addType);

route.route('/type/:id')
    .all(authenUser)
    .put(validBody(addTypeSchema),controller.updateType)
    .delete(controller.deleteItem);

// route.route('/register')
//     .post(controller.createUser);

route.route('/login')
    .post(controller.login);

route.route('/refresh')
    .post(authenUser, controller.refresh);

route.route('/password')
    .post(authenUser, validBody(passwordSchema) ,controller.updateUser);

module.exports = route;