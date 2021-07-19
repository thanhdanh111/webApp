import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted'
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered'
import TextFieldsIcon from '@material-ui/icons/TextFields'
import StrikethroughSIcon from '@material-ui/icons/StrikethroughS'

export const blockStyles = [
  'unstyled',
  'header-one',
  'header-two',
  'header-three',
  'code-block',
  'ordered-list-item',
  'unordered-list-item',
]

export const inlineStyles = [
  'BOLD',
  'ITALIC',
  'UNDERLINE',
  'STRIKETHROUGH',
]

export const inlineToolbarButons = [
  {
    functionality: 'BOLD',
    icon: 'B',
    styleName: 'BOLD',
  },
  {
    functionality: 'STRIKETHROUGH',
    icon: <StrikethroughSIcon />,
    styleName: 'STRIKETHROUGH',
  },
  {
    functionality: 'ITALIC',
    icon: 'I',
    styleName: 'ITALIC',
  },
  {
    functionality: 'UNDERLINE',
    icon: 'U',
    styleName: 'UNDERLINE',
  },
  {
    functionality: 'header-one',
    icon: <p>H<sub>1</sub></p>,
    overrideClass: 'text-headings',
    styleName: 'header-one',
    name: 'Large Heading',
  },
  {
    functionality: 'header-two',
    icon: <p>H<sub>2</sub></p>,
    overrideClass: 'text-headings',
    styleName: 'header-two',
    name: 'Medium Heading',
  },
  {
    functionality: 'header-three',
    icon: <p>H<sub>3</sub></p>,
    overrideClass: 'text-headings',
    styleName: 'header-three',
    name: 'Small Heading',
  },
  {
    functionality: 'unstyled',
    icon: <TextFieldsIcon />,
    styleName: 'Text',
    name: 'Text',
  },
  {
    functionality: 'code-block',
    icon: '< >',
    styleName: 'code-block',
    name: 'Code Block',
  },
  {
    functionality: 'unordered-list-item',
    icon: <FormatListBulletedIcon />,
    styleName: 'unordered-list-item',
    name: 'Bulleted List',
  },
  {
    functionality: 'ordered-list-item',
    icon: <FormatListNumberedIcon />,
    styleName: 'ordered-list-item',
    name: 'Numbered List',
  },
]

export const changeLineStyleButons = [
  {
    functionality: 'header-one',
    icon: <p>H<sub>1</sub></p>,
    overrideClass: 'text-headings',
    styleName: 'header-one',
    name: 'Large Heading',
  },
  {
    functionality: 'header-two',
    icon: <p>H<sub>2</sub></p>,
    overrideClass: 'text-headings',
    styleName: 'header-two',
    name: 'Medium Heading',
  },
  {
    functionality: 'header-three',
    icon: <p>H<sub>3</sub></p>,
    overrideClass: 'text-headings',
    styleName: 'header-three',
    name: 'Small Heading',
  },
  {
    functionality: 'unstyled',
    icon: <TextFieldsIcon />,
    styleName: 'Text',
    name: 'Text',
  },
  {
    functionality: 'code-block',
    icon: '< >',
    styleName: 'code-block',
    name: 'Code Block',
  },
  {
    functionality: 'unordered-list-item',
    icon: <FormatListBulletedIcon />,
    styleName: 'unordered-list-item',
    name: 'Bulleted List',
  },
  {
    functionality: 'ordered-list-item',
    icon: <FormatListNumberedIcon />,
    styleName: 'ordered-list-item',
    name: 'Numbered List',
  },
]
