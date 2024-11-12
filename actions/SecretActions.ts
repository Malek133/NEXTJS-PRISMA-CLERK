'use server'

import { currentUser } from "@clerk/nextjs/server";
import prisma from '.././lib/db'
import CryptoJS from "crypto-js";

const encryptSecret = (text: string) => {
    return CryptoJS.AES.encrypt(text, process.env.ENCRYPTION_KEY!).toString();
  }

  const decryptSecret = (ciphertext: string) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.ENCRYPTION_KEY!);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  
  export async function createSecret(content: string) {
    try {
      // Récupère l'utilisateur connecté
      const user = await currentUser();
      // Vérifie que l'utilisateur existe et a un ID
      if (!user?.id) throw new Error('Not authorized')
  
      // Chiffre le contenu avant de le stocker
      const encryptedContent = encryptSecret(content);
  
      // Crée ou met à jour le secret en base de données
      await prisma.secret.upsert({
        where: { userId: user.id },  // Recherche par userId
        update: { content: encryptedContent },  // Si trouvé, met à jour
        create: { userId: user.id, content: encryptedContent }  // Si non trouvé, crée
      })
      return { success: true }
    } catch (error) {
      // En cas d'erreur, retourne l'erreur avec le message
      return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' }
    }
  }

  export async function getSecret() {
    try {
      // Récupère l'utilisateur connecté
      const user = await currentUser();
      // Vérifie que l'utilisateur existe et a un ID
      if (!user?.id) throw new Error('Not authorized')
  
      // Recherche le secret en base de données
      const secret = await prisma.secret.findUnique({
        where: { userId: user.id }
      })
  
      // Déchiffre le contenu si un secret existe, sinon renvoie une chaîne vide
      const decryptedContent = secret ? decryptSecret(secret.content) : '';
      return { success: true, content: decryptedContent }
    } catch (error) {
      // En cas d'erreur, retourne l'erreur avec le message
      return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' }
    }
  }