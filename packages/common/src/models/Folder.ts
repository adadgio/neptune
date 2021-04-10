export class Folder {
    id: string
    name: string
    acls: Array<string>
    
    constructor(data?: any) {
        this.id = data.id
        this.name = data.name
        this.acls = data.acls
    }
    
    static fields(prefix?: string) {
        const fields = ["id", "name"]
        
        if (prefix) {
            return fields.map(field => `${prefix}.${field} AS ${field}`)
        } else {
            return fields
        }
    }
}