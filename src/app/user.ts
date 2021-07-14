import { Trip } from "./trip";

export class User {
    constructor(
        public name : string,
        public email: string,
        public trips : Trip[]
    ){}
}
