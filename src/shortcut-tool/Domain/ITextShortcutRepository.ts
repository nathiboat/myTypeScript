import TextShortcut from './TextShortcut'

export default interface ITextShortcutRepository {
    findAll() : Promise<TextShortcut[]>
    findAllDeleted() : Promise<TextShortcut[]>
    removeOne(id : number) : Promise<null>
    restoreOne(id : number) : Promise<null>
    addOne(query : TextShortcut) : Promise<null>
    updateOne(query : TextShortcut) : Promise<null>
}