import * as mongoose from "mongoose";
const {Schema} = mongoose;
import {distanceByLoc} from "../utils/locationutils";

const AreaSchema = new Schema(
  {
    name: {
      type: String,
      required: "Enter a first name"
    },
    location: {
      type: Array,
      required: "Enter a location."
    },
    bounds: {
      type: Array
    }
  },
  {collection: "Areas"}
);

const Areas = mongoose.model("Areas", AreaSchema);

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

export const findAreaById = async (id) => {
  try {
    return await Areas.findById(id).exec();
  } catch (error) {
    throw error;
  }
};
