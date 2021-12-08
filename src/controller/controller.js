const service = require('../service/service');

module.exports.getAllItem = async (req, res) => {
    const result = await service.getItemAll();
    res.json(result);
}

module.exports.getItem = async (req, res) => {
    const id = {
        _id: req.params.id
    }
    const result = await service.getItems(id);
    res.json(result);
}

module.exports.getItems = async (req, res) => {
    const type = {
        type: req.query.type
    }
    const result = await service.getItems(type);
    res.json(result);
}

module.exports.getType = async (req, res) => {
    const result = await service.getTypeAll();
    res.json(result);
}

module.exports.addItem = async (req, res) => {
    const data = req.body;
    const result = await service.addItem(data);
    res.json(result);
}

module.exports.addType = async (req, res) => {
    const data = req.body;
    const result = await service.addType(data);
    res.json(result);
}

module.exports.updateItem = async (req, res) => {
    const filter = {
        _id: req.params.id
    }
    const data = req.body;
    const result = await service.updateItem(filter, data);
    res.json(result);
}

module.exports.updateType = async (req, res) => {
    const filter = {
        _id: req.params.id
    }
    const data = req.body;
    const result = await service.updateType(filter, data);
    res.json(result);
}

module.exports.deleteItem = async (req, res) => {
    const filter = {
        _id: req.params.id
    }
    const result = await service.deleteItem(filter, data);
    res.json(result);
}

module.exports.deleteType = async (req, res) => {
    const filter = {
        _id: req.params.id
    }
    const result = await service.deleteType(filter, data);
    res.json(result);
}

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
        res.status(200).json({success: "ok"});
    }
    else res.status(401).json({message: "Auth failed"});
}

module.exports.refresh = async (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    const token = await service.regenerateAccessToken(refreshToken);
    if (token) {
        res.cookie('access_token',token.accessToken, {
        httpOnly: true,
        });
        res.status(200).json({success: 'ok'});
    }
    else {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.sendStatus(200);
    }
}

module.exports.createUser = async (req, res) => {
    const data = req.body;
    const result = await service.createUser(data);
    res.json(result)
}

module.exports.updateUser = async (req, res) => {
    const filter = {
        username: res.locals.username,
        name: res.locals.name
    }
    const data = req.body;
    const result = await service.updateUser(filter, data);
    res.json(result)
}