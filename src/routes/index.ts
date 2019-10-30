import staffRouter from './staff'
import roleRouter from './role'
import authRouter from './auth'
import memberRouter from './member'
import taskRouter from './tasks'
import shortcutRouter from './shortcut'

export namespace router {

    export const auth  = ()=> authRouter
    export const staff = ()=> staffRouter
    export const role = () => roleRouter
    export const member = () => memberRouter
    export const tasks = ()=> taskRouter
    export const shortcut = ()=> shortcutRouter

}
