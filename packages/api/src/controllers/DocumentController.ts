import { v4 as uuidv4 } from "uuid"
import Neo from "../services/NeoService"
import Security from "../services/Security"
import { Document } from "@sync/common"

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
        const user = await Security.user(req.headers)

        if (null === user) {
            res.send(403, { error: "Unauthorized of unrecognized user" })
            return next()
        }

        const uuid = uuidv4()
        const query = `MERGE (d:Document{id:$uuid}) SET d.name = "First document" RETURN ${Document.fields("d")}`
        const params = { uuid: uuid }

        const records = await Neo.cypher(query, params)

        if (records.length === 0) {
            res.send(404, { error: "Document not found" })
            return next()
        }

        const document = new Document(records[0].toObject())

        res.send(200, document)
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