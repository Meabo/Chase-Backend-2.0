import {Location} from "../socket-rooms/ColyseusSchema/location";
import {Schema, type, ArraySchema} from "@colyseus/schema";

const SchemaConverter  = {
    ArrayToLocation: (bounds: number[][]) => {
        const arraySchema = new ArraySchema<Location>();

        bounds.map(points => {
            arraySchema.push(new Location(points[0], points[1]))
        })
        
        return arraySchema;
    }
}

export default SchemaConverter