import { TextShortcut } from "../../../Domain"

export default class ShortcutTransformer {
    static toModel(rawData : any[]) : TextShortcut[] {
        return rawData.map(data => new TextShortcut(data.name, data.keys, data.content, data.deleted, data.id, data.timeStamp))
    }

    static toRaw(model : TextShortcut) {
        return {
            name: model.name,
            keys: model.keys,
            content: model.content,
            deleted: model.deleted,
            id: model.id,
            timeStamp: model.timeStamp
        }
    }
}