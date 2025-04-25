import { IMlKem, KeyPair, EncryptResult } from '../types';

declare class MlKem1024 {
  keypair(): { public_key: number[]; private_key: number[] };
  encrypt(publicKey: number[]): { cyphertext: number[]; secret: number[] };
  decrypt(cyphertext: number[], privateKey: number[]): number[];
  buffer_to_string(buffer: number[]): string;
}

declare class MlKem768 {
  keypair(): { public_key: number[]; private_key: number[] };
  encrypt(publicKey: number[]): { cyphertext: number[]; secret: number[] };
  decrypt(cyphertext: number[], privateKey: number[]): number[];
  buffer_to_string(buffer: number[]): string;
}

declare class MlKem512 {
  keypair(): { public_key: number[]; private_key: number[] };
  encrypt(publicKey: number[]): { cyphertext: number[]; secret: number[] };
  decrypt(cyphertext: number[], privateKey: number[]): number[];
  buffer_to_string(buffer: number[]): string;
}

declare function init(): Promise<{
  MlKem1024: typeof MlKem1024;
  MlKem768: typeof MlKem768;
  MlKem512: typeof MlKem512;
}>;

class MlKemWrapper implements IMlKem {
  private instance: MlKem1024 | MlKem768 | MlKem512;

  constructor(instance: MlKem1024 | MlKem768 | MlKem512) {
    this.instance = instance;
  }

  keypair(): KeyPair {
    const result = this.instance.keypair();
    return {
      publicKey: new Uint8Array(result.public_key),
      privateKey: new Uint8Array(result.private_key)
    };
  }

  encrypt(publicKey: Uint8Array): EncryptResult {
    const result = this.instance.encrypt(Array.from(publicKey));
    return {
      ciphertext: new Uint8Array(result.cyphertext),
      secret: new Uint8Array(result.secret)
    };
  }

  decrypt(ciphertext: Uint8Array, privateKey: Uint8Array): Uint8Array {
    return new Uint8Array(this.instance.decrypt(
      Array.from(ciphertext),
      Array.from(privateKey)
    ));
  }

  bufferToString(buffer: Uint8Array): string {
    return this.instance.buffer_to_string(Array.from(buffer));
  }
}

export async function loadMlKem1024(): Promise<IMlKem> {
  const { MlKem1024 } = await init();
  return new MlKemWrapper(new MlKem1024());
}

export async function loadMlKem768(): Promise<IMlKem> {
  const { MlKem768 } = await init();
  return new MlKemWrapper(new MlKem768());
}

export async function loadMlKem512(): Promise<IMlKem> {
  const { MlKem512 } = await init();
  return new MlKemWrapper(new MlKem512());
} 