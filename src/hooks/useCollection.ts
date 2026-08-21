import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "../firebase/config";

const EMPTY_CONSTRAINTS: QueryConstraint[] = [];

export function useCollection<T>(
  collectionPath: string,
  constraints: QueryConstraint[] = EMPTY_CONSTRAINTS,
) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, collectionPath), ...constraints);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setData(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T),
        );
        setIsLoading(false);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      },
    );
    return unsubscribe;
    // constraints must be memoized by the caller (e.g. useMemo) to avoid refetch loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionPath, constraints]);

  return { data, isLoading, error };
}
