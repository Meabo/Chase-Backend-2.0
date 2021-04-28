import AreaRepository from "./adapters/AreaRepository";
import {distanceByLoc} from "./utils/locationutils";
import User from "./user";
import Area from "./socket-rooms/ColyseusSchema/area";

export default class Discover {
  private areaRepository: AreaRepository;

  constructor() {
    this.areaRepository = new AreaRepository();
  }

  initAreas(areas: Area[]) {
    this.areaRepository.set(areas);
  }

  getAreas() {
    return this.areaRepository.getAll();
  }

  showGames(user: User, limit: number) {
    if (!user.getLocation()) return "No Location";
    const filtered_games = this.areaRepository
      .getAll()
      .filter(
        (area: Area) =>
          distanceByLoc(user.getLocation(), [area.location.lat, area.location.lon]) <= limit
      );
      console.log('filtered games', filtered_games)
    return filtered_games;
  }
}
