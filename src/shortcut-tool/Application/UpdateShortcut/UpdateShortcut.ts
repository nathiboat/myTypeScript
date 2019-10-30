import { ITextShortcutRepository } from '../../Domain/index'
import { TextShortcut } from '../../Domain';

export default class UpdateShortcut {
    textShortcutRepo : ITextShortcutRepository

  constructor(textShortcutRepo: ITextShortcutRepository) {
    this.textShortcutRepo = textShortcutRepo
  }

  async execute(name : string, keys : string, content : string, deleted : boolean, id:number) {
    try {
        return await this.textShortcutRepo.updateOne(new TextShortcut(name, keys, content, deleted, id))
    } catch (error) {
      throw error;
    }
  }
}
