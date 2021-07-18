import { Card } from 'helpers/type'

export const convertCardData = (card: Card[]) => {

  const obj = { }
  card.forEach((each) => {
    const objCard = {
      _id: each?._id,
      boardID: each?.boardID,
      companyID: each?.companyID,
      textContent: each?.textContent,
      shape: each?.shape,
      position: {
        x: each?.position?.x,
        y: each?.position?.y,
      },
      leftTo: {
        cardID: each?.leftTo?.cardID,
        text: each?.leftTo?.text,
        arrow: each?.leftTo?.arrow,
      },
      rightTo: {
        cardID: each?.rightTo?.cardID,
        text: each?.rightTo?.text,
        arrow: each?.rightTo?.arrow,
      },
      bottomTo: {
        cardID: each?.bottomTo?.cardID,
        text: each?.bottomTo?.text,
        arrow: each?.bottomTo?.arrow,
      },
      topTo: {
        cardID: each?.topTo?.cardID,
        text: each?.topTo?.text,
        arrow: each?.topTo?.arrow,
      },

    }

    obj[objCard._id] = objCard

  })

  return obj
}
