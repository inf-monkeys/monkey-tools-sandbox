import Safeify from 'safeify';
import { ISafeifyOptions } from 'safeify/lib/ISafeifyOptions';

export const avaliableModules = ['axios', 'lodash'];

export const safeifyOptions: ISafeifyOptions = {
  timeout: 20000,
  asyncTimeout: 60000,
  unrestricted: true,
  unsafe: {
    require: true,
    modules: avaliableModules,
  },
};

export const safifyVm = new Safeify(safeifyOptions);
