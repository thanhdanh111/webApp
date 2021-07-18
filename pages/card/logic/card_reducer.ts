import axios from 'axios'
import { config } from 'helpers/get_config'
import { CardsPage, BoardsPage } from 'helpers/type'
import { cardsActionType } from './card_type_action'
import { pushNewNotifications } from 'redux/common/notifications/reducer'
import { convertCardData } from './convert_card_data'
import { createCardAction, getCardsAction } from './card_action'
import { checkIfEmptyArray } from 'helpers/check_if_empty_array'

export enum NotificationTypes {
  failedAddCard = 'Failed to add card',
  failedGetCard = 'Failed to get cards!',
  companyTokenNotification = 'You have not registered any companies for workspace',
}
export enum Arrow {
  OUT_LINE = 'OUT_LINE',
}
const initialState: CardsPage =  {
  cards: {},
}

export const cardsReducer = (state = initialState, action) => {
  switch (action.type) {
    case cardsActionType.CREATE_CARD:
      const newCards = {
        ...state.cards,
        [action?.payload?._id]: action.payload,
      }

      return {
        ...state,
        cards: newCards,
      }

    case cardsActionType.GET_CARDS:
      return {
        ...state,
        cards: action.payload,
      }

    case cardsActionType.SET_CARD:
      return {
        ...state,
        cards: {},
      }
    default:
      return state
  }
}

export const createCard = (shape: string, textContent: string, position: string) => async (dispatch, getState) => {

  try {
    const token = localStorage.getItem('access_token')
    const { selectedBoard }: BoardsPage = getState()?.boards
    const boardID = selectedBoard?._id

    const userInfo = getState()?.userInfo
    const companyID = userInfo?.currentCompany?._id

    if (!companyID || !boardID) {

      dispatch(pushNewNotifications({ variant: 'error' , message: NotificationTypes.companyTokenNotification }))

      return
    }

    const res = await axios.post(`${config.BASE_URL}/boards/${boardID}/cards`,
      {
        companyID,
        shape,
        position,
        boardID,
        textContent,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )

    dispatch(createCardAction(res.data))

  } catch (error) {
    dispatch(pushNewNotifications({ variant: 'error', message: NotificationTypes.failedAddCard }))
  }
}

export const getCards = (boardID) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token')

    const res = await axios.get(`${config.BASE_URL}/cards`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      params: {
        boardID,
      },
    })

    if (checkIfEmptyArray(res.data.list)) {
      const cards = convertCardData(res.data.list)
      await dispatch(getCardsAction(cards))
    }

    return
  } catch (error) {
    dispatch(pushNewNotifications({ variant: 'error', message: NotificationTypes.failedGetCard }))
  }

}
