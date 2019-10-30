import { ITextShortcutRepository } from '../../Domain/index'
import { TextShortcut } from '../../Domain';

export default class PostShortcut {
    textShortcutRepo : ITextShortcutRepository

  constructor(textShortcutRepo: ITextShortcutRepository) {
    this.textShortcutRepo = textShortcutRepo
  }

  async execute(name : string, keys : string, content : string, deleted : boolean) {
    try {
        return await this.textShortcutRepo.addOne(new TextShortcut(name, keys, content, deleted))
    } catch (error) {
      throw error;
    }
  }
}
