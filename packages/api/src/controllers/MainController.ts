require("dotenv").config()
import * as jwt from "jsonwebtoken"
import Neo4j from "../services/NeoService"
import { User } from "@sync/common"

export default {
    index: async (req: any, res: any, next: Function) => {
        res.send(403, { error: "Unauthorized" })
        return next()
    },

    login: async (req: any, res: any, next: Function) => {
        const username = req.body.username
        const password = req.body.password

        const records = await Neo4j.cypher(`MATCH (u:User) WHERE u.username = $username RETURN ${User.fields("u")}`, { username: username })
        
        if (records.length === 0) {
            res.send(404, { error: "User not found" })
            return next()
        }
        
        const user = Neo4j.firstOrNull(records)

        // @todo Check password !

        const token = jwt.sign(user, process.env.APP_SECRET, { expiresIn: "45m" })
        const { iat, expiration } = jwt.decode(token)
        
        res.send(200, { user: user, iat: iat, expiration: expiration, token: token })
        return next()
    },
}