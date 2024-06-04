import { auth, db } from "@/utils/firebase"
import { TodoItem } from "@/utils/types"
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore"

export const getTodoItems = async () => {
    if (!auth.currentUser?.uid) {
        return []
    }


    const q = query(collection(db, "todo-items"), where("user", "==", auth.currentUser?.uid))
    const snapshot = await getDocs(q);
    const items: TodoItem[] = []
    snapshot.forEach((doc) => { items.push({ id: doc.id, ...doc.data() } as any) })
    return items

}

export const invertTodoItemCompletion = async (id: string) => {
    const docRef = doc(db, 'todo-items', id);
    const docSnap = await getDoc(docRef);

    // Get the current value of the boolean field
    const currentValue = docSnap.data()?.complete;

    const newValue = !currentValue;

    // Update the document with the new value
    await updateDoc(docRef, {
        complete: newValue
    });
}