import orient from "./orientation";
const kmInMeters = 1000;

export function distance(lat1, lon1, lat2, lon2) {
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

export function distanceByLoc(locA, locB) {
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

export function getRandomLocationInsidePolygon(polygon: number[][]) {
  const r = Math.random();
  const t = Math.random();
  const ABX = polygon[1][1] - polygon[0][1];
  const ABY = polygon[1][0] - polygon[0][0];
  const ADX = polygon[3][1] - polygon[0][1];
  const ADY = polygon[3][0] - polygon[0][0];
  const newlocx = ABX * r + ADX * t + polygon[0][1];
  const newlocy = ABY * r + ADY * t + polygon[0][0];
  return {latitude: newlocy, longitude: newlocx};
}
