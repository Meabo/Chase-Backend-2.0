import {assert, expect} from "chai";
import Area from "../src/area";
import User from "../src/user";
import Discover from "../src/discover";

describe("Discover", () => {
  const discover = new Discover();
  const areas = [];
  let area;
  const userLoc = [48.850198, 2.2973423];
  const loc = [48.8556475, 2.2986304];

  before(async () => {
    const top_left = [48.8569443, 2.2940138];
    const top_right = [48.8586221, 2.2963717];
    const bot_left = [48.8523546, 2.3012814];
    const bot_right = [48.8539637, 2.3035665];
    area = new Area(loc, [top_left, top_right, bot_left, bot_right], "test");
    areas.push(area);
    discover.initAreas(areas);
  });

  it("should show one area according to the user's location  with a 1 km perimeter", async () => {
    const user_logged = new User("aboumehdi.pro@gmail.com");
    user_logged.setCurrentLocation(userLoc);
    const result = discover.showGames(user_logged, 1);
    assert.deepEqual(area, result[0]);
  });

  it("should show two areas according to the user's location with a 1 km perimeter", async () => {
    const user_logged = new User("aboumehdi.pro@gmail.com");
    user_logged.setCurrentLocation(userLoc);
    areas.push(area);
    discover.initAreas(areas);
    const result = discover.showGames(user_logged, 1);
    assert.deepEqual(areas, result);
  });
});
