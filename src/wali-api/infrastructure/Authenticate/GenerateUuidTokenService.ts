import uuidv4 from 'uuid/v4'

export default abstract class GenerateUuidTokenService
{
    static execute()
    {
        return uuidv4()
    }
}
