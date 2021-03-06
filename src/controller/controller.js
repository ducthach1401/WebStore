const { modelItem, modelType, modelOrder } = require('../serializer/serializer');
const service = require('../service/service');

module.exports.getAllItem = async (req, res) => {
  const result = await service.getItemAll();
  result.result = result.result.map((data) => modelItem(data));
  res.json(result);
};

module.exports.getName = async (req, res) => {
  const data = {
    username: res.locals.username,
  };
  const result = await service.getName(data);
  res.json(result);
};

module.exports.getItem = async (req, res) => {
  const id = {
    _id: req.params.id,
  };
  const result = await service.getItems(id);
  result.result = result.result.map((data) => modelItem(data));
  res.json(result);
};

module.exports.getItems = async (req, res) => {
  const type = {
    type: req.query.type,
  };
  const result = await service.getItems(type);
  result.result = result.result.map((data) => modelItem(data));
  res.json(result);
};

module.exports.getType = async (req, res) => {
  const result = await service.getTypeAll();
  result.result = result.result.map((data) => modelType(data));
  res.json(result);
};

module.exports.addItem = async (req, res) => {
  const data = {
    ...req.body,
  };
  const file = req.file;
  const result = await service.addItem(data, file);
  res.json(result);
};

module.exports.addType = async (req, res) => {
  const data = req.body;
  const result = await service.addType(data);
  res.json(result);
};

module.exports.updateItem = async (req, res) => {
  const filter = {
    _id: req.params.id,
  };
  const data = req.body;
  const result = await service.updateItem(filter, data);
  res.json(result);
};

module.exports.updateType = async (req, res) => {
  const filter = {
    _id: req.params.id,
  };
  const data = req.body;
  const result = await service.updateType(filter, data);
  res.json(result);
};

module.exports.deleteItem = async (req, res) => {
  const filter = {
    _id: req.params.id,
  };
  const result = await service.deleteItem(filter);
  res.json(result);
};

module.exports.deleteType = async (req, res) => {
  const filter = {
    _id: req.params.id,
  };
  const result = await service.deleteType(filter);
  res.json(result);
};

module.exports.login = async (req, res) => {
  const data = req.body;
  const token = await service.login(data);
  if (token.accessToken) {
    res.cookie('access_token', token.accessToken, {
      httpOnly: true,
      //secure: true;
    });
    res.cookie('refresh_token', token.refreshToken, {
      httpOnly: true,
      //secure: true;
    });
    res.cookie('login', 'true', {});
    res.status(200).json({ message: 'Success' });
  } else res.status(401).json({ message: 'Auth failed' });
};

module.exports.refresh = async (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  const token = await service.regenerateAccessToken(refreshToken);
  if (token) {
    res.cookie('access_token', token.accessToken, {
      httpOnly: true,
    });
    res.status(200).json({ success: 'ok' });
  } else {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.sendStatus(200);
  }
};

module.exports.createUser = async (req, res) => {
  const data = req.body;
  const result = await service.createUser(data);
  res.json(result);
};

module.exports.updateUser = async (req, res) => {
  const filter = {
    username: res.locals.username,
    name: res.locals.name,
  };
  const data = req.body;
  const result = await service.updateUser(filter, data);
  res.json(result);
};

module.exports.updateUserName = async (req, res) => {
  const filter = {
    username: res.locals.username,
    name: res.locals.name,
  };
  const data = req.body;
  const result = await service.updateUserName(filter, data);
  res.json(result);
};

module.exports.createOrder = async (req, res) => {
  const data = {
    ...req.body,
    dateOrder: Date.now(),
    total: req.body.cost * req.body.quantity,
  };
  const result = await service.createOrder(data);
  res.json(result);
};

module.exports.getAllOrders = async (req, res) => {
  const result = await service.getAllOrders();
  result.result = result.result.map((data) => modelOrder(data));
  res.json(result);
};

module.exports.getOrders = async (req, res) => {
  const filter = req.query;
  const result = await service.getOrders(filter);
  result.result = result.result.map((data) => modelOrder(data));
  res.json(result);
};

module.exports.checkOrder = async (req, res) => {
  const filter = {
    _id: req.params.id,
  };
  const result = await service.checkOrder(filter);
  res.json(result);
};

module.exports.uncheckOrder = async (req, res) => {
  const filter = {
    _id: req.params.id,
  };
  const result = await service.uncheckOrder(filter);
  res.json(result);
};

module.exports.updateImage = async (req, res) => {
  const filter = {
    _id: req.params.id,
  };
  const file = req.file;
  const result = await service.updateImage(filter, file);
  res.json(result);
};

module.exports.verifyWebhook = (req, res) => {
  let VERIFY_TOKEN = '123456789';
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
};

module.exports.postWebhook = (req, res) => {
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
          console.log(event);
          // service.sendTextMessage(event);
        }
      });
    });
    res.status(200).end();
  }
};

module.exports.sendOrder = async (req, res) => {
  const data = req.body;
  const result = await service.sendOrder(data);
  res.json({
    message: 'Success',
    url: result,
  });
};

module.exports.callbackPost = async (req, res) => {
  const data = req.body;
  if (data.errorCode == 0) {
    await service.confirmOrder(data);
    res.json({
      message: 'Success',
    });
  } else {
    res.json({
      message: 'Failed',
    });
  }
};

module.exports.callbackGet = async (req, res) => {
  const data = req.query;
  const Host = process.env.HOST;
  if (data.errorCode == 0) {
    await service.confirmOrder(data);
    res.redirect(`${Host}?success`);
  } else {
    res.redirect(`${Host}?failed`);
  }
};
