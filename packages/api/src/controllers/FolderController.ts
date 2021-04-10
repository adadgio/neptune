require("dotenv").config()
import { v4 as uuidv4 } from "uuid"
import Neo from "../services/NeoService"
import Security from "../services/Security"
import { Folder } from "@sync/common"
import { ApiError, has } from "@sync/common"

export default {

    index: async (req: any, res: any, next: Function) => {
        const user = await Security.user(req.headers)

        if (null === user) {
            res.send(403, { error: "Unauthorized of unrecognized user" })
            return next()
        }
        
        const query = `MATCH (f:Folder)-[r:OWNED_BY|CAN_BE_VIEWED]->(u:User) WHERE u.id = $userId RETURN ${Folder.fields("f")}, collect(type(r)) AS acls`
        const params = { userId: user.id }
        
        try {
            const records = await Neo.cypher(query, params)
            const documents = records.map(record => new Folder(record.toObject()))
            res.send(200, documents)
            return next()
        } catch(e) {
            res.send(500, (new ApiError(e).json()))
            return next()
        }
    },

    create: async (req: any, res: any, next: Function) => {
        const user = await Security.user(req.headers)

        // validate input
        if (!has(req.body, ['name'])) {
            res.send(400, (new ApiError(`Parameter <name> is required`)).json())
            return next()
        }

        if (null === user) {
            res.send(403, { error: "Unauthorized of unrecognized user" })
            return next()
        }

        const uuid = uuidv4()
        const query = `MATCH (u:User{id:$userId}) MERGE (f:Folder{id:$uuid})-[r:OWNED_BY]->(u) SET f.name = $name RETURN ${Folder.fields("f")}, collect(type(r)) AS acls`
        const params = { uuid: uuid, userId: user.id, name: req.body.name }

        const records = await Neo.cypher(query, params)

        if (records.length === 0) {
            res.send(404, { error: "Document not found" })
            return next()
        }

        const document = new Folder(records[0].toObject())

        res.send(200, document)
        return next()
    },
    
    get: async (req: any, res: any, next: Function) => {
        const user = await Security.user(req.headers)

        if (null === user) {
            res.send(403, { error: "Unauthorized of unrecognized user" })
            return next()
        }

        const query = `MATCH (f:Folder)-[r:OWNED_BY|CAN_BE_VIEWED]->(u:User) WHERE u.id = $userId AND f.id = $folderId RETURN ${Folder.fields("f")}, collect(type(r)) AS acls`
        const params = { userId: user.id, folderId: req.params.id}

        try {
            const records = await Neo.cypher(query, params)
            
            if (records.length === 0) {
                res.send(404, { error: "Folder not found" })
                return next()
            }

            const folder = new Folder(records[0].toObject())
            res.send(200, folder)
            return next()

        } catch(e) {
            res.send(500, e)
            return next()
        }
        
    }
}