
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  writeBatch,
  setDoc,
  getDoc,
  enableNetwork,
  disableNetwork,
} from 'firebase/firestore';
import { db, isFirebaseEnabled } from './firebase';
import { type Task, type Idea, type UserContext } from './types';

export { db };

async function ensureNetwork(dbInstance: typeof db) {
    if (!dbInstance || !isFirebaseEnabled) throw new Error("Firestore is not initialized");
    try {
        await enableNetwork(dbInstance);
    } catch (e) {
        // This can happen if the network is already enabled, which is fine.
        console.warn("Could not enable network. It might already be online.", e);
    }
}


// TASKS

export async function addTaskToFirestore(userId: string, taskData: Omit<Task, 'id' | 'completed' | 'createdAt' | 'completedAt'>): Promise<string> {
  await ensureNetwork(db);
  const tasksCol = collection(db!, 'users', userId, 'tasks');
  const docRef = await addDoc(tasksCol, {
    ...taskData,
    completed: false,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getTasksFromFirestore(userId: string): Promise<Task[]> {
  await ensureNetwork(db);
  if (!db) return [];
  const tasksCol = collection(db, 'users', userId, 'tasks');
  const q = query(tasksCol, orderBy('createdAt', 'desc'));
  const tasksSnapshot = await getDocs(q);
  return tasksSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Task[];
}

export async function updateTaskInFirestore(userId: string, taskId: string, updates: Partial<Task>): Promise<void> {
  await ensureNetwork(db);
  if (!db) throw new Error("Firestore is not initialized");
  const taskDoc = doc(db, 'users', userId, 'tasks', taskId);
  await updateDoc(taskDoc, updates);
}

export async function archiveTaskInFirestore(userId: string, taskId: string): Promise<void> {
  await ensureNetwork(db);
  if (!db) throw new Error("Firestore is not initialized");
  const taskDocRef = doc(db, 'users', userId, 'tasks', taskId);
  await updateDoc(taskDocRef, {
    completed: true,
    completedAt: serverTimestamp(),
  });
}

export async function deleteArchivedTasksFromFirestore(userId: string, taskIds: string[]): Promise<void> {
  await ensureNetwork(db);
  if (!db) throw new Error("Firestore is not initialized");
  const batch = writeBatch(db);
  taskIds.forEach(taskId => {
    const taskDocRef = doc(db!, 'users', userId, 'tasks', taskId);
    batch.delete(taskDocRef);
  });
  await batch.commit();
}

// IDEAS

export async function addIdeaToFirestore(userId: string, ideaData: { text: string }): Promise<string> {
  await ensureNetwork(db);
  const ideasCol = collection(db!, 'users', userId, 'ideas');
  const docRef = await addDoc(ideasCol, {
    ...ideaData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getIdeasFromFirestore(userId:string): Promise<Idea[]> {
    await ensureNetwork(db);
    if (!db) return [];
    const ideasCol = collection(db, 'users', userId, 'ideas');
    const q = query(ideasCol, orderBy('createdAt', 'desc'));
    const ideasSnapshot = await getDocs(q);
    return ideasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as Idea[];
}

export async function deleteIdeaFromFirestore(userId: string, ideaId: string): Promise<void> {
  await ensureNetwork(db);
  if (!db) throw new Error("Firestore is not initialized");
  const ideaDoc = doc(db, 'users', userId, 'ideas', ideaId);
  await deleteDoc(ideaDoc);
}

// SKOOL NEWS

export async function addSkoolNewsToFirestore(newsData: any): Promise<string> {
  await ensureNetwork(db);
  const newsCol = collection(db!, 'skool_news');
  const docRef = await addDoc(newsCol, {
    ...newsData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// USER CONTEXT
export async function updateUserContextInFirestore(userId: string, context: string): Promise<void> {
    await ensureNetwork(db);
    if (!db) throw new Error("Firestore is not initialized");
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, { context }, { merge: true });
}

export async function getUserContextFromFirestore(userId: string): Promise<UserContext | null> {
    await ensureNetwork(db);
    if (!db) throw new Error("Firestore is not initialized");
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
        return docSnap.data() as UserContext;
    }
    return null;
}


// FEEDBACK
export async function addFeedbackToFirestore(feedbackData: any): Promise<string> {
  await ensureNetwork(db);
  const feedbackCol = collection(db!, 'feedback');
  const docRef = await addDoc(feedbackCol, {
    ...feedbackData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
