import { v4 as uuidv4 } from "uuid"
import { Folder } from "@sync/common"
import { Document } from "@sync/common"

export function createObject(userId: string, instance: Folder|Document, file: any) {
    
    const uuid = uuidv4()
    const label = instance.constructor.name

    const query = `MERGE (n:${label}{id:$uuid})
        SET n.name = $name
        RETURN a.id AS id, a.name AS name, a.path AS path`

    const params = { uuid: uuid }

}