import { BaseRepository } from "../../Repository/BaseRepository"
import { ICenter } from "../../Models/centerModel"

export interface ICenterRepository extends BaseRepository<ICenter> {

    addCenter(centerData:Partial<ICenter>):Promise<ICenter|null>

    getAllCenters():Promise<ICenter[]>

}