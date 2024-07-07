import { deleteThreadVector, threadVectorRef } from '../../models/threadVector.js';
import { getDocumentData } from '../../utils/firebase/firestore.js';
import { onDocumentDeleted as _onDocumentDeleted } from '../../utils/firebase/functions.js';

export const onDocumentDeleted = _onDocumentDeleted({ document: 'threads/{id}' }, async (event) => {
  const { id } = event.params;
  const { exists } = await getDocumentData(threadVectorRef({ id }));
  exists && (await deleteThreadVector({ id }));
});
