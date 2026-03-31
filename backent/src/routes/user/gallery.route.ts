import { Router } from "express";
import { getAllGalleryInitial } from "../../controllers/gallery.controller";

const galleryRouter = Router();

galleryRouter.post("/all", getAllGalleryInitial);

export default galleryRouter;