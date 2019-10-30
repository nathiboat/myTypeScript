import BaseResponse from '../Shared/BaseResponse';
import { TextShortcut } from '../../Domain'

export default class GetShortcutsResponse extends BaseResponse {
    body(model : TextShortcut | TextShortcut[]) {
        if (Array.isArray(model)) return model.map(shortcut => this.removeUnderscore(shortcut))
        return this.removeUnderscore(model)
    }
}