import {
  TableRow,
  TableCell,
  Checkbox,
  IconButton,
  Collapse,
} from '@material-ui/core'
import React from 'react'
import { BodyTable } from './table_cell'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import { HeadCell } from 'helpers/type'

interface RenderActionInput {
  actionList: string[]
  itemIndex: number
  itemStatus: string
  isManager: boolean
}

interface ComponentDetailProps {
  data?: object
  renderAction?: (data: RenderActionInput) => JSX.Element | undefined
  index?: number
}
interface InitialProps {
  headCells: HeadCell[]
  hadExpandableRows?: boolean
  needCheckBox?: boolean
  item: object
  renderAction: (data: RenderActionInput) => JSX.Element | undefined
  index: number
  actions: string[]
  ComponentDetail?: React.FunctionComponent<ComponentDetailProps>
}

const TableRowBase = (props: InitialProps) => {
  const {
    needCheckBox,
    hadExpandableRows,
    headCells,
    item,
    renderAction,
    index,
    actions,
    ComponentDetail,
  }: InitialProps = props
  const [open, setOpen] = React.useState(false)

  const tableCellContent = (content) => {
    if (Array.isArray(content)) {
      return (
        <ul className='cell-list'>
          {
            content.map((element, idx) => <li className={`cell-item cell-item_${idx}`} key={idx} >{element}</li>)
          }
        </ul>
      )
    }

    return content
  }

  return (
    <>
      <TableRow tabIndex={-1} className='row-contain'>
        {
          needCheckBox && <TableCell padding='checkbox' className='cell-contain checkbox-cell'>
            <Checkbox className='check' />
          </TableCell>
        }
        {
          hadExpandableRows &&
          <TableCell padding='checkbox' className='cell-contain checkbox-cell'>
            <IconButton className='btn-expanded' size='small' onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        }
        {
          headCells.map((header) => {
            const nameStyle = (header.id === 'userName') ? 'name-style' : ''
            const align = (header.numeric) ? 'right' : 'left'
            const padding = (header.disablePadding) ? 'none' : 'default'
            const content = header.id !== 'action' ? tableCellContent(item[header.id])
            : renderAction({
              actionList: actions,
              itemIndex: index,
              itemStatus: item['status'],
              isManager: item['isManager'],
            })

            return (
              <BodyTable
                key={header.id}
                style={nameStyle}
                content={content ?? undefined}
                align={align}
                padding={padding}
              />
            )
          })
        }
      </TableRow>
      {hadExpandableRows && (
        <>
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse in={open} timeout='auto' unmountOnExit>
                {ComponentDetail && <ComponentDetail index={index} data={item} renderAction={renderAction}/>}
              </Collapse>
            </TableCell>
          </TableRow>
        </>
      )}
    </>
  )
}

export default TableRowBase
