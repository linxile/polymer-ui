import JSEncrypt from 'jsencrypt'

const publicKey = import.meta.env.VITE_APP_RSA_PUBLIC_KEY

// 前端不建议存放私钥 不建议解密数据 因为都是透明的意义不大
const privateKey = import.meta.env.VITE_APP_RSA_PRIVATE_KEY

/**
 * RSA 加密
 * @param txt 待加密的明文
 * @returns 加密后的 Base64 字符串，加密失败返回空字符串
 */
export function encrypt(txt: string): string {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey)
  return encryptor.encrypt(txt) || ''
}

/**
 * RSA 解密
 * @param txt 待解密的密文
 * @returns 解密后的明文，解密失败返回空字符串
 */
export function decrypt(txt: string): string {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey)
  return encryptor.decrypt(txt) || ''
}
