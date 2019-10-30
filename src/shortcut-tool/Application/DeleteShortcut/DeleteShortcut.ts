import { ITextShortcutRepository } from '../../Domain/index'

export default class DeleteShortcut {
    textShortcutRepo : ITextShortcutRepository

  constructor(textShortcutRepo: ITextShortcutRepository) {
    this.textShortcutRepo = textShortcutRepo
  }

  async execute(id : number) {
    try {
      return await this.textShortcutRepo.removeOne(id)
    } catch (error) {
      throw error;
    }
  }
}