import dotenv from 'dotenv';
import { MailtrapClient } from "mailtrap";
import path from 'path';
import fs from 'fs';

// Load environment variables - check backend folder first
const backendEnvPath = path.resolve(process.cwd(), 'backend', '.env');
if (fs.existsSync(backendEnvPath)) {
  console.log(" Loading .env from backend folder");
  dotenv.config({ path: backendEnvPath });
} else {
  dotenv.config();
}

const TOKEN = process.env.MAILTRAP_TOKEN;     
console.log("Mailtrap Token:", TOKEN ? `${TOKEN.substring(0, 8)}...` : 'UNDEFINED');

if (!TOKEN) {
  console.error(" Mailtrap token is not defined in the environment variables.");
  process.exit(1);
}

console.log("Mailtrap token loaded successfully");

// Initialize client - since you have Domain Admin token, use it for sending
export const mailtrapClient = new MailtrapClient({ token: TOKEN });

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Hemant Porwal",
};





 // we have to make dynamic recipients   ( so commenting it out for now )
// const recipients = [
//   {
//     email: "porwalhemant080@gmail.com",
//   }
// ];

// mailtrapClient
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "DocBridge Email Authentication!",
//     text: "Congrats for signing in on DocBridge.",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);




