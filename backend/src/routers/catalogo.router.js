import { Router } from "express";
import { CatalogoCtl } from "../controllers/catalogo.controller.js";

const catalogoRouter = Router();

catalogoRouter.get("/", CatalogoCtl.getProductos);

export default catalogoRouter;