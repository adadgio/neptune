require("dotenv").config()
import { v4 as uuidv4 } from "uuid"
import Neo from "../services/NeoService"
import Security from "../services/Security"
import { Folder } from "@sync/common"
import { ApiError, has } from "@sync/common"
import { createObject } from "../repositories/createObject"

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

        // validate request body input
        if (!has(req.body, ['folder'])) {
            res.send(400, (new ApiError(`Body parameter <folder> is required`)).json())
            return next()
        }

        try {
            const folder = await createObject(user, new Folder(req.body.folder))
            res.send(200, folder)
            return next()
        } catch (e) {
            res.send(403, (new ApiError(e)).json())
            return next()
        }
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