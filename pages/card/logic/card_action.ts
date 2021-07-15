import { cardsActionType } from './card_type_action';

export const createCardAction = (res: object) => {
  return {
    type: cardsActionType.CREATE_CARD,
    payload: res,
  };
};

export const getDataListCardAction = (res: object) => {
  return {
    type: cardsActionType.GET_DATA_LIST_CARD,
    payload: res,
  };
};

export const updateCards = (res: object) => {
  return {
    type: cardsActionType.UPDATE_CARDS,
    payload: res,
  };
};

export const setCard = (res) => {
  return {
    type: cardsActionType.SET_CARD,
    payload: {
      cards: res,
    },
  };
};
