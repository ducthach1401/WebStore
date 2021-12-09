module.exports.modelItem = (model) => {
    return {
        _id: model._id,
        name: model.name,
        description: model.description,
        cost: model.cost,
        type: model.type,
        image: "https://res.cloudinary.com/store241200/image/upload/v1/store/" + model._id
    }
}

module.exports.modelType = (model) => {
    return {
        _id: model._id,
        type: model.type
    }
}

module.exports.modelOrder = (model) => {
    return {
        _id: model._id,
        nameUser: model.nameUser,
        address: model.address,
        phone:model.phone,
        name: model.name,
        quantity: model.quantity,
        cost: model.cost,
        total: model.total,
        success: model.success,
        dateOrder: model.dateOrder
    }
}