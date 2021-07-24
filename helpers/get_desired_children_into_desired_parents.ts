function returnDesiredData({  data, fields }) {
  if (!data || !fields?.length) {
    return null
  }

  const newData = {  }

  fields.forEach((field) =>  {
    if (field === 'entityMap') {
      const parsedEntities =  JSON.parse(data[field])
      newData[field] = { ...parsedEntities }

      return
    }

    if (field === 'pageContent') {
      newData['content'] = JSON.parse(data[field])

      return
    }

    newData[field] = data[field]
  })

  return newData
}

interface DesiredMap {
  [id: string]: object
}

export function getDesiredChildrenIntoDesiredParents({
  children,
  fieldsOfChild,
  fieldsOfParent,
  parentFieldInChild,
  parentFieldID,
  childFieldID,
  childName,
}): DesiredMap {
  if (!childName) {
    return {
      desiredMap: { },
    }
  }

  const desiredMap: DesiredMap = {}

  children.forEach((child) => {
    if (!child) {
      return
    }

    const parentData = returnDesiredData({
      data: child[parentFieldInChild],
      fields: fieldsOfParent,
    })

    const childData = returnDesiredData({
      data: child,
      fields: fieldsOfChild,
    })

    if (!parentData || !childData) {
      return
    }

    const parentID = child?.[parentFieldInChild]?.[parentFieldID]
    const childID = child?.[childFieldID]
    const parentDataInMap = desiredMap?.[parentID] ?? {
      ...parentData,
      [childName]: {},
    }

    parentDataInMap[childName][childID] = childData

    desiredMap[parentID] = parentDataInMap
  })

  return desiredMap
}
