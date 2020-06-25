import mongoose, { Schema, Document } from 'mongoose';
export const AvatarsCollection = "Avatars";

export interface IAvatar extends Document {
  _id: Schema.Types.ObjectId;
  avatarUrl: string;
}

const avatarsSchema: Schema = new Schema(
  { 
    _id: { type: Schema.Types.ObjectId, auto: true },
    avatarUrl: { type: String, required: true },
  },
  {collection: AvatarsCollection}
);

export const Avatars = mongoose.model<IAvatar>(AvatarsCollection, avatarsSchema);

export const getAvatars = async ()  => {
    try {
        const query = {}
        const avatars = await Avatars
                    .find(query)
                    .limit(10)
                    .exec();
        return avatars;
      } catch (error) {
        throw error;
      }
};


