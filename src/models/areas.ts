import mongoose, { Schema, Document } from 'mongoose';
import {distanceByLoc} from "../utils/locationutils";

const collection = "areas";

export interface IArea extends Document {
  name: string;
  location: Array<any>;
  bounds: Array<any>;
}

export const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const polygonSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Polygon'],
    required: true
  },
  coordinates: {
    type: [[[Number]]], // Array of arrays of arrays of numbers
    required: true
  }
});

const AreaSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: pointSchema, required: true },
    bounds: { type: polygonSchema }
  },
  {collection: collection}
);

const Areas = mongoose.model<IArea>(collection, AreaSchema);

/*export const findAllAreas = async (lat: number, lng: number, limit: number) => {
  try {
    const areas = await Areas.find().exec();
    const areasFiltered = areas.filter((area) => {
      const distance = distanceByLoc([lat, lng], area.location);
      return distance <= limit;
    });
    return areasFiltered;
  } catch (error) {
    throw error;
  }
};

export const findAreaById = async (id: any) => {
  try {
    return await Areas.findById(id).exec();
  } catch (error) {
    throw error;
  }
};*/
