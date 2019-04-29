import * as mongoose from "mongoose";
const {Schema} = mongoose;

const PersonSchema = new Schema(
  {
    name: "string"
  },
  {collection: "Person"}
);

const Person = mongoose.model("Person", PersonSchema);

export const findAllPersons = async () => {
  try {
    const persons = await Person.find().exec();
    return persons;
  } catch (error) {
    throw error;
  }
};
