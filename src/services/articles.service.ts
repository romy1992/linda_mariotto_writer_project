import { createCrudService } from "./firestoreCrud";
import type { Article } from "../types";

export const articlesService = createCrudService<Article>("articles");
