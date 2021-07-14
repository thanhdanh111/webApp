import { checkArray } from './check_array';

// interface CheckIncludeInterface<Type> {
  // arr: Type[];
  // key: string;
  // obj: Type;
// }

export const checkInclude = ({ arr, obj, key })  => {
  if (!checkArray(arr)){
    return false;
  }

  return arr.some((e) => e[key] === obj[key]);

};
