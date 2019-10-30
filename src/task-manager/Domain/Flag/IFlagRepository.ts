import Flag from './Flag'
import TaskType from './../TaskType'



export default interface IFlagRepository
{
    findOne(id : number) : Promise<Flag>

    findByTask(type : TaskType, id : number) : Promise<Flag[]>

    add(flag: Flag) : Promise<void>
}