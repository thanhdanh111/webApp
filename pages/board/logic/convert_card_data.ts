import { Card } from 'helpers/type'

export const convertCardData = (card): Card => {
  return {
    _id: card._id,
    boardID: card.boardID,
    companyID: card.companyID,
    textContent: card.textContent,
    shape: card.shape,
    position: {
      x: card.position.x,
      y: card.position.y,
    },
  }
}
