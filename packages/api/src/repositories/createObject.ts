import { v4 as uuidv4 } from "uuid"
import { User, Folder, Document } from "@sync/common"
import { strToLabel } from "@sync/common"
import Factory from "./Factory"
import Neo from "../services/NeoService"

export type ParentObjectType = {
    id: string
    className: string
    acl?: string
}

export async function createObject(user: User, object: User|Folder|Document, parentObject: ParentObjectType = null, file: any = null): Promise<User|Folder|Document> {
    
    const uuid = uuidv4()
    const className = object.constructor.name
    const label = strToLabel(className)
    
    const params: any = { userId: user.id, uuid: uuid, name: object.name }

    let queryForParent = ""
    if (null !== parentObject) {
        params.parentId = parentObject.id
        queryForParent = `WITH u, n , r MATCH (p:${parentObject.className}{id:$parentId}) MERGE (n)-[:BELONGS_TO]->(p)`
    }

    const query = `MATCH (u:User{id:$userId})
        MERGE (n:${label}{id:$uuid})-[r:OWNED_BY]->(u)
        ${queryForParent}
        SET n.name = $name
        RETURN ${Factory.fields(className, "n")}, collect(type(r)) AS acls`

    return new Promise((resolve, reject) => {
        Neo.cypher(query, params).then(records => {
            if (records.length === 0) {
                reject(`Object not created. Maybe parent with given id does not exist with?`)
            } else {
                resolve(Factory.create(className, records[0].toObject()))
            }
        }).catch(e => {
            reject(e)
        })
    })
}