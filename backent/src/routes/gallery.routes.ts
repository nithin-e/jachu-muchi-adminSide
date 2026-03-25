import { Router } from "express";
import {
  filterGallery,
  getAllGallery,
  getAllGalleryInitial,
} from "../controllers/gallery.controller";

const router = Router();

router.get("/gallery/all", getAllGalleryInitial);
router.get("/gallery/filter", filterGallery);
router.get("/gallery", getAllGallery);

export default router;
