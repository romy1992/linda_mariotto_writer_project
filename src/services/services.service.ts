import { createCrudService } from "./firestoreCrud";
import type { Service } from "../types";

export const servicesService = createCrudService<Service>("services");
