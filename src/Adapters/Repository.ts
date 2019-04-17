export default class Repository {
  repo: any[];
  constructor() {
    this.repo = [];
  }

  add(single: any) {
    this.repo.push(single);
  }

  set(multiple: any[]) {
    this.repo = [...multiple];
  }

  getAll() {
    return this.repo;
  }
}
