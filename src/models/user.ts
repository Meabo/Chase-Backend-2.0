import mongoose, { Schema, Document } from 'mongoose';
import { AutoIncrement } from "./autoIncrementCounter"
import { _calculateAge } from "../utils/calculators"

const collection = "users";

export interface IUser extends Document {
  name: string;
  age: number;
}

const usersSchema: Schema = new Schema(
  { 
    id: {type: Number, unique: true, min: 1 },
    pseudo: { type: String, required: true },
    age: { type: Number },
    gender: {type: String},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    facebookProfileId: {type: Object},
    googleProfileId: {type: Object}
  },
  {collection: collection}
);

const Users = mongoose.model<IUser>(collection, usersSchema);

usersSchema.pre('save', (next: mongoose.HookNextFunction) => {
  const doc: any = this;
  if (doc.isNew) {
    const nextSeq = AutoIncrement.findOneAndUpdate(
        { name: 'Test' }, 
        { $inc: { seq: 1 } }, 
        { new: true, upsert: true }
    );

    nextSeq
        .then(nextValue => doc["id"] = nextValue)
    next(doc);
}
else next();
})

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

export const findOrCreate = async (profile: any) => {
  const modelDocument = {
    pseudo: profile.first_name,
    age: _calculateAge(profile.birthday),
    gender: profile.gender,
    facebookProfileId: profile.id
  }
  try {
    const user = await Users.findOneAndUpdate(
      { facebookProfileId: profile.id },
      modelDocument,
      {upsert: true, new: true, runValidators: true},
    ).exec();
    console.log(user);
    return user;
  } catch (error) {
    throw error;
  }
}
