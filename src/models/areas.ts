import mongoose, { Schema, Document } from 'mongoose';
import {distanceByLoc} from "../utils/locationutils";

const collection = "areas";

export interface IArea extends Document {
  name: string;
  location: Array<any>;
  bounds: Array<any>;
}

const AreaSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: Array, required: true },
    bounds: { type: Array }
  },
  {collection: collection}
);

const Areas = mongoose.model<IArea>(collection, AreaSchema);

export const findAllAreas = async (lat: number, lng: number, limit: number) => {
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
};
