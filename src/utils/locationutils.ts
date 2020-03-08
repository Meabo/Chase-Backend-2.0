import orient from "./orientation";
import earcut from "earcut"

export function distance(lat1: number, lon1: number, lat2: number, lon2: number) {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  }
  const p = 0.017453292519943295; // Math.PI / 180
  const c = Math.cos;
  const a =
    0.5 -
    c((lat2 - lat1) * p) / 2 +
    (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

  return 12742 * Math.asin(Math.sqrt(a)) * 1000; // 2 * R; R = 6371 km
}

export function distanceByLoc(locA: number[], locB: number[]) {
  if (locA[0] === locB[0] && locA[1] === locB[1]) {
    return 0;
  }
  const p = 0.017453292519943295; // Math.PI / 180
  const c = Math.cos;
  const a =
    0.5 -
    c((locB[0] - locA[0]) * p) / 2 +
    (c(locA[0] * p) * c(locB[0] * p) * (1 - c((locB[1] - locA[1]) * p))) / 2;

  return 12742 * Math.asin(Math.sqrt(a)) * 1000; // 2 * R; R = 6371 km
}

export function robustPointInPolygon(vs: number[][], point: number[]) {
  const x = point[0];
  const y = point[1];
  const n = vs.length;
  let inside = 1;
  let lim = n;

  for (let i = 0, j = n - 1; i < lim; j = i++) {
    const a = vs[i];
    const b = vs[j];
    const yi = a[1];
    const yj = b[1];
    if (yj < yi) {
      if (yj < y && y < yi) {
        const s = orient.orientation3(a, b, point);
        if (s === 0) {
          return 0;
        } else {
          if (s > 0) {
            inside ^= 1 | 0;
          } else {
            inside ^= 0 | 0;
          }
        }
      } else if (y === yi) {
        const c = vs[(i + 1) % n];
        const yk = c[1];
        if (yi < yk) {
          const s: number = orient.orientation3(a, b, point);
          if (s === 0) {
            return 0;
          } else {
            if (s > 0) {
              inside ^= 1 | 0;
            } else {
              inside ^= 0 | 0;
            }
          }
        }
      }
    } else if (yi < yj) {
      if (yi < y && y < yj) {
        const s = orient.orientation3(a, b, point);
        if (s === 0) {
          return 0;
        } else {
          if (s > 0) {
            inside ^= 0 | 0;
          } else {
            inside ^= 1 | 0;
          }
        }
      } else if (y === yi) {
        const c = vs[(i + 1) % n];
        const yk = c[1];
        if (yk < yi) {
          const s = orient.orientation3(a, b, point);
          if (s === 0) {
            return 0;
          } else {
            if (s > 0) {
              inside ^= 0 | 0;
            } else {
              inside ^= 1 | 0;
            }
          }
        }
      }
    } else if (y === yi) {
      let x0 = Math.min(a[0], b[0]);
      let x1 = Math.max(a[0], b[0]);
      if (i === 0) {
        while (j > 0) {
          const k = (j + n - 1) % n;
          const p = vs[k];
          if (p[1] !== y) {
            break;
          }
          const px = p[0];
          x0 = Math.min(x0, px);
          x1 = Math.max(x1, px);
          j = k;
        }
        if (j === 0) {
          if (x0 <= x && x <= x1) {
            return 0;
          }
          return 1;
        }
        lim = j + 1;
      }
      const y0 = vs[(j + n - 1) % n][1];
      while (i + 1 < lim) {
        const p = vs[i + 1];
        if (p[1] !== y) {
          break;
        }
        const px = p[0];
        x0 = Math.min(x0, px);
        x1 = Math.max(x1, px);
        i += 1;
      }
      if (x0 <= x && x <= x1) {
        return 0;
      }
      const y1 = vs[(i + 1) % n][1];
      if (x < x0 && y0 < y !== y1 < y) {
        inside ^= 1;
      }
    }
  }
  return 2 * inside - 1;
}

/*export function getRandomLocationInsidePolygon(polygon: number[][]) {
  const r = Math.random();
  const t = Math.random();
  const ABX = polygon[1][1] - polygon[0][1];
  const ABY = polygon[1][0] - polygon[0][0];
  const ADX = polygon[3][1] - polygon[0][1];
  const ADY = polygon[3][0] - polygon[0][0];
  const newlocx = ABX * r + ADX * t + polygon[0][1];
  const newlocy = ABY * r + ADY * t + polygon[0][0];
  return {latitude: newlocy, longitude: newlocx};
}*/
function getTriangleArea(triangle: number[][]) {
  const [a, b, c] = triangle;
  
  return 0.5 * (
    (b[0] - a[0]) * (c[1] - a[1]) -
    (c[0] - a[0]) * (b[1] - a[1])
  );
}

export function triangulate(polygon: number[][]) {
  // [[x0, y0], [x1, y1], ...] ==> [x0,y0, x1,y1, ....]
  const flatPoints = polygon.reduce((f, p) => [...f, ...p], []);
  // indices to coordinate "pairs" in the "flatPoints" array
  const indices = earcut(flatPoints);
  
  const triangles = [];
  
  // three indices describe a triangle
  for (let i = 0; i < indices.length; i += 3) {
    const triangleIndices = [indices[i], indices[i + 1], indices[i + 2]];
    const points = triangleIndices.map(index => {
      const x = flatPoints[index * 2];
      const y = flatPoints[index * 2 + 1];
      
      return [x, y];
    });
	
    // A triangle is a set of 3 points: [a, b, c] where each point has the form [x, y]
    triangles.push(points);
  }
  return triangles;
}


function generateDistribution(triangles) {
  const totalArea = triangles.reduce((sum, triangle) => {
    return sum + getTriangleArea(triangle), 0
  });
  const cumulativeDistribution = [];
  
  for (let i = 0; i < triangles.length; i++) {
    const lastValue = cumulativeDistribution[i - 1] || 0;
    const nextValue = lastValue + getTriangleArea(triangles[i]) / totalArea;
    cumulativeDistribution.push(nextValue);
  }
  // [area1, area1 + aera2, area1 + area2 + area3, ...]
  return cumulativeDistribution;
}

function selectRandomTriangle(triangles) {
  const cumulativeDistribution = generateDistribution(triangles);
  const rnd = Math.random();
  const index = cumulativeDistribution.findIndex(v => v > rnd);

  return triangles[index];
}

export function calcRandomPointInTriangle(triangles) {
  const triangle = selectRandomTriangle(triangles);
  let wb = Math.random();
  let wc = Math.random();

  // point will be outside of the triangle, invert weights
  if (wb + wc > 1) {
    wb = 1 - wb;
    wc = 1 - wc;
  }

  const [a, b, c] = triangle.map(coords => ({x: coords[0], y: coords[1]}));

  const rb_x = wb * (b.x - a.x);
  const rb_y = wb * (b.y - a.y);
  const rc_x = wc * (c.x - a.x);
  const rc_y = wc * (c.y - a.y);

  const r_x = rb_x + rc_x + a.x;
  const r_y = rb_y + rc_y + a.y;

  return {latitude: r_x, longitude: r_y}
}
