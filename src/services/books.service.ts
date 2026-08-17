import { createCrudService } from "./firestoreCrud";
import type { Book } from "../types";

export const booksService = createCrudService<Book>("books");
