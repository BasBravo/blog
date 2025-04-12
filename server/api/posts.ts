import { db } from '~/utils/firebase'
import { collection, getDocs } from 'firebase/firestore'

export default defineEventHandler(async () => {
  const postsRef = collection(db, "posts")
  const snapshot = await getDocs(postsRef)

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
})