import User from "./user";
import Area from "./area";
export default class Discover {
    private areaRepository;
    constructor();
    initAreas(areas: Area[]): void;
    showGames(user: User, limit: number): any[] | "No Location";
}
