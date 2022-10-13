import {Model, model, Schema} from 'mongoose';
import {IUser} from "../types";

interface IUserSchema extends IUser, Document {
    _id: Schema.Types.ObjectId
}
interface IUserModel extends Model<IUserSchema>{
    findUserByCredentials(email:string, password: string): Promise<IUserSchema>
}
const userSchema = new Schema<IUserSchema>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    }
});

userSchema.statics.findUserByCredentials = async function findUserByCredentials (email)
: Promise<IUserSchema> {
    const user = await this.findOne({email}).select('+password');
    return user;
};

export const UserModel = model<IUserSchema>('user', userSchema) as IUserModel;
