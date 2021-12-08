const mongoose = require('mongoose');

const IItem = mongoose.Schema({
    _id: {type: mongoose.Types.ObjectId, default: mongoose.Types.ObjectId},
    name: {type: String, require: true},
    description: {type: String},
    cost: {type: Number, require: true},
    type: {type: String},
    link: {type: String}
},{
    timestamps: true
});

const IType = mongoose.Schema({
    type: String
}, {
    timestamps: true
})

const IUser = mongoose.Schema({
    name: {type: String, require: true},
    username: {type: String, require: true},
    password: {type: String, require: true},
    refreshToken: {type: String}
}, {
    timestamps: true
});

const Item = mongoose.model('Item', IItem);
const Type = mongoose.model('Type', IType);
const User = mongoose.model('User', IUser);

module.exports.Item = Item;
module.exports.Type = Type;
module.exports.User = User;