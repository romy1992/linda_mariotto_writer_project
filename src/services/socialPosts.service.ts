import { createCrudService } from "./firestoreCrud";
import type { SocialPost } from "../types";

export const socialPostsService = createCrudService<SocialPost>("socialPosts");
