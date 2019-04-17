import {assert, expect} from "chai";
import Player from "../player";
import Area from "../area";
import {distance, robustPointInPolygon} from "../utils/locationutils";

describe("Location engine", () => {
  let player: Player;
  let area: Area;
  let bounds: number[][];
  const loc = [48.8556475, 2.2986304];
  const polygon = [[1, 1], [1, 2], [2, 2], [2, 1]];

  before(() => {
    player = new Player("Mehdi", 48.8556475, 2.2986304);
    const top_left = [48.8569443, 2.2940138];
    const top_right = [48.8586221, 2.2963717];
    const bot_left = [48.8523546, 2.3012814];
    const bot_right = [48.8539637, 2.3035665];

    bounds = [top_left, top_right, bot_left, bot_right];
    area = new Area(loc, bounds, "test");
  });

  it("Polygon: Point Inside the polygon, should return -1", async () => {
    assert.equal(robustPointInPolygon(polygon, [1.5, 1.5]), -1);
  });

  it("Polygon: Point Outside the polygon, should return 1", async () => {
    assert.equal(robustPointInPolygon(polygon, [3, 3]), 1);
  });
  it("Polygon: Point At the limit of the polygon, should return 0", async () => {
    assert.equal(robustPointInPolygon(polygon, [2, 2]), 0);
  });

  it("Player: Should return -1 if a player is inside the area", async () => {
    assert.equal(
      robustPointInPolygon(area.getBounds(), player.getLocation()),
      -1
    );
  });

  it("Player: Should return 1 if a player is outside the area", async () => {
    player = new Player("Mehdi", 48.8514708, 2.2972489);
    assert.equal(
      robustPointInPolygon(area.getBounds(), player.getLocation()),
      1
    );
  });

  it("Robust Polygon tests", async () => {
    assert.equal(robustPointInPolygon(polygon, [1.5, 1.5]), -1);
    assert.equal(robustPointInPolygon(polygon, [1.2, 1.9]), -1);
    assert.equal(robustPointInPolygon(polygon, [0, 1.9]), 1);
    assert.equal(robustPointInPolygon(polygon, [1.5, 2]), 0);
    assert.equal(robustPointInPolygon(polygon, [1.5, 2.2]), 1);
    assert.equal(robustPointInPolygon(polygon, [3, 5]), 1);
    assert.equal(robustPointInPolygon(polygon, [1.5, 2]), 0);
    let newpolygon = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    for (var j = 0; j < 3; ++j) {
      assert.equal(robustPointInPolygon(newpolygon, [0, 0]), -1);
      const subdiv = [];
      for (var i = 0; i < newpolygon.length; ++i) {
        const a = newpolygon[i];
        const b = newpolygon[(i + 1) % newpolygon.length];
        const c = [0.5 * (a[0] + b[0]), 0.5 * (a[1] + b[1])];
        subdiv.push(a, c);
        assert.equal(robustPointInPolygon(newpolygon, newpolygon[i]), 0);
        assert.equal(robustPointInPolygon(newpolygon, c), 0);
      }
      assert.equal(robustPointInPolygon(newpolygon, [1e10, 1e10]), 1);
      newpolygon = subdiv;
    }
  });

  it("should give the distance 0 between 2 entities which are at the same pos", async () => {
    assert.equal(distance(0, 0, 0, 0), 0);
  });
});
