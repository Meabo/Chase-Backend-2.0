import mongoose, { Schema, Document } from 'mongoose';

const autoIncrementSchema = new Schema({
    name: String,
    seq: { type: Number, default: 0 }
});

export const AutoIncrement = mongoose.model('AutoIncrement', autoIncrementSchema);