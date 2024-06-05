import { auth, db } from "@/utils/firebase"
import { User } from "@/utils/types";
import { addDoc, collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";

export const createUser = async (email: string, firebaseUid: string) => {
    return await addDoc(collection(db, "user-data"), {
        email,
        firebaseUid,
        categories: ['other']
    })
}

export const getUser = async () => {
    if (!auth.currentUser?.uid) {
        return null
    }


    const q = query(collection(db, "user-data"), where("firebaseUid", "==", auth.currentUser?.uid))
    const snapshot = await getDocs(q);
    const users: User[] = []
    snapshot.forEach((doc) => { users.push({ id: doc.id, ...doc.data() } as any) })
    return users.length ? users[0] : null;

}

export async function appendCategoryToUser(newCategory: string) {
    const user = await getUser()
    if (!user || !user.id) {
        return;
    }
    await setDoc(doc(db, "user-data", user.id), { ...user, categories: [...user?.categories, newCategory] })

}