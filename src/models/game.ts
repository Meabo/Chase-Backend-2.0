import mongoose, { Schema, Document } from 'mongoose';
import {pointSchema, AreasCollection, IArea} from "./areas"
import {UsersCollection, IUser} from './user'
import {BrandsCollection, IBrand} from './brands'

export const GamesCollection = "Games";

export interface IGame extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  location: Array<number>;
  creatorId: IUser;
  createdAt: Date;
  updatedAt: Date;
  gamePictureUrl: string;
  capacity: number;
  state: number;
  brand: IBrand;
  area: IArea;
}

const GamesSchema: Schema = new Schema(
  { 
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String },
    location: { type: pointSchema },
    creator: { type: Schema.Types.ObjectId, ref: UsersCollection},
    createdAt: { type: Date, default: Date.now},
    updatedAt: { type: Date, default: Date.now },
    gamePictureUrl: {type: String},
    capacity: {type: Number},
    state: {type: Number},
    brand: { type: Schema.Types.ObjectId, ref: BrandsCollection},
    area: { type: Schema.Types.ObjectId, ref: AreasCollection},
  },
  {collection: GamesCollection}
);

export const Games = mongoose.model<IGame>(GamesCollection, GamesSchema);

export const getGameById = async (id: String)  => 
{
    try {
        const query = {"_id": id};
        const games = await Games
                    .findById(query)
                    .populate("creator", "pseudo avatarUrl")
                    .populate("brand", "brandName brandLogoUrl")
                    .populate("area", "location bounds")
                    .exec();
        return games;
      } catch (error) {
        throw error;
      }
};


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
