export class Trip {
    constructor(
        public tripId : number|undefined,
        public startingPoint : string,
        public farthestPoint : string,
        public distance : number,
        public back : boolean
    ){}
}
