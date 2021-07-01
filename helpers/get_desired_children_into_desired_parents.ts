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

interface DesiredMap {
  [id: string]: object;
}

export function getDesiredChildrenIntoDesiredParents({
  children,
  fieldsOfChild,
  fieldsOfParent,
  parentFieldInChild,
  parentFieldID,
  childName,
}): DesiredMap {
  if (!childName) {
    return {
      desiredMap: { },
    };
  }

  const desiredMap: DesiredMap = {};

  children.forEach((child) => {
    if (!child) {
      return;
    }

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
    const parentDataInMap = desiredMap?.[parentID] ?? {
      ...parentData,
      [childName]: [],
    };

    parentDataInMap[childName].push(childData);

    desiredMap[parentID] = parentDataInMap;
  });

  return desiredMap;
}
