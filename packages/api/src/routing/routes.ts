import MainController from "../controllers/MainController"
import FolderController from "../controllers/FolderController"
import DocumentController from "../controllers/DocumentController"

export default (app: any) => {

    app.get("/", MainController.index)
    app.post("/login", MainController.login)

    app.get("/folders", FolderController.index)
    app.post("/folder", FolderController.create)
    app.get("/folder/:id", FolderController.get)

    app.get("/documents", DocumentController.index)
    app.post("/document", DocumentController.create)
    app.get("/document/:id", DocumentController.get)
}