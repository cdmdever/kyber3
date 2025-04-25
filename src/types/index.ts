export interface KeyPair {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
}

export interface EncryptResult {
  ciphertext: Uint8Array;
  secret: Uint8Array;
}

export interface IMlKem {
  keypair(): KeyPair;
  encrypt(publicKey: Uint8Array): EncryptResult;
  decrypt(ciphertext: Uint8Array, privateKey: Uint8Array): Uint8Array;
  bufferToString(buffer: Uint8Array): string;
} 