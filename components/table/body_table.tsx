import { TableCell } from '@material-ui/core';

interface PropsInitial {
  style?: string;
  key: string;
  content?: JSX.Element;
  padding?: 'none' | 'default' | 'checkbox';
  align?: 'left' | 'center' | 'right' | 'justify' | 'inherit';
}

export const BodyTable = (props: PropsInitial) => {

  const { style, key, content, padding, align }: PropsInitial = props;

  return (
        <TableCell
            component='th'
            scope='row'
            padding={padding}
            className={`${style} cell-contain`}
            align={align}
            key={key}
        >
            {content}
        </TableCell>
  );
};
