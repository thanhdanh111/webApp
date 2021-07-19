import { savePage } from './docs_apis'

export function handleKeyCombination(event, onEditPage, dispatch) {
  if (onEditPage && event?.ctrlKey && event.keyCode === 83) {
    event.preventDefault()
    dispatch(savePage())

    return
  }

  return
}
