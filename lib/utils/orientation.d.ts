declare const orientations: {
    orientation0: () => number;
    orientation1: () => number;
    orientation2: (a: number[], b: number[]) => number;
    orientation3: (a: number[], b: number[], c: number[]) => any;
    orientation4: (a: number[], b: number[], c: number[], d: number[]) => any;
};
export default orientations;
