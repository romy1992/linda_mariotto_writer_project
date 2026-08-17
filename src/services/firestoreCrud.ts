import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

export function createCrudService<T extends { id: string }>(
  collectionName: string,
) {
  const col = collection(db, collectionName);

  return {
    async getById(id: string): Promise<T | null> {
      const snapshot = await getDoc(doc(col, id));
      return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as T) : null;
    },
    async create(data: Omit<T, "id">): Promise<string> {
      const ref = await addDoc(col, data);
      return ref.id;
    },
    async update(id: string, data: Partial<Omit<T, "id">>): Promise<void> {
      await updateDoc(doc(col, id), data);
    },
    async remove(id: string): Promise<void> {
      await deleteDoc(doc(col, id));
    },
  };
}
