import { Router } from "express";
import {
  deleteGallery,
  filterGallery,
  getAllGalleryInitial,
} from "../controllers/gallery.controller";

const router = Router();

router.get("/all", getAllGalleryInitial);
router.get("/filter", filterGallery);
router.delete("/:id", deleteGallery);

export default router;
