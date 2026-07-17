import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as nodemailer from "nodemailer";

initializeApp();

const db = getFirestore("ai-studio-mevinserp-8508ed93-8dc1-47fa-8fdc-87ee68eae527");

// Configure your email transporter
// RECOMMENDATION: Use environment variables for these values
// firebase functions:config:set email.user="your-email@gmail.com" email.pass="your-app-password"
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'info@mev-ins.com', // Replace with your email
    pass: process.env.EMAIL_PASS // Replace with your App Password
  }
});

export const verifyCertificate = onCall({
  cors: true, 
}, async (request) => {
  // ... (existing verifyCertificate logic remains)
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

/**
 * Triggered when a new contact request is added to Firestore.
 * Sends an email notification to the administrator.
 */
export const onContactRequestCreated = onDocumentCreated("contactRequests/{requestId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    console.log("No data associated with the event");
    return;
  }

  const data = snapshot.data();
  const requestId = event.params.requestId;

  console.log(`Processing contact request: ${requestId}`, data);

  const mailOptions = {
    from: `"MEV Website" <${process.env.EMAIL_USER || 'info@mev-ins.com'}>`,
    to: 'info@mev-ins.com', // SPECIFIC EMAIL destination
    subject: `New Quote Request from ${data.name} (${data.company})`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #1a365d; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">New Website Inquiry</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Company:</strong> ${data.company}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Equipment Type:</strong> ${data.equipmentType}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f7fafc; padding: 15px; border-radius: 5px; border: 1px solid #edf2f7;">
          ${data.message.replace(/\n/g, '<br>') || 'No message provided.'}
        </div>
        <p style="font-size: 12px; color: #718096; margin-top: 20px;">
          Submitted at: ${data.submittedAt ? data.submittedAt.toDate().toLocaleString() : new Date().toLocaleString()}
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email notification sent for request ${requestId}`);
    
    // Update the document to show email was sent
    await snapshot.ref.update({ emailSent: true });
  } catch (error) {
    console.error(`Error sending email for request ${requestId}:`, error);
    await snapshot.ref.update({ emailError: (error as Error).message });
  }
});
