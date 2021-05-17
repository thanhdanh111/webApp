import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import TextFieldsIcon from '@material-ui/icons/TextFields';

export const changeStyleButons = [
  {
    functionality: 'H1',
    icon: <p>H<sub>1</sub></p>,
    overrideClass: 'text-headings',
    styleName: 'H1',
    name: 'Large Heading',
  },
  {
    functionality: 'H2',
    icon: <p>H<sub>2</sub></p>,
    overrideClass: 'text-headings',
    styleName: 'H2',
    name: 'Medium Heading',
  },
  {
    functionality: 'H3',
    icon: <p>H<sub>3</sub></p>,
    overrideClass: 'text-headings',
    styleName: 'H3',
    name: 'Small Heading',
  },
  {
    functionality: 'NORMAL',
    icon: <TextFieldsIcon />,
    styleName: 'NORMAL',
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
];
