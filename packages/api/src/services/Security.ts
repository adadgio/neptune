require("dotenv").config()
import * as jwt from "jsonwebtoken"
import Neo from "./NeoService"
import { User } from "@sync/common"

/**
 * Security and user authentication
 */
class Security {

    async user(headers: any): Promise<any> {
        const token = headers.authorization.split("Bearer ")[1]
        const decodedUser = jwt.verify(token, process.env.APP_SECRET)
        
        const records = await Neo.cypher(`MATCH (u:User) WHERE u.id = $id RETURN ${User.fields("u")}`, { id: decodedUser.id })
        
        return new User(Neo.firstOrNull(records))
    }
}

export default new Security()