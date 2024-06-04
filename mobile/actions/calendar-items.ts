import { auth, db } from "@/utils/firebase"
import { CalendarItem } from "@/utils/types"
import { collection, getDocs, query, where } from "firebase/firestore"

export const getCalendarItems = async () => {
    if (!auth.currentUser?.uid) {
        return []
    }


    const q = query(collection(db, "calendar-items"), where("user", "==", auth.currentUser?.uid))
    const snapshot = await getDocs(q);
    const items: CalendarItem[] = []
    snapshot.forEach((doc) => { items.push(doc.data() as any) })
    return items
}