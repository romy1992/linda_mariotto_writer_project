import { createCrudService } from "./firestoreCrud";
import type { ContactRequest } from "../types";

export const contactsService = createCrudService<ContactRequest>("contacts");
