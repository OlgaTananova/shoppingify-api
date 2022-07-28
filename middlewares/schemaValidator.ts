import {Joi} from 'celebrate';

export const createCategoryValidationSchema = {
    body: Joi.object().keys({
        category: Joi.string().min(2).max(30).required()
    })
}

export const addItemToCategoryValidationSchema = {
    body: Joi.object().keys({
       _id: Joi.string().hex().length(24).required(),
        categoryId: Joi.string().hex().length(24).required()
    })
}


export const deleteItemFromCategoryValidationSchema = {
    body: Joi.object().keys({
        _id: Joi.string().hex().length(24).required(),
        categoryId: Joi.string().hex().length(24).required()
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

