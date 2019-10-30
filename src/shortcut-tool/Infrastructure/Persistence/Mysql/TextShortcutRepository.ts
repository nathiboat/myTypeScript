import Context from './Context'
import { TextShortcut } from '../../../Domain'
import ShortcutTransformer from './ShortcutTransformer'

class TextShortcutRepository {

    private _context : Context

    constructor(context : Context)  
    {
        this._context = context
    }

    async findAll() : Promise<TextShortcut[]> {
        this._context.connect()
        let result = await this._context.query('SELECT * from wali_text_shortcuts WHERE deleted=false ORDER BY name')
        this._context.complete()

        if (!Array.isArray(result) || result.length < 1) {
            throw new Error('No result found')
        } 
        return ShortcutTransformer.toModel(result);
    }

    async findAllDeleted() : Promise<TextShortcut[]> {
        this._context.connect()
        let result = await this._context.query('SELECT * from wali_text_shortcuts WHERE deleted=true')
        this._context.complete()

        if (!Array.isArray(result) || result.length < 1) {
            throw new Error('No result found')
        } 
        return ShortcutTransformer.toModel(result);
    }

    async removeOne(id : number) : Promise<null> {
        try {
            this._context.connect()
            await this._context.query('UPDATE wali_text_shortcuts SET deleted = true WHERE id=?', [id])
            this._context.complete()
        } catch(error) {
            this._context.rollback()
            throw error
        }
        return null
    }

    async restoreOne(id : number) : Promise<null> {
        try {
            this._context.connect()
            await this._context.query('UPDATE wali_text_shortcuts SET deleted = false WHERE id=?', [id])
            this._context.complete()
        } catch(error) {
            this._context.rollback()
            throw error
        }
        return null
    }

    async addOne(query : TextShortcut) : Promise<null> {
        try {
            this._context.connect()
            let rawQuery = ShortcutTransformer.toRaw(query)
            let columns = Object.keys(rawQuery).join(',')
            let values = Object.values(rawQuery)
            await this._context.query(`INSERT INTO wali_text_shortcuts (${columns}) VALUES (?)`, [values])
            this._context.complete()
            return null
        } catch(error) {
            this._context.rollback()
            throw error
        }
    }

    async updateOne(query : TextShortcut) : Promise<null> {
        try {
            this._context.connect()
            let rawQuery = ShortcutTransformer.toRaw(query)
            let { name, keys, content, id } = rawQuery;

            await this._context.query(`UPDATE wali_text_shortcuts SET name = ?, keys = ?, content = ? WHERE id = ?`, [name, keys, content, id])
            this._context.complete()
            return null
        } catch(error) {
            this._context.rollback()
            throw error
        }
    }
}

export default TextShortcutRepository