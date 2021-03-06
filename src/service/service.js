const Model = require('../model/model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Type = Model.Type;
const Item = Model.Item;
const User = Model.User;
const Order = Model.Order;
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');
const fetch = require('node-fetch');
require('dotenv').config();

const mail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

module.exports.getItemAll = async () => {
  try {
    const result = await Item.find();
    // for (let item of result){
    //     item.image = cloudinary.image('store/' + item._id);
    //     console.log(item.image);
    // }
    return {
      message: 'Success',
      result: result,
    };
  } catch (error) {
    throw error;
  }
};

module.exports.getItems = async (data) => {
  try {
    const result = await Item.find(data);
    return {
      message: 'Success',
      result: result,
    };
  } catch (error) {
    throw error;
  }
};

module.exports.getTypeAll = async () => {
  try {
    const result = await Type.find();
    return {
      message: 'Success',
      result: result,
    };
  } catch (error) {
    throw error;
  }
};

module.exports.addType = async (data) => {
  try {
    const type = new Type(data);
    await type.save();
    return {
      message: 'Success',
    };
  } catch (error) {}
};

module.exports.addItem = async (data, image) => {
  try {
    const check = await Type.find({
      type: data.type,
    });
    if (!check) {
      return {
        message: 'Not found type of item',
      };
    }
    const item = new Item(data);
    const timestamp = Math.round(Date.now() / 1000);
    const temp = cloudinary.utils.api_sign_request(timestamp, process.env.API_SECRET);
    const url = item._id + '/' + new Date().getTime();
    const upload = cloudinary.uploader.upload(image.path, { public_id: url, folder: 'store_1' }, (err) => {
      if (err) {
        throw err;
      }
    });
    const urlLink = cloudinary.url('store_1/' + url);
    item.link = urlLink;
    await item.save();
    return {
      message: 'Success',
    };
  } catch (error) {
    throw error;
  }
};

module.exports.updateImage = async (filter, image) => {
  const timestamp = Math.round(Date.now() / 1000);
  const temp = cloudinary.utils.api_sign_request(timestamp, process.env.API_SECRET);
  const url = filter._id + '/' + new Date().getTime();
  const upload = cloudinary.uploader.upload(image.path, { public_id: url, folder: 'store_1' }, (err) => {
    if (err) {
      throw err;
    }
  });
  const item = await Item.findOne(filter);
  const urlLink = cloudinary.url('store_1/' + url);
  item.link = urlLink;
  await item.save();
  return {
    message: 'Success',
  };
};

module.exports.updateItem = async (filter, data) => {
  try {
    const result = await Item.updateOne(filter, data);
    if (result.n == 0) {
      return {
        message: 'Not update',
      };
    }
    return {
      message: 'Success',
    };
  } catch (error) {
    throw error;
  }
};

module.exports.updateType = async (filter, data) => {
  try {
    const result = await Type.updateOne(filter, data);
    if (result.n == 0) {
      return {
        message: 'Not found',
      };
    }
    return {
      message: 'Success',
    };
  } catch (error) {
    throw error;
  }
};

module.exports.deleteItem = async (filter) => {
  try {
    const result = await Item.deleteOne(filter);
    if (result.n == 0) {
      return {
        message: 'Not found',
      };
    }
    return {
      message: 'Success',
    };
  } catch (error) {
    throw error;
  }
};

module.exports.deleteType = async (filter) => {
  try {
    const result = await Type.deleteOne(filter);
    if (result.n == 0) {
      return {
        message: 'Not found',
      };
    }
    return {
      message: 'Success',
    };
  } catch (error) {
    throw error;
  }
};

module.exports.createUser = async (data) => {
  try {
    data.password = bcrypt.hashSync(data.password, 10);
    const user = new User(data);
    await user.save();
    return {
      message: 'Success',
    };
  } catch (error) {
    throw error;
  }
};

module.exports.updateUser = async (filter, data) => {
  try {
    data.password = bcrypt.hashSync(data.password, 10);
    const result = await User.updateOne(filter, data);
    return {
      message: 'Success',
    };
  } catch (error) {
    throw error;
  }
};

module.exports.updateUserName = async (filter, data) => {
  try {
    const result = await User.updateOne(filter, data);
    return {
      message: 'Success',
    };
  } catch (error) {
    throw error;
  }
};

module.exports.login = async (data) => {
  try {
    const user = await User.findOne({ username: data.username });
    if (!user) {
      return {
        message: 'User wrong',
      };
    }
    const result = bcrypt.compareSync(data.password, user.password);
    if (result) {
      const payload = {
        _id: user._id,
        name: user.name,
        username: user.username,
      };
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '6h',
      });
      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
      user.refreshToken = refreshToken;
      user.save();
      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } else {
      return {
        message: 'Password wrong',
      };
    }
  } catch (error) {
    throw error;
  }
};

