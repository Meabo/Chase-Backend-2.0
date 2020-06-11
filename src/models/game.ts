import mongoose, { Schema, Document } from 'mongoose';
import {IArea, pointSchema} from './areas'
const collection = "Games";

export interface IGame extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  location: Array<number>;
  creatorId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  gamePictureUrl: string;
  capacity: number;
  state: number;
}

const gamesSchema: Schema = new Schema(
  { 
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    location: { type: pointSchema, required: true },
    creatorId: { type: Schema.Types.ObjectId },
    createdAt: { type: Date, default: Date.now, required: true},
    updatedAt: { type: Date, default: Date.now, required: true },
    gamePictureUrl: {type: String},
    capacity: {type: Number},
    state: {type: Number}
  },
  {collection: collection}
);

const Games = mongoose.model<IGame>(collection, gamesSchema);

export const getGamesWithGeolocationFilterFromDb = async (lat: number, lon: number, distance: string, limit: string)  => 
{
    try {
        const query = { 
            location: { 
                $nearSphere: { 
                    $geometry: { 
                        type: "Point", 
                        coordinates: [lat, lon] 
                    }, 
                        $maxDistance: +distance * 1000
                    } 
            }
        }
        const games = await Games
                    .find(query)
                    .limit(+limit)
                    .exec();
        return games;
      } catch (error) {
        throw error;
      }
};
