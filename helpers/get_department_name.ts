import { Department } from './type';
import { checkArray } from './check_array';

export const getDepartmentsName = (departments) => {

  if (!checkArray(departments)) {
    return;
  }

  const newArray: string[] = [] ;

  departments.map((item: Department) => {
    newArray.push(item.name);
  });

  return newArray;
};
