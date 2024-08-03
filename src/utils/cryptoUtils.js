import CryptoJS from "crypto-js";

// 加密数据
export const encryptData = (data, secret) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString();
};
// 解密数据
export const decryptData = (encryptedData, secret) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secret);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
