"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Repository {
    constructor() {
        this.repo = [];
    }
    add(single) {
        this.repo.push(single);
    }
    set(multiple) {
        this.repo = [...multiple];
    }
    getAll() {
        return this.repo;
    }
}
exports.default = Repository;
