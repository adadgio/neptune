require("dotenv").config()
import * as neo4j from "neo4j-driver"

/**
 * Neo4j version: 4.2.4
 */
class NeoService {
    private $driver: any = null
    
    constructor() {
        if (null === this.$driver) {
            this.$driver = neo4j.driver(process.env.NEO4J_BOLT, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD))
        }
    }
    
    async close() {
        if (null !== this.$driver) {
            return this.$driver.close()
        } else {
            return Promise.resolve()
        }
    }

    firstOrNull(records: Array<any>) {
        return (records.length === 0) ? null : records[0].toObject()
    }

    async cypher(query: string, params: any = {}): Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            const session = this.$driver.session()

            session.run(query, params)
                .then((result: any) => {
                    resolve(result.records)
                }).catch(e => {
                    reject(e)
                })
                .then(() => {
                    session.close()
                })
        })
    }
}

export default new NeoService()