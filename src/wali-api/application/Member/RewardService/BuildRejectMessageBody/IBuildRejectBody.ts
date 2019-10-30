import {
    Member,
    Answer
} from './../../../../domain'


export default interface IBuildRejectBody
{
    execute(member : Member, answer : Answer) : Promise<string>
}