interface TabPanelProps {
  children?: React.ReactNode
  index: number | string
  value: number | string
}

type TabPanelType = TabPanelProps

const TabPanel = (props: TabPanelType) => {
  const { value, index, children }: TabPanelType = props

  return (
    <div
      key={`tab-panel-${index}`}
      className='tab-pannel'
      hidden={value !== index}
    >
      {value === index && children}
    </div>
  )
}

export default TabPanel
