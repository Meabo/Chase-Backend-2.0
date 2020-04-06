import mongoose, { Schema, Document } from 'mongoose';

const collection = "users";

export interface IUser extends Document {
  name: string;
  age: number;
}

const usersSchema: Schema = new Schema(
  { 
    id: {type: String, required: true},
    name: { type: String, required: true },
    age: { type: Number },
  },
  {collection: collection}
);

const Users = mongoose.model<IUser>(collection, usersSchema);

export const findAllusers = async () => {
  try {
    const users = await Users.find().exec();
    return users;
  } catch (error) {
    throw error;
  }
};

export const findUserById = async (id: any) => {
  try {
    const user = await Users.findOne(id).exec();
    return user;
  } catch (error) {
    throw error;
  }
}

export const findUserBy = async (parameter: any, value: any) => {
  try {
    const user = await Users.findOne({
      where: {
        [parameter]: value
      }
    }).exec();
    return user;
  } catch (error) {
    throw error;
  }
}