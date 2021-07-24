export function getUsersInCompany({ users }) {
  const usersMap = { }
  if (!users?.length) {
    return usersMap
  }

  users.forEach((user) => {
    const userID = user?.userID?._id

    if (!userID) {
      return
    }

    usersMap[userID] = user?.userID
  })

  return usersMap
}
