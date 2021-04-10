import { v4 as uuidv4 } from "uuid"
import Neo from "../services/NeoService"
import Security from "../services/Security"
import { User, Document } from "@sync/common"
import { ApiError, has, option } from "@sync/common"
import { createObject, ParentObjectType } from "../repositories/createObject"

export default {

    index: async (req: any, res: any, next: Function) => {
        const user = await Security.user(req.headers)

        if (null === user) {
            res.send(403, { error: "Unauthorized of unrecognized user" })
            return next()
        }
        
        const query = `MATCH (d:Document)-[r:OWNED_BY|CAN_BE_VIEWED]->(u:User) WHERE u.id = $userId RETURN ${Document.fields("d")}, collect(type(r)) AS acls`
        const params = { userId: user.id }

        try {
            const records = await Neo.cypher(query, params)
            const documents = records.map(record => new Document(record.toObject()))
            res.send(200, documents)
            return next()
        } catch(e) {
            res.send(500, e)
            return next()
        }
    },

    create: async (req: any, res: any, next: Function) => {
        const user: User = await Security.user(req.headers)

        if (null === user) {
            res.send(403, (new ApiError("Unauthorized user" )).json())
            return next()
        }

        console.log(req.files.file)
        if (!has(req.files, ["file"])) {
            res.send(400, (new ApiError("Files.file is required in form-data")).json())
            return next()
        }

        //if (!has(req.body, ["document"])) {
        //    res.send(400, (new ApiError("Body param <document> is required")).json())
        //    return next()
        //}

        //let parentObject: ParentObjectType = null
        //const folderId = option(req.body, "folderId", null)

        //if (null !== folderId) {
        //    parentObject = { id: folderId, className: "Folder", acl: "BELONGS_TO" }
        //}
        
        //try {
        //    const document = await createObject(user, new Document(req.body.document), parentObject)
        //    res.send(200, document)
        //    return next()
        //} catch(e) {
        //    res.send(403, (new ApiError(e)).json())
        //    return next()
        //}
        res.send(200, {})
        return next()
    },
    
    get: async (req: any, res: any, next: Function) => {
        const user = await Security.user(req.headers)

        if (null === user) {
            res.send(403, { error: "Unauthorized of unrecognized user" })
            return next()
        }

        const query = `MATCH (d:Document)-[r:OWNED_BY|CAN_BE_VIEWED]->(u:User) WHERE u.id = $userId AND d.id = $docId RETURN ${Document.fields("d")}, collect(type(r)) AS acls`
        const params = { userId: user.id, docId: req.params.id}

        const records = await Neo.cypher(query, params)

        if (records.length === 0) {
            res.send(404, { error: "Document not found" })
            return next()
        }

        const document = new Document(records[0].toObject())

        res.send(200, document)
        return next()
    }
}