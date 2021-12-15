const mongoose = require('mongoose');

const IItem = mongoose.Schema({
    _id: {type: mongoose.Types.ObjectId, default: mongoose.Types.ObjectId},
    name: {type: String, require: true, unique: true},
    description: {type: String},
    cost: {type: Number, require: true},
    type: {type: String, require: true},
    link: {type: String}
},{
    timestamps: true
});

const IType = mongoose.Schema({
    _id: {type: mongoose.Types.ObjectId, default: mongoose.Types.ObjectId},
    type: {type: String, unique: true, require: true}
}, {
    timestamps: true
})

const IUser = mongoose.Schema({
    _id: {type: mongoose.Types.ObjectId, default: mongoose.Types.ObjectId},
    name: {type: String, require: true},
    username: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    refreshToken: {type: String}
}, {
    timestamps: true
});

const IOrder = mongoose.Schema({
    _id: {type: mongoose.Types.ObjectId, default: mongoose.Types.ObjectId},
    nameUser: {type: String, require: true},
    address: {type: String, require: true},
    phone: {type: String, require: true},
    goods: [{
        name: {type: String, require: true},
        quantity: {type: Number, require: true},
        cost: {type: Number, require: true}
    }],
    total: {type: Number, require: true},
    success: {type: Boolean, default: false},
    dateOrder: Date
}, {
    timestamps: true
});

const Item = mongoose.model('Item', IItem);
const Type = mongoose.model('Type', IType);
const User = mongoose.model('User', IUser);
const Order = mongoose.model('Order', IOrder);
module.exports.Item = Item;
module.exports.Type = Type;
module.exports.User = User;
module.exports.Order = Order;