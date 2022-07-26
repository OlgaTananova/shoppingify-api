import {Joi} from 'celebrate';

export const createCategoryValidationSchema = {
    body: Joi.object().keys({
        category: Joi.string().min(2).max(30).required()
    })
}

export const createItemValidationSchema = {
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30).required(),
        note: Joi.string().allow('', null),
        image: Joi.string().allow('', null),
        categoryId: Joi.string().hex().length(24).required()
    })
}
export const getItemByIdValidationSchema = {
    params: Joi.object().keys({
        id: Joi.string().hex().length(24).required()
    })
}

export const deleteItemValidationSchema = {
    params: Joi.object().keys({
        id: Joi.string().hex().length(24).required()
    })
}

export const createUserValidationSchema = {
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
        email: Joi.string().required().email(),
        password: Joi.string().required()
    })
}

export const loginValidationSchema = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required()
    })
};


export const updateUserValidationSchema = {
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
        email: Joi.string().required().email()
    })
}

export const createShoppingListValidationSchema = {
    body: Joi.object().keys({
        categoryId: Joi.string().hex().length(24).required(),
        itemId: Joi.string().hex().length(24).required(),
    })
};

export const addItemToShoppingListValidationSchema = {
    body: Joi.object().keys({
        categoryId: Joi.string().hex().length(24).required(),
        itemId: Joi.string().hex().length(24).required(),
        shoppingListId: Joi.string().hex().length(24).required(),
        quantity: Joi.number(),
        status: Joi.string().allow('pending', 'completed'),
    })
}

export const deleteItemFromSLValidationSchema = {
    body: Joi.object().keys({
        itemId: Joi.string().hex().length(24).required(),
        shoppingListId: Joi.string().hex().length(24).required(),
    })
}

export const updateItemQtyInSLValidationSchema = {
    body: Joi.object().keys({
        itemId: Joi.string().hex().length(24).required(),
        shoppingListId: Joi.string().hex().length(24).required(),
        quantity: Joi.number().required()
    })
}

export const updateItemStatusInSLValidationSchema = {
    body: Joi.object().keys({
        itemId: Joi.string().hex().length(24).required(),
        shoppingListId: Joi.string().hex().length(24).required(),
        status: Joi.string().required().valid('pending', 'completed')
    })
}

export const updateSLHeadingValidationSchema = {
    body: Joi.object().keys({
        shoppingListId: Joi.string().hex().length(24).required(),
        heading: Joi.string().min(2).max(30).required(),
    })
}

export const updateSLStatusValidationSchema = {
    body: Joi.object().keys({
        shoppingListId: Joi.string().hex().length(24).required(),
        status: Joi.string().required().valid('completed', 'cancelled')
    })
}

