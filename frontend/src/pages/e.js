import EncryptRsa from "encrypt-rsa";
const encryptRsa = new EncryptRsa();
export const { privateKey, publicKey } = encryptRsa.createPrivateAndPublicKeys() 
