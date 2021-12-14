const Model = require('../model/model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Type = Model.Type;
const Item = Model.Item;
const User = Model.User;
const Order = Model.Order;
const cloudinary = require('cloudinary').v2;
const fetch = require('node-fetch');
require('dotenv').config();

module.exports.getItemAll = async () => {
    try {
        const result = await Item.find();
        // for (let item of result){
        //     item.image = cloudinary.image('store/' + item._id);
        //     console.log(item.image);
        // }
        return {
            message: 'Success',
            result: result
        }
    } catch (error) {
        throw error;
    }
}

module.exports.getItems = async (data) => {
    try {
        const result = await Item.find(data);
        return {
            message: 'Success',
            result: result
        }
    } catch (error) {
        throw error;
    }
}

module.exports.getTypeAll = async () => {
    try {
        const result = await Type.find();
        return {
            message: 'Success',
            result: result
        }
    } catch (error) {
        throw error;
    }
}

module.exports.addType = async (data) => {
    try {
        const type = new Type(data);
        await type.save();
        return {
            message: 'Success'
        }
    } catch (error) {
        
    }
}

module.exports.addItem = async (data, image) => {
    try {
        const check = await Type.find({
            type: data.type
        });
        if (!check){
            return {
                message: 'Not found type of item'
            }
        }
        const item = new Item(data);
        const timestamp = Math.round(Date.now() /1000);
        const temp = cloudinary.utils.api_sign_request(timestamp, process.env.API_SECRET);
        const url = item._id + '/' +new Date().getTime();
        const upload = cloudinary.uploader.upload(image.path, {public_id: url , folder: "store"}, (err) => {
            if (err) {
                throw err;
            }
        });
        const urlLink = cloudinary.url('store/' + url);
        item.link = urlLink;
        await item.save();
        return {
            message: 'Success'
        }
    } catch (error) {
        throw error;
    }
}

module.exports.updateImage = async (filter, image) => {
    const timestamp = Math.round(Date.now() /1000);
    const temp = cloudinary.utils.api_sign_request(timestamp, process.env.API_SECRET);
    const url = filter._id + '/' +new Date().getTime();
    const upload = cloudinary.uploader.upload(image.path, {public_id:  url, folder: "store"}, (err) => {
        if (err) {
            throw err;
        }
    });
    const item = await Item.findOne(filter);
    const urlLink = cloudinary.url('store/' + url);
    item.link = urlLink;
    await item.save();
    return {
        message: 'Success'
    }
}

module.exports.updateItem = async (filter, data) => {
    try {
        const result = await Item.updateOne(filter, data);
        if (result.n == 0) {
            return {
                message: 'Not update'
            }
        }
        return {
            message: 'Success'
        }
    } catch (error) {
        throw error;
    }
}

module.exports.updateType = async (filter, data) => {
    try {
        const result = await Type.updateOne(filter, data);
        if (result.n == 0) {
            return {
                message: 'Not found'
            }
        }
        return {
            message: 'Success'
        }
    } catch (error) {
        throw error;
    }
}

module.exports.deleteItem = async (filter) => {
    try {
        const result = await Item.deleteOne(filter);
        if (result.n == 0) {
            return {
                message: 'Not found'
            }
        }
        return {
            message: 'Success'
        }
    } catch (error) {
        throw error;
    }
}

module.exports.deleteType = async (filter) => {
    try {
        const result = await Type.deleteOne(filter);
        if (result.n == 0) {
            return {
                message: 'Not found'
            }
        }
        return {
            message: 'Success'
        }
    } catch (error) {
        throw error;
    }
}

module.exports.createUser = async (data) => {
    try {
        data.password = bcrypt.hashSync(data.password, 10);
        const user = new User(data);
        await user.save();
        return {
            message: 'Success'
        }
    } catch (error) {
        throw error;
    }
}

module.exports.updateUser = async (filter, data) => {
    try {
        data.password = bcrypt.hashSync(data.password, 10);
        const result = await User.updateOne(filter, data);
        return {
            message: 'Success'
        }
    } catch (error) {
        throw error;
    }
}

module.exports.updateUserName  = async (filter, data) => {
    try {
        const result = await User.updateOne(filter, data);
        return {
            message: 'Success'
        }
    } catch (error) {
        throw error;
    }
}

module.exports.login = async(data) =>{
    try {
        const user = await User.findOne({username: data.username})
        if (!user){
            return {
                message: "User wrong"
            }
        }
        const result = bcrypt.compareSync(data.password, user.password);
        if (result){
            const payload = {
                _id: user._id,
                name: user.name,
                username: user.username,
            }
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '6h'});
            const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
            user.refreshToken = refreshToken;
            user.save();
            return {
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        }
        else {
            return {
                message: "Password wrong"
            }
        }
    } catch (error) {
        throw error;   
    }
}

module.exports.regenerateAccessToken = async (refreshToken) => {
    try {
        const user = await User.findOne({refreshToken: refreshToken});
        if (user) {
            const payload = {
                _id: user._id,
                username: user.username,
                roleUser: user.roleUser
            }
            const userRefresh = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '6h'});
            return {
                accessToken: accessToken
            }
        }
        else {
            return null;
        }
    } catch (error) {
        throw error;
    }
}

module.exports.createOrder = async (data) => {
    try {
        const order = new Order(data);
        await order.save();
        return {
            message: "Success"
        }
    } catch (error) {
        throw error;
    }
}

module.exports.getAllOrders = async () => {
    try {
        const result = await Order.find();
        return {
            message: 'Success',
            result: result
        }
    } catch (error) {
        throw error;
    }
}

module.exports.getOrders = async (data) => {
    try {
        const result = await Order.find(data);
        return {
            message: 'Success',
            result: result
        }
    } catch (error) {
        throw error;
    }
}

module.exports.checkOrder = async (filter) => {
    try {
        const result = await Order.updateOne(filter, {
            success: true
        });
        if (result.n == 0){
            return {
                message: "Not found"
            }
        }
        return {
            message: "Success"
        }
    } catch (error) {
        throw error;
    }
}

module.exports.uncheckOrder = async (filter) => {
    try {
        const result = await Order.updateOne(filter, {
            success: false
        });
        if (result.n == 0){
            return {
                message: "Not found"
            }
        }
        return {
            message: "Success"
        }
    } catch (error) {
        throw error;
    }
}

module.exports.getName = async (username) => {
    try {
        const result = await User.findOne(username);
        if (!result){
            return {
                message: "Not Found"
            }
        }
        return {
            message: "Success",
            result: {
                name: result.name
            }
        }
    } catch (error) {
        throw error;
    }
}

const sendTextMessage = async (userId, text) => {
    try {
        const callAPI = await fetch(
            `https://graph.facebook.com/v12.0/me/messages?access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
              method: 'POST',
              body: JSON.stringify({
                messaging_type: 'RESPONSE',
                recipient: {
                  id: userId,
                },
                message: {
                  text: text
                },
              }),
            }
        );
        return {
            message: 'Success'
        }
    } catch (error) {
        throw error;
    }
}

sendTextMessage('100014757166607', 'rest');