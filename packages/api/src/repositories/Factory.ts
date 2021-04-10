import { User, Folder, Document } from "@sync/common"

export default class Factory {
    static create(className: string, data?: any) {
        if (className === "User") {
            return new User(data)
        } else if (className === "Folder") {
            return new Folder(data)
        } else if (className === "Document") {
            return new Document(data)
        } else {
            throw Error(`Factory::create(<${className}>,<data?>) Un-available class for ${className}`)
        }
    }

    static fields(className: string, prefix: string = null) {
        if (className === "User") {
            return User.fields(prefix)
        } else if (className === "Folder") {
            return Folder.fields(prefix)
        } else if (className === "Document") {
            return Document.fields(prefix)
        } else {
            throw Error(`Factory::fields(<${className}>,<prefix?>) Un-available class for ${className}`)
        }
    }
}