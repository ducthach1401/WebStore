module.exports.modelItem = (model) => {
  return {
    _id: model._id,
    name: model.name,
    description: model.description,
    cost: model.cost,
    type: model.type,
    image: model.link,
    createdAt: model.createdAt,
    quantity_purchased: model.quantity_purchased,
  };
};

module.exports.modelType = (model) => {
  return {
    _id: model._id,
    type: model.type,
  };
};

module.exports.modelOrder = (model) => {
  return {
    _id: model._id,
    nameUser: model.nameUser,
    address: model.address,
    phone: model.phone,
    name: model.name,
    quantity: model.quantity,
    cost: model.cost,
    total: model.total,
    success: model.success,
    dateOrder: model.dateOrder,
  };
};
