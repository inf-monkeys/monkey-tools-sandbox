import Safeify from 'safeify';
import { ISafeifyOptions } from 'safeify/lib/ISafeifyOptions';

export const avaliableModules = ['axios', 'lodash'];

export const safeifyOptions: ISafeifyOptions = {
  timeout: 30 * 60 * 1000,
  asyncTimeout: 30 * 60 * 1000,
  unrestricted: true,
  unsafe: {
    require: true,
    modules: avaliableModules,
  },
};

export const safifyVm = new Safeify(safeifyOptions);
