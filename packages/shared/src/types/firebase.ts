import type { Timestamp as ClientTimestamp } from 'firebase/firestore';
import type { Timestamp as AdminTimestamp } from 'firebase-admin/firestore';

export type WithId<Data> = Data & { id: string };

export type Timestamp = ClientTimestamp | AdminTimestamp;
