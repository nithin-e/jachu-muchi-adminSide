import { Router } from "express";
import {
  createGallery,
  deleteGallery,
  filterGallery,
  getAllGalleryInitial,
  getGalleryById,
  updateGallery,
} from "../../controllers/gallery.controller";
import { GalleryUploadMiddleware } from "../../middlewares/implementations/GalleryUploadMiddleware";

const router = Router();
const galleryUpload = new GalleryUploadMiddleware();

router.get("/all", getAllGalleryInitial);
router.get("/filter", filterGallery);
router.get("/:id", getGalleryById);
router.post("/", galleryUpload.handle.bind(galleryUpload), createGallery);
router.put("/:id", galleryUpload.handle.bind(galleryUpload), updateGallery);
router.delete("/:id", deleteGallery);

export default router;
