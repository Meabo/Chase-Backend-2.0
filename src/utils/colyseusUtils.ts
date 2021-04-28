import {Location} from "../socket-rooms/ColyseusSchema/Location";
import {Schema, type, ArraySchema} from "@colyseus/schema";

const SchemaConverter  = {
    ArrayToLocation: (bounds: number[][]) => {
        const arraySchema = new ArraySchema<Location>();

        bounds.map(points => {
            arraySchema.push(new Location().assign({lat: points[0], lon: points[1]}))
        })
        return arraySchema;
    },

    LocationToDoubleArray: (bounds: ArraySchema<Location>) => {
        const doubleArray = new Array()

        bounds.map((location:Location) => {
            doubleArray.push(location.getLocation());
        });
        
        return doubleArray;
    }
}

export default SchemaConverter