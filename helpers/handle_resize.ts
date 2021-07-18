import { Direction } from '../pages/board/UI/resizer/constants'

export const handleResize = (
  panelRef,
  heightRef,
  widthRef,
  direction,
  movementX,
  movementY) => {

  const panel = panelRef.current
  if (!panel) return

  const clientRect = panel.getBoundingClientRect()

  const resizeTop = () => {
    if (!movementY) {
      return
    }
    heightRef.current = heightRef.current - movementY
    widthRef.current = widthRef.current - movementX
    panel.style.height = `${heightRef.current}px`
    panel.style.width = `${widthRef.current}px`
    panel.style.top = `${clientRect.y - movementY}px`
  }

  const resizeRight = () => {
    widthRef.current = widthRef.current + movementX
    panel.style.width = `${widthRef.current}px`
    // panel.style.right = `${clientRect.x + movementY}px`
  }

  const resizeBottom = () => {
    heightRef.current = heightRef.current + movementY
    panel.style.height = `${heightRef.current}px`
    panel.style.bottom = `${clientRect.y + movementY}px`
  }

  const resizeLeft = () => {
    widthRef.current = widthRef.current - movementX
    heightRef.current = heightRef.current - movementY
    panel.style.width = `${widthRef.current}px`
    panel.style.height = `${heightRef.current}px`
    panel.style.bottom = `${clientRect.y - movementY}px`
  }
  switch (direction) {
    case Direction.TopLeft:
      resizeTop()
      resizeLeft()
      break

    case Direction.TopRight:
      resizeTop()
      resizeRight()
      break

    case Direction.BottomRight:
      resizeBottom()
      resizeRight()
      break

    case Direction.BottomLeft:
      resizeBottom()
      resizeLeft()
      break

    default:
      break
  }
}
