import { FieldValue, getFirestore as _getFirestore } from 'firebase-admin/firestore';
import type { WithId } from '@local/shared';
import type {
  DocumentData,
  FirestoreDataConverter,
  Firestore,
  Timestamp,
  WithFieldValue,
} from 'firebase-admin/firestore';

let firestore: Firestore;
const getFirestore = () => {
  if (firestore) return firestore;

  firestore = _getFirestore();
  firestore.settings({
    preferRest: true,
    timestampsInSnapshots: true,
  });
  return firestore;
};

const { serverTimestamp: _severTimestamp } = FieldValue;

const serverTimestamp = () => _severTimestamp() as Timestamp;

const getConverter = <T extends DocumentData>(): FirestoreDataConverter<WithId<T>, T> => ({
  toFirestore: (data) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = data;
    return rest as WithFieldValue<T>;
  },
  fromFirestore: (snapshot) => {
    return { id: snapshot.id, ...snapshot.data() } as WithId<T>;
  },
});

export { serverTimestamp, getConverter, getFirestore };
