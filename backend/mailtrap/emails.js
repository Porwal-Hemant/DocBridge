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

export const sendWelcomeEmail = async (email, name) => 
{
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			template_uuid: "6fdcfbd8-9386-4b83-be64-dfab586283dc",
			template_variables: {
				company_info_name: "DocBridge",
				name: name,
				// name of the user that we will get as the argument  
			},
		});

		console.log("Welcome email sent successfully", response);
	} catch (error) {
		console.error(`Error sending welcome email`, error);

		throw new Error(`Error sending welcome email: ${error}`);
	}
};


