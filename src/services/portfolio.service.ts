import { createCrudService } from "./firestoreCrud";
import type { PortfolioItem } from "../types";

export const portfolioService = createCrudService<PortfolioItem>("portfolio");
