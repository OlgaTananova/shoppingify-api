import {UserModel} from "../models/user";
import bcrypt from "bcrypt";
import {Response, Request, NextFunction} from "express";
import {
    conflictMessage,
    createdStatusCode,
    notFoundMessage,
    notUniqueEmailConflictMessage,
    userProfileUpdated
} from "../constants";
import ConflictError from "../errors/ConflictError";
import NotFoundError from "../errors/NotFoundError";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const {name, email, password} = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        await UserModel.create({name, email, password: hash});
        res.status(createdStatusCode).send({name, email});
    } catch (err: any) {
        if (err.code === 11000) {
            return next(new ConflictError(conflictMessage('user')));
        }
        next(err);
    }
}
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    const id = (req.user && typeof req.user === 'object') && req.user._id;
    let user;
    try {
       user = await UserModel.findById(id);
       if (!user) {
           return next(new NotFoundError(notFoundMessage('user')));
       }
       res.send({name: user.name, email: user.email})
    } catch (err) {
        next(err);
    }
}

export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    const id = (req.user && typeof req.user === 'object') && req.user._id;
    const {name, email} = req.body;
    let updatedUser;
    try {
        updatedUser = await UserModel.findByIdAndUpdate(id, {name, email}, {new: true});
        if (!updatedUser) {
            return next (new NotFoundError(notFoundMessage('user')));
        }
        res.send({message: userProfileUpdated, name: updatedUser.name, email: updatedUser.email});
    } catch (err: any) {
        if (err.code === 11000) {
            return next(new ConflictError(notUniqueEmailConflictMessage));
        }
        next(err);
    }
}
