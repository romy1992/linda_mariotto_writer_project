import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

export function useDocument<T>(collectionPath: string, docId: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!docId) {
      setData(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const ref = doc(db, collectionPath, docId);
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        setData(
          snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as T) : null,
        );
        setIsLoading(false);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      },
    );
    return unsubscribe;
  }, [collectionPath, docId]);

  return { data, isLoading, error };
}
