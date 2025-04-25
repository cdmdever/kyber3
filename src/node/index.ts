import { IMlKem, KeyPair, EncryptResult } from '../types';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const wasmPath = join(__dirname, '../../install/kyber_crystals_wasm_engine.wasm');
const wasmBuffer = readFileSync(wasmPath);

interface WasmExports {
  MlKem1024: new () => any;
  MlKem768: new () => any;
  MlKem512: new () => any;
}

class MlKemWrapper implements IMlKem {
  private instance: any;

  constructor(instance: any) {
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
  const { instance } = await WebAssembly.instantiate(wasmBuffer, {
    env: {
      sodium_misuse: () => {}
    }
  });
  return new MlKemWrapper(new ((instance.exports as unknown) as WasmExports).MlKem1024());
}

export async function loadMlKem768(): Promise<IMlKem> {
  const { instance } = await WebAssembly.instantiate(wasmBuffer, {
    env: {
      sodium_misuse: () => {}
    }
  });
  return new MlKemWrapper(new ((instance.exports as unknown) as WasmExports).MlKem768());
}

export async function loadMlKem512(): Promise<IMlKem> {
  const { instance } = await WebAssembly.instantiate(wasmBuffer, {
    env: {
      sodium_misuse: () => {}
    }
  });
  return new MlKemWrapper(new ((instance.exports as unknown) as WasmExports).MlKem512());
} 