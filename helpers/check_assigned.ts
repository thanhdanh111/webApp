export const checkAssigned = (arr, assignedID) => {
  return arr?.filter((each) => each?._id === assignedID)?.length !== 0;
};
