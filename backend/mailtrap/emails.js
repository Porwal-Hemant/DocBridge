import { mailtrapClient, sender } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => 
{
	const recipient = [{ email }];

	try 
    {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Verify your email",
			html: VERIFICATION_EMAIL_TEMPLATE(verificationToken),   //  Call the function
			category: "Email Verification",
		});

		console.log("Email sent successfully", response);
	} 
    catch (error) 
    {
		console.error(`Error sending verification`, error);
		throw new Error(`Error sending verification email: ${error}`);
	}

};


export const sendWelcomeEmail = async (email, name) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			template_uuid: "aacf5c39-c4c8-4ab9-9e61-1497f034bdae",
			template_variables: {
				company_info_name: "DocBridge",
				name: name,
			},
		});

		console.log("Welcome email sent successfully", response);
	} catch (error) {
		console.error(`Error sending welcome email`, error);

		throw new Error(`Error sending welcome email: ${error}`);
	}
};


