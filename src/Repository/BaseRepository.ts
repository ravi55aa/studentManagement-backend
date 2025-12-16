
import { Document,FilterQuery,Model } from "mongoose";



export class BaseRepository 
    <T extends Document> {
        
        protected model:Model<T>
        
        constructor(model:Model<T>){
            this.model=model;
        }



        //*FIND */
        public async findOne(filter:FilterQuery<T>) 
        : Promise<T|null>{
                return this.model.findOne(filter).exec()
        }


        public async findById(id:string) 
        : Promise<T|null>{
            return this.model.findById(id).exec();
        }


        public async findMany(filter:FilterQuery<T>):Promise<T|{}>{
            return this.model.find(filter).exec();
        }



        //**Create */
        public async create(data: Partial<T>)
        : Promise<T> {
            const newUser = 
                await this.model.create(data);
            return newUser;
        }

}
