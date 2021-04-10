require("dotenv").config()
//import * as xss from "xss"
const AWS = require('aws-sdk')
import * as helmet from "helmet"
import * as restify from "restify"
//import * as errors from "restify-errors"
import * as bcrypt from "bcrypt"
import * as corsMiddleware from "restify-cors-middleware2"
import * as rjwt from "restify-jwt-community"
import routes from "./routing/routes"
import Neo from "./services/NeoService"

const app = restify.createServer()
const cors = corsMiddleware({
    preflightMaxAge: 5,
    origins: ["*"],
    //allowMethods: ["*"],
    allowHeaders: ["Authorization"],
})

//AWS.config.update({ accessKeyId: '', secretAccessKey: '', region: 'eu-west-2' });
//var s3 = new AWS.S3()

//var params = {
//    Bucket: 'neo4r',
//    Delimiter: '',
//    Prefix: ''
//}

//s3.listObjects(params, function (err, data) {
//    if (err) throw err;
//    console.log(data);
//})


const encryptedPassword = bcrypt.hashSync("frenchfrog", 10)
const skipAuthRoutes = ["/login"]

function errorHandlingMiddleware(req: any, res: any, next: Function) {
    console.log("OK")
    res.send(400, { oops: "ooop" })
    return next()
}

//app.use(xss())
app.use(helmet())
app.pre(cors.preflight)
app.use(cors.actual)
app.use(restify.plugins.queryParser())
app.use(restify.plugins.acceptParser(app.acceptable))
app.use(restify.plugins.bodyParser({ maxBodySize: (8 * 1024) }))
app.use(rjwt({ secret: process.env.APP_SECRET }).unless({ path: skipAuthRoutes }))
//app.use(errorHandlingMiddleware)

routes(app)

app.listen(process.env.APP_PORT, () => {
    console.log(`Server listening on port ${process.env.APP_PORT}`)
})