import { SeoController } from "../../controllers/seo.controller";
import { SeoRepository } from "../../repositories/implementations/seo.repository";
import { SeoService } from "../../services/implementations/seo.service";

const seoRepository = new SeoRepository();
const seoService = new SeoService(seoRepository);

export const seoController = new SeoController(seoService);
