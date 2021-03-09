export interface HeaderInfo {
  isOpenDrawer?: boolean;
}

export enum HeaderActionTypes {
  openDrawer = 'openDrawer',
}

export const openDrawer = () => {
  return {
    type: HeaderActionTypes.openDrawer,
  };
};
