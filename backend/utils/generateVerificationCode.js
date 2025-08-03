//  OTP generation with the help of this  

export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