module.exports.regenerateAccessToken = async (refreshToken) => {
  try {
    const user = await User.findOne({ refreshToken: refreshToken });
    if (user) {
      const payload = {
        _id: user._id,
        username: user.username,
        roleUser: user.roleUser,
      };
      const userRefresh = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '6h',
      });
      return {
        accessToken: accessToken,
      };
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

module.exports.createOrder = async (data) => {
  try {
    const order = new Order(data);
    await order.save();
    return order._id;
  } catch (error) {
    throw error;
  }
};

module.exports.getAllOrders = async () => {
  try {
    const result = await Order.find();
    return {
      message: 'Success',
      result: result,
    };
  } catch (error) {
    throw error;
  }
};

module.exports.getOrders = async (data) => {
  try {
    const result = await Order.find(data);
    return {
      message: 'Success',
      result: result,
    };
  } catch (error) {
    throw error;
  }
};

module.exports.checkOrder = async (filter) => {
  try {
    const result = await Order.updateOne(filter, {
      success: true,
    });
    if (result.n == 0) {
      return {
        message: 'Not found',
      };
    }
    return {
      message: 'Success',
    };
  } catch (error) {
    throw error;
  }
};

module.exports.uncheckOrder = async (filter) => {
  try {
    const result = await Order.updateOne(filter, {
      success: false,
    });
    if (result.n == 0) {
      return {
        message: 'Not found',
      };
    }
    return {
      message: 'Success',
    };
  } catch (error) {
    throw error;
  }
};

module.exports.getName = async (username) => {
  try {
    const result = await User.findOne(username);
    if (!result) {
      return {
        message: 'Not Found',
      };
    }
    return {
      message: 'Success',
      result: {
        name: result.name,
      },
    };
  } catch (error) {
    throw error;
  }
};

module.exports.sendTextMessage = async (userId, text) => {
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
            text: text,
          },
        }),
      },
    );
    if (callAPI.status == 200) {
      return {
        message: 'Success',
      };
    } else {
      return {
        message: 'Failed',
      };
    }
  } catch (error) {
    throw error;
  }
};

module.exports.sendOrder = async (data) => {
  try {
    for (let ele of data.goods) {
      ele.price = parseInt(ele.price.split('.').join(''));
      ele.total = parseInt(ele.total.split('.').join(''));
    }
    const orderId = await this.createOrder({
      name: data.name,
      address: data.address,
      gmail: data.gmail,
      phoneNumber: data.sdt,
      facebook: data.facebook,
      note: data.note,
      items: data.goods,
      total: parseInt(data.totalPrice.split('.').join('')),
    });
    return await this.createBillMomo(orderId, data.totalPrice.split('.').join(''));
    // return {
    //   message: 'Success',
    // };
  } catch (error) {
    throw error;
  }
};

module.exports.confirmOrder = async (dataMomo) => {
  const data = await Order.findById(dataMomo.orderId);
  let text = '<h2> ????n x??c nh???n t??? c???a h??ng Three Group </h2>';
  const date = new Date();
  text += '<h3> T??n ng?????i ?????t: ' + data.name + '</h3>';
  text += '<p> SDT: ' + data.phoneNumber + '</p>';
  text += '<p> ?????a ch???: ' + data.address + '</p>';
  if (data.facebook) {
    text += '<p> Facebook: ' + data.facebook + '</p>';
  }
  if (data.note) {
    text += '<p> Ghi ch??: ' + data.note + '</p>';
  }

  for (let item of data.items) {
    text += `<p> ${item.stt}. ${item.name}, S??? l?????ng:  ${item.quantity}, ????n gi??: ${item.price}, Th??nh ti???n: ${item.total} </p>`;
  }
  text += `<p> T???ng ti???n: <b>${data.total}</b> </p>`;
  text += `<p> Qu?? kh??ch ???? thanh to??n th??nh c??ng ????n h??ng s??? s???m v???n chuy???n trong h??m nay!</p>`;
  text += `<h3> C???m ??n qu?? kh??ch ???? ???ng h??? </h3>`;
  text +=
    '<p>' +
    [date.getDate(), date.getMonth(), date.getFullYear()].join('/') +
    ' ' +
    (date.getHours() + 7) +
    ':' +
    date.getMinutes() +
    '</p>';

  await this.sendMailOrder(data.gmail, text);
  await Order.updateOne(
    {
      _id: dataMomo.orderId,
    },
    {
      payment: true,
      status: '???? thanh to??n',
    },
  );
};

module.exports.sendMailOrder = async (gmail, text) => {
  await mail.sendMail({
    from: process.env.MAIL_ADDRESS,
    to: gmail,
    subject: 'X??c nh???n thanh to??n th??nh c??ng t??? Three Group',
    html: text,
  });
};

module.exports.createBillMomo = async (orderId, price) => {
  const urlApi = 'https://test-payment.momo.vn/gw_payment/transactionProcessor';
  const API_URL = process.env.HOST;
  const payload = {
    partnerCode: process.env.PARTNER_CODE,
    accessKey: process.env.ACCESS_KEY,
    requestId: Math.round(Date.now() / 1000).toString(),
    amount: price.toString(),
    orderId: orderId.toString(),
    orderInfo: 'Payment',
    returnUrl: `${API_URL}/v1/momo/callback`,
    notifyUrl: `${API_URL}/v1/momo/callback`,
    extraData: '',
    requestType: 'captureMoMoWallet',
    signature: '',
  };
  payload.signature = crypto
    .createHmac('sha256', process.env.SECRET_KEY)
    .update(
      'partnerCode=' +
        payload.partnerCode +
        '&accessKey=' +
        payload.accessKey +
        '&requestId=' +
        payload.requestId +
        '&amount=' +
        payload.amount +
        '&orderId=' +
        payload.orderId +
        '&orderInfo=' +
        payload.orderInfo +
        '&returnUrl=' +
        payload.returnUrl +
        '&notifyUrl=' +
        payload.notifyUrl +
        '&extraData=' +
        payload.extraData,
    )
    .digest('hex');

  const callAPI = await fetch(urlApi, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(payload),
  });
  let data = await callAPI.json();
  return data.payUrl;
};
