import Staff from './Staff'


type StaffOptions = {
    name: string,
    email: string,
    state?: string,
    password?: string,
    description?: string,
    created?: string,
    updated?: string,
    id?: number
}

export default abstract class StaffFactory {
    static build(options: StaffOptions) {
        return new Staff(
            options.name,
            options.email,
            options.state,
            options.password,
            options.description,
            options.created,
            options.updated,
            options.id)
    }


}
