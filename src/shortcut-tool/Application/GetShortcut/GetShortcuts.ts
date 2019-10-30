import { ITextShortcutRepository } from '../../Domain/index'
import BaseResponse from '../Shared/BaseResponse';

export default class GetShortcuts {
    textShortcutRepo : ITextShortcutRepository
    private _response : BaseResponse

  constructor(textShortcutRepo: ITextShortcutRepository, response: BaseResponse) {
    this.textShortcutRepo = textShortcutRepo
    this._response = response
  }

  async execute(type: string, id?: number) {
    try {
      switch (type) {
        case 'all':
          let all = await this.textShortcutRepo.findAll()
          return this._response.body(all)
        case 'deleted':
          let deleted = await this.textShortcutRepo.findAllDeleted()
          return this._response.body(deleted)
        default:
          throw Error('Type is not valid')
      }
    } catch (error) {
        console.log(error)
      throw error;
    }
  }
}
