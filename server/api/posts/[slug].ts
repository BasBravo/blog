import { db } from '~/utils/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug
  if (!slug) return { error: 'Slug no proporcionado' }

  const postsRef = collection(db, "posts")
  const q = query(postsRef, where("slug", "==", slug))
  const snapshot = await getDocs(q)

  if (snapshot.empty) {
    throw createError({ statusCode: 404, statusMessage: 'Artículo no encontrado' })
  }

  return snapshot.docs[0].data()
})