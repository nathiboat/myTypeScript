import { ITextShortcutRepository } from '../../Domain/index'

export default class RestoreShortcut {
  textShortcutRepo: ITextShortcutRepository;

  constructor(
    textShortcutRepo: ITextShortcutRepository
  ) {
    this.textShortcutRepo = textShortcutRepo
  }

  async execute(id: number) {
    try {
      return await this.textShortcutRepo.restoreOne(id);
    } catch (error) {
      throw error;
    }
  }
}
