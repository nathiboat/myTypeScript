export default interface ICheckPasswordHashService {
    execute(password: string, hash: string)  : boolean
}
