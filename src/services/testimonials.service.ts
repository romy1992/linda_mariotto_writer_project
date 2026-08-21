import { createCrudService } from "./firestoreCrud";
import type { Testimonial } from "../types";

export const testimonialsService = createCrudService<Testimonial>("testimonials");
