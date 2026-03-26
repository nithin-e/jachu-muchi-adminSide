import { Router } from "express";
import {
  filterGallery,
  getAllGallery,
  getAllGalleryInitial,
} from "../controllers/gallery.controller";

const router = Router();

router.get("/all", getAllGalleryInitial);
router.get("/filter", filterGallery);
router.get("/", getAllGallery);

export default router;
