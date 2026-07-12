import { onCall, HttpsError } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();

const db = getFirestore("ai-studio-mevinserp-8508ed93-8dc1-47fa-8fdc-87ee68eae527");

export const verifyCertificate = onCall({
  cors: true, // Enables CORS for external calls from your front-end
}, async (request) => {
  // Option: enforce App Check if registered and configured in Firebase Console
  // if (request.app === undefined) {
  //   throw new HttpsError('failed-precondition', 'The function must be called from an App Check verified app.');
  // }

  const data = request.data;
  const certId = data?.certId;
  const certType = data?.certType;

  if (!certId || typeof certId !== 'string') {
    throw new HttpsError('invalid-argument', 'The function must be called with a valid certId.');
  }

  const collectionMap: Record<string, string> = {
    operator: 'operators',
    machine: 'machineCertificates',
    lifting: 'liftingToolCertificates'
  };

  const collectionName = collectionMap[certType];
  if (!collectionName) {
    throw new HttpsError('invalid-argument', 'The function must be called with a valid certType.');
  }

  try {
    const docRef = db.collection(collectionName).doc(certId.trim());
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      return {
        found: true,
        certId: certId.trim(),
        ...docSnap.data()
      };
    } else {
      return {
        found: false,
        message: 'Certificate or Operator card not found in database.'
      };
    }
  } catch (error: any) {
    console.error("Error fetching certificate:", error);
    throw new HttpsError('internal', error.message || 'An error occurred while verifying the certificate.');
  }
});
