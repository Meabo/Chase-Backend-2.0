import mongoose, { Schema } from 'mongoose';

const collection = "AutoIncrement";

const autoIncrementSchema = new Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
},  {collection: collection});

autoIncrementSchema.index({ _id: 1, seq: 1 }, { unique: true })

export const AutoIncrement = mongoose.model('AutoIncrement', autoIncrementSchema);