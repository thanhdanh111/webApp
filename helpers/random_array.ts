export const randomArray = (array) => {
  if (!array.length){
    return
  }

  return array[Math.floor(Math.random() * array.length)]
}
