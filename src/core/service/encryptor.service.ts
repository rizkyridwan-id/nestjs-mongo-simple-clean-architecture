import { AES, enc } from 'crypto-js';

export class Encryptor {
  private static coreKey: string = 'ngtc::H(1y88@3hde';
  private static encKey: string =
    'U2FsdGVkX19/DVxzw6uzkZZvp1nnAeE1/G5XDt+QmDk=';

  private static encKeyDec: string = AES.decrypt(
    this.encKey,
    this.coreKey,
  ).toString(enc.Utf8);

  private static encryptascii(str: any) {
    // const key = coreKey.decryptEncKey(this.encKey);
    const key = this.encKeyDec;
    const dataKey: any = {};
    for (let i = 0; i < key.length; i++) {
      dataKey[i] = key.substr(i, 1);
    }

    let strEnc = '';
    let nkey = 0;
    const jml = str.length;

    for (let i = 0; i < parseInt(jml); i++) {
      strEnc =
        strEnc +
        this.hexEncode(str[i].charCodeAt(0) + dataKey[nkey].charCodeAt(0));

      if (nkey === Object.keys(dataKey).length - 1) {
        nkey = 0;
      }
      nkey = nkey + 1;
    }
    return strEnc.toUpperCase();
  }

  private static decryptascii(str: any) {
    if (str) {
      // const key = coreKey.decryptEncKey(this.encKey);
      const key = this.encKeyDec;
      const dataKey: any = {};
      for (let i = 0; i < key.length; i++) {
        dataKey[i] = key.substr(i, 1);
      }

      let strDec = '';
      let nkey = 0;
      const jml = str.length;
      let i = 0;
      while (i < parseInt(jml)) {
        strDec =
          strDec +
          this.chr(this.hexdec(str.substr(i, 2)) - dataKey[nkey].charCodeAt(0));
        if (nkey === Object.keys(dataKey).length - 1) {
          nkey = 0;
        }
        nkey = nkey + 1;
        i = i + 2;
      }
      return strDec;
    }
  }

  private static hexEncode(str: any) {
    let result = '';
    result = str.toString(16);
    return result;
  }

  private static hexdec(hex: any) {
    let str: any = '';
    str = parseInt(hex, 16);
    return str;
  }

  private static chr(asci: any) {
    let str = '';
    str = String.fromCharCode(asci);
    return str;
  }

  static doEncrypt(dataBeforeCopy: any, ignore?: string[]) {
    if (!ignore) {
      return dataBeforeCopy;
    }
    if (!Number(process.env.ENCRYPTION_MODE)) {
      return dataBeforeCopy;
    }
    if (!dataBeforeCopy) {
      return dataBeforeCopy;
    }
    if (
      typeof dataBeforeCopy === 'object' &&
      !(dataBeforeCopy instanceof Date)
    ) {
      const data = Array.isArray(dataBeforeCopy)
        ? [...dataBeforeCopy]
        : { ...dataBeforeCopy };
      Object.keys(data).map((x: any) => {
        const result = ignore.find((find: any) => find === x);
        if (!result) {
          if (Array.isArray(data[x])) {
            data[x] = data[x].map((y: any) => {
              if (typeof y === 'string') {
                return this.encryptascii(y);
              } else if (
                typeof data[x] === 'object' &&
                data[x] &&
                !(data[x] instanceof Date)
              ) {
                return this.doEncrypt(y, ignore);
              }
              return false;
            });
          } else {
            if (typeof data[x] === 'string' && data[x]) {
              data[x] = this.encryptascii(data[x]);
            } else if (typeof data[x] === 'number' && data[x]) {
              // Call Masking Number
            } else if (
              typeof data[x] === 'object' &&
              data[x] &&
              !(dataBeforeCopy instanceof Date)
            ) {
              data[x] = this.doEncrypt(data[x], ignore);
            }
          }
        }
        return false;
      });
      return data;
    } else if (typeof dataBeforeCopy === 'string') {
      const data = this.encryptascii(dataBeforeCopy);
      return data;
    }
  }

  static doDecrypt(dataBeforeCopy: any, ignore?: string[]) {
    if (!ignore) {
      return dataBeforeCopy;
    }

    if (!Number(process.env.ENCRYPTION_MODE)) {
      return dataBeforeCopy;
    }

    if (!dataBeforeCopy) {
      return dataBeforeCopy;
    }

    if (
      typeof dataBeforeCopy === 'object' &&
      !(dataBeforeCopy instanceof Date)
    ) {
      const data = Array.isArray(dataBeforeCopy)
        ? [...dataBeforeCopy]
        : { ...dataBeforeCopy };
      Object.keys(data).map((x: any) => {
        const result = ignore.find((find: any) => find === x);
        if (!result) {
          if (Array.isArray(data[x])) {
            data[x] = data[x].map((y: any) => {
              if (typeof y === 'string') {
                return this.decryptascii(y);
              } else if (
                typeof data[x] === 'object' &&
                data[x] &&
                !(data[x] instanceof Date)
              ) {
                return this.doDecrypt(y, ignore);
              }
              return false;
            });
          } else {
            // Real Encrypt
            if (typeof data[x] === 'string' && data[x]) {
              data[x] = this.decryptascii(data[x]);
            } else if (typeof data[x] === 'number' && data[x]) {
              // Call Unmasking Number()
            } else if (
              typeof data[x] === 'object' &&
              data[x] &&
              !(dataBeforeCopy instanceof Date)
            ) {
              data[x] = this.doDecrypt(data[x], ignore);
            }
          }
        }
        return false;
      });
      return data;
    } else if (typeof dataBeforeCopy === 'string') {
      const data = this.decryptascii(dataBeforeCopy);
      return data;
    }
  }
}
