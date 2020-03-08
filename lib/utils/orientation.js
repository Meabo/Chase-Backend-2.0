"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const two_product_1 = require("two-product");
const robust_sum_1 = require("robust-sum");
const robust_scale_1 = require("robust-scale");
const robust_subtract_1 = require("robust-subtract");
const NUM_EXPAND = 5;
const EPSILON = 1.1102230246251565e-16;
const ERRBOUND3 = (3.0 + 16.0 * EPSILON) * EPSILON;
const ERRBOUND4 = (7.0 + 56.0 * EPSILON) * EPSILON;
function cofactor(m, c) {
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
function matrix(n) {
    var result = new Array(n);
    for (var i = 0; i < n; ++i) {
        result[i] = new Array(n);
        for (var j = 0; j < n; ++j) {
            result[i][j] = ["m", j, "[", n - i - 1, "]"].join("");
        }
    }
    return result;
}
function sign(n) {
    if (n & 1) {
        return "-";
    }
    return "";
}
function generateSum(expr) {
    if (expr.length === 1) {
        return expr[0];
    }
    else if (expr.length === 2) {
        return ["sum(", expr[0], ",", expr[1], ")"].join("");
    }
    else {
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
function determinant(m) {
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
    }
    else {
        var expr = [];
        for (var i = 0; i < m.length; ++i) {
            expr.push([
                "scale(",
                generateSum(determinant(cofactor(m, i))),
                ",",
                sign(i),
                m[0][i],
                ")"
            ].join(""));
        }
        return expr;
    }
}
function orientation(n) {
    const pos = [];
    const neg = [];
    const m = matrix(n);
    const args = [];
    for (let i = 0; i < n; ++i) {
        if ((i & 1) === 0) {
            pos.push.apply(pos, determinant(cofactor(m, i)));
        }
        else {
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
    return proc(robust_sum_1.default, two_product_1.default, robust_scale_1.default, robust_subtract_1.default);
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
    orientation2: (a, b) => {
        return b[0] - a[0];
    },
    orientation3: (a, b, c) => {
        const l = (a[1] - c[1]) * (b[0] - c[0]);
        const r = (a[0] - c[0]) * (b[1] - c[1]);
        const det = l - r;
        let s;
        if (l > 0) {
            if (r <= 0) {
                return det;
            }
            else {
                s = l + r;
            }
        }
        else if (l < 0) {
            if (r >= 0) {
                return det;
            }
            else {
                s = -(l + r);
            }
        }
        else {
            return det;
        }
        const tol = ERRBOUND3 * s;
        if (det >= tol || det <= -tol) {
            return det;
        }
        return orientation3Exact(a, b, c);
    },
    orientation4: (a, b, c, d) => {
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
        const det = adz * (bdxcdy - cdxbdy) +
            bdz * (cdxady - adxcdy) +
            cdz * (adxbdy - bdxady);
        const permanent = (Math.abs(bdxcdy) + Math.abs(cdxbdy)) * Math.abs(adz) +
            (Math.abs(cdxady) + Math.abs(adxcdy)) * Math.abs(bdz) +
            (Math.abs(adxbdy) + Math.abs(bdxady)) * Math.abs(cdz);
        const tol = ERRBOUND4 * permanent;
        if (det > tol || -det > tol) {
            return det;
        }
        return orientation4Exact(a, b, c, d);
    }
};
exports.default = orientations;
