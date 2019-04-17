"use strict";

import twoProduct from "two-product";
import robustSum from "robust-sum";
import robustScale from "robust-scale";
import robustSubtract from "robust-subtract";

const NUM_EXPAND = 5;
const EPSILON = 1.1102230246251565e-16;
const ERRBOUND3 = (3.0 + 16.0 * EPSILON) * EPSILON;
const ERRBOUND4 = (7.0 + 56.0 * EPSILON) * EPSILON;

function cofactor(m: number[][], c: number) {
  var result = new Array(m.length - 1);
  for (var i = 1; i < m.length; ++i) {
    var r = (result[i - 1] = new Array(m.length - 1));
    for (var j = 0, k = 0; j < m.length; ++j) {
      if (j === c) {
        continue;
      }
      r[k++] = m[i][j];
    }
  }
  return result;
}

function matrix(n: number) {
  var result = new Array(n);
  for (var i = 0; i < n; ++i) {
    result[i] = new Array(n);
    for (var j = 0; j < n; ++j) {
      result[i][j] = ["m", j, "[", n - i - 1, "]"].join("");
    }
  }
  return result;
}

function sign(n: number) {
  if (n & 1) {
    return "-";
  }
  return "";
}

function generateSum(expr) {
  if (expr.length === 1) {
    return expr[0];
  } else if (expr.length === 2) {
    return ["sum(", expr[0], ",", expr[1], ")"].join("");
  } else {
    var m = expr.length >> 1;
    return [
      "sum(",
      generateSum(expr.slice(0, m)),
      ",",
      generateSum(expr.slice(m)),
      ")"
    ].join("");
  }
}

function determinant(m: number[][]) {
  if (m.length === 2) {
    return [
      [
        "sum(prod(",
        m[0][0],
        ",",
        m[1][1],
        "),prod(-",
        m[0][1],
        ",",
        m[1][0],
        "))"
      ].join("")
    ];
  } else {
    var expr = [];
    for (var i = 0; i < m.length; ++i) {
      expr.push(
        [
          "scale(",
          generateSum(determinant(cofactor(m, i))),
          ",",
          sign(i),
          m[0][i],
          ")"
        ].join("")
      );
    }
    return expr;
  }
}

function orientation(n: number) {
  const pos = [];
  const neg = [];
  const m = matrix(n);
  const args = [];
  for (let i = 0; i < n; ++i) {
    if ((i & 1) === 0) {
      pos.push.apply(pos, determinant(cofactor(m, i)));
    } else {
      neg.push.apply(neg, determinant(cofactor(m, i)));
    }
    args.push("m" + i);
  }
  const posExpr = generateSum(pos);
  const negExpr = generateSum(neg);
  const funcName = "orientation" + n + "Exact";
  const code = [
    "function ",
    funcName,
    "(",
    args.join(),
    "){var p=",
    posExpr,
    ",n=",
    negExpr,
    ",d=sub(p,n);\
return d[d.length-1];};return ",
    funcName
  ].join("");
  const proc = new Function("sum", "prod", "scale", "sub", code);
  return proc(robustSum, twoProduct, robustScale, robustSubtract);
}

const orientation3Exact = orientation(3);
const orientation4Exact = orientation(4);

const orientations = {
  orientation0: () => {
    return 0;
  },
  orientation1: () => {
    return 0;
  },
  orientation2: (a: number[], b: number[]) => {
    return b[0] - a[0];
  },
  orientation3: (a: number[], b: number[], c: number[]) => {
    const l = (a[1] - c[1]) * (b[0] - c[0]);
    const r = (a[0] - c[0]) * (b[1] - c[1]);
    const det = l - r;
    let s: number;
    if (l > 0) {
      if (r <= 0) {
        return det;
      } else {
        s = l + r;
      }
    } else if (l < 0) {
      if (r >= 0) {
        return det;
      } else {
        s = -(l + r);
      }
    } else {
      return det;
    }
    const tol = ERRBOUND3 * s;
    if (det >= tol || det <= -tol) {
      return det;
    }
    return orientation3Exact(a, b, c);
  },
  orientation4: (a: number[], b: number[], c: number[], d: number[]) => {
    const adx = a[0] - d[0];
    const bdx = b[0] - d[0];
    const cdx = c[0] - d[0];
    const ady = a[1] - d[1];
    const bdy = b[1] - d[1];
    const cdy = c[1] - d[1];
    const adz = a[2] - d[2];
    const bdz = b[2] - d[2];
    const cdz = c[2] - d[2];
    const bdxcdy = bdx * cdy;
    const cdxbdy = cdx * bdy;
    const cdxady = cdx * ady;
    const adxcdy = adx * cdy;
    const adxbdy = adx * bdy;
    const bdxady = bdx * ady;
    const det =
      adz * (bdxcdy - cdxbdy) +
      bdz * (cdxady - adxcdy) +
      cdz * (adxbdy - bdxady);
    const permanent =
      (Math.abs(bdxcdy) + Math.abs(cdxbdy)) * Math.abs(adz) +
      (Math.abs(cdxady) + Math.abs(adxcdy)) * Math.abs(bdz) +
      (Math.abs(adxbdy) + Math.abs(bdxady)) * Math.abs(cdz);
    const tol = ERRBOUND4 * permanent;
    if (det > tol || -det > tol) {
      return det;
    }
    return orientation4Exact(a, b, c, d);
  }
};

export default orientations;

/*
function slowOrient(args) {
  const proc = CACHED[args.length];
  if (!proc) {
    proc = CACHED[args.length] = orientation(args.length);
  }
  return proc.apply(undefined, args);
}
function slowOrient(args) {
  var proc = CACHED[args.length];
  if (!proc) {
    proc = CACHED[args.length] = orientation(args.length);
  }
  return proc.apply(undefined, args);
}

function generateOrientationProc() {
  while (CACHED.length <= NUM_EXPAND) {
    CACHED.push(orientation(CACHED.length));
  }
  var args = [];
  var procArgs = ["slow"];
  for (var i = 0; i <= NUM_EXPAND; ++i) {
    args.push("a" + i);
    procArgs.push("o" + i);
  }
  var code = [
    "function getOrientation(",
    args.join(),
    "){switch(arguments.length){case 0:case 1:return 0;"
  ];
  for (var i = 2; i <= NUM_EXPAND; ++i) {
    code.push(
      "case ",
      i + "",
      ":return o",
      i + "",
      "(",
      args.slice(0, i).join(),
      ");"
    );
  }
  code.push(
    "}var s=new Array(arguments.length);for(var i=0;i<arguments.length;++i){s[i]=arguments[i]};return slow(s);}return getOrientation"
  );
  procArgs.push(code.join(""));

  var proc = Function.apply(undefined, procArgs);
  module.exports = proc.apply(undefined, [slowOrient].concat(CACHED));
  for (var i = 0; i <= NUM_EXPAND; ++i) {
    module.exports[i] = CACHED[i];
  }
}
generateOrientationProc();*/
