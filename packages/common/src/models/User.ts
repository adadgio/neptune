export class User {
    id: string
    name: string
    username: string
    
    constructor(data?: any) {
        this.id = data.id
        this.name = data.name
        this.username = data.username
    }
    
    static fields(prefix?: string) {
        const fields = ["id", "username"]
        
        if (prefix) {
            return fields.map(field => `${prefix}.${field} AS ${field}`)
        } else {
            return fields
        }
    }
}