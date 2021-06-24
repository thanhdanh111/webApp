function returnDesiredData({  data, fields }) {
  if (!data || !fields?.length) {
    return null;
  }

  const newData = {  };

  fields.forEach((field) =>  {
    newData[field] = data[field];
  });

  return newData;
}

interface GetDesiredChildrenIntoDesiredParents {
  desiredParents: object[];
  desiredParentsIndice: object;
}

export function getDesiredChildrenIntoDesiredParents({
  children,
  fieldsOfChild,
  fieldsOfParent,
  parentFieldInChild,
  parentFieldID,
  childName,
}): GetDesiredChildrenIntoDesiredParents {
  if (!children?.length || !childName) {
    return {
      desiredParentsIndice: {},
      desiredParents: [],
    };
  }

  const storeParentIndice = {};
  const parentArray: object[] = [];
  let indexForNewParent = 0;

  children.forEach((child) => {
    const parentData = returnDesiredData({
      data: child[parentFieldInChild],
      fields: fieldsOfParent,
    });

    const childData = returnDesiredData({
      data: child,
      fields: fieldsOfChild,
    });

    if (!parentData || !childData) {
      return;
    }

    const parentID = child?.[parentFieldInChild]?.[parentFieldID];
    let indexOfTempParent = storeParentIndice?.[parentID];

    if (typeof indexOfTempParent !== 'number') {
      storeParentIndice[parentID] = indexForNewParent;
      indexOfTempParent = indexForNewParent;

      parentData[childName] = [];

      parentArray[indexForNewParent] = parentData;

      indexForNewParent = indexForNewParent + 1;
    }

    parentArray?.[indexOfTempParent]?.[childName]?.push(childData);
  });

  return {
    desiredParentsIndice: storeParentIndice,
    desiredParents: parentArray,
  };
}
