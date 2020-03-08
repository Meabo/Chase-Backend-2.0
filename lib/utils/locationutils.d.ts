export declare function distance(lat1: any, lon1: any, lat2: any, lon2: any): number;
export declare function distanceByLoc(locA: any, locB: any): number;
export declare function robustPointInPolygon(vs: number[][], point: number[]): number;
export declare function getRandomLocationInsidePolygon(polygon: number[][]): {
    latitude: number;
    longitude: number;
};
