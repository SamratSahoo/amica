import { auth, db } from "@/utils/firebase"
import { User } from "@/utils/types";
import { getBaseUrl } from "@/utils/urls";
import axios from "axios";
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";

export const createUser = async (email: string, firebaseUid: string) => {
    const response = await axios.post(getBaseUrl() + '/register_user', {
        uid: firebaseUid,
        email
    }, {
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    })
}

export const getUser = async () => {
    if (!auth.currentUser?.uid) {
        return null
    }


    const docRef = doc(db, "user-data", auth.currentUser?.uid)
    const docSnap = await getDoc(docRef);
    return docSnap.data();

}

export async function appendCategoryToUser(newCategory: string) {
    if (!auth.currentUser?.uid) {
        return;
    }
    const user = await getUser()
    await setDoc(doc(db, "user-data", auth.currentUser?.uid), { ...user, categories: [...user?.categories, newCategory] })

}

export const userAddRecording = async (encodedData: string, timestamp: Date) => {
    const response = await axios.post(getBaseUrl() + '/add_file', {
        'audio': encodedData,
        uid: auth.currentUser?.uid,
        timestamp,

    }, {
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    })
}


export const userSendChat = async (message: string) => {
    const response = await axios.post(getBaseUrl() + '/chat', {
        'uid': auth.currentUser?.uid,
        message

    }, {
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    })

    return response.data;
}


