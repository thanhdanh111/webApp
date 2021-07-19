import { TableCell } from '@material-ui/core'

interface PropsInitial {
  style?: string
  content?: JSX.Element
  padding?: 'none' | 'default' | 'checkbox'
  align?: 'left' | 'center' | 'right' | 'justify' | 'inherit'
}

export const BodyTable = (props: PropsInitial) => {

  const { style, content, padding, align }: PropsInitial = props

  return (
        <TableCell
            component='th'
            scope='row'
            padding={padding}
            className={`${style} cell-contain`}
            align={align}
        >
            {content}
        </TableCell>
  )
}
