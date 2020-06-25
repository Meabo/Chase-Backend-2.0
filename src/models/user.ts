import mongoose, { Schema, Document, Mongoose, Query } from 'mongoose';
import { AutoIncrement } from "./autoIncrementCounter"
import { _calculateAge } from "../utils/calculators"

export const UsersCollection = "Users";

export interface IUser extends Document {
  _id: Schema.Types.ObjectId;
  pseudo: string;
  email: string;
  age: number;
  gender: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  facebookProfileId: Object;
  googleProfileId: Object;
  avatarUrl: string;
}

const usersSchema: Schema = new Schema(
  { 
    _id: { type: Schema.Types.ObjectId, auto: true },
    pseudo: { type: String },
    email: { type: String },
    age: { type: Number },
    gender: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    createdAt: { type: Date, default: Date.now, required: true},
    updatedAt: { type: Date, default: Date.now, required: true },
    facebookProfileId: {type: Object},
    googleProfileId: {type: Object},
    avatarUrl: {type: String}
  },
  {collection: UsersCollection}
);

export const Users = mongoose.model<IUser>(UsersCollection, usersSchema);

/*usersSchema.pre('save', (next: mongoose.HookNextFunction) => {
  const doc: any = this;
  if (doc.isNew) {
    const nextSeq = AutoIncrement.findOneAndUpdate(
        { _id: 'Users' }, 
        { $inc: { seq: 1 } }, 
        { new: true, upsert: true }
    );

    nextSeq
        .then(nextValue => doc["id"] = nextValue)
    next(doc);
}
else next();
})*/

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

export const findOrCreateByFacebookProfile = async (profile: any) => {
  const modelDocument = {
    facebookProfileId: profile.id,
    firstName: profile.first_name,
    lastName: profile.last_name,
    email: profile.email,
    age: _calculateAge(profile.birthday ?? null),
    gender: profile.gender ?? "unknown",
    updatedAt: Date.now()
  }
  
  try {
    const user = await Users.findOneAndUpdate(
      { facebookProfileId: profile.id },
      modelDocument as any,
      {upsert: true, new: true, runValidators: true},
    ).exec();
    console.log(user);
    return user;
  } catch (error) {
    throw error;
  }
}

export const createPlayerInDb = async (id: string, pseudo: string, avatarUrl: string) => {
  try {
    await Users.updateOne(
      { "_id": id as any}, // Filter
      {$set: {"pseudo": pseudo, "avatarUrl": avatarUrl}}, 
      {upsert: false});
  } catch (error) {
    console.log("error", error);
    throw error; 
  }
}
