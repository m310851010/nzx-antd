import { HttpParameterCodec } from '@angular/common/http';

export const HttpDefaultCodec: HttpParameterCodec = {
  decodeKey: (key: string): string => {
    return key;
  },

  decodeValue(value: string): string {
    return value;
  },

  encodeKey(key: string): string {
    return key;
  },

  encodeValue(value: string): string {
    return value;
  }
};
