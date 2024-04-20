import { FieldValue, getFirestore as _getFirestore } from 'firebase-admin/firestore';
import type { VectorQuery } from '@google-cloud/firestore';
import type { WithId } from '@local/shared';
import type {
  DocumentData,
  FirestoreDataConverter,
  Firestore,
  Timestamp,
  WithFieldValue,
  CollectionReference,
  DocumentReference,
  Query,
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

const getDocumentData = async <T>(ref: DocumentReference<T>) =>
  ref.get().then((doc) => ({ data: { id: doc.id, ...doc.data() } as WithId<T>, exists: doc.exists }));

const getCollectionData = async <T>(query: CollectionReference<T> | Query<T> | VectorQuery<T>) =>
  query.get().then(({ docs }) => docs.map((doc) => ({ id: doc.id, ...doc.data() }) as WithId<T>));

export { serverTimestamp, getConverter, getFirestore, getDocumentData, getCollectionData };
