import React, { FunctionComponent } from 'react';
import {
  Typography, Card,
  CardContent, Link, Breadcrumbs,
} from '@material-ui/core';

interface DataType {
  references: string[];
  heading: string;
}

type BodyProps = DataType;

const PageCardUi: FunctionComponent<BodyProps> = ({ references, heading }) => {

  const subtitlesComponents: JSX.Element[]  = references.map((value, index) => {
    if  (index === (references.length - 1)){
      return (
        <Typography
          variant='body1'
          className='reference-text reference-text--last'
          key={`reference-text-${index}`}
        >
          {value}
        </Typography>);
    }

    return (<Typography variant='body1' key={`reference-text-${index}`} className='reference-text'>
        <Link style={{ color: 'inherit' }} className='reference-text'>
        {value}
        </Link>
      </Typography>);
  });

  return (
    <Card elevation={0} className='page-card' style={{ backgroundColor: 'transparent' }} >
      <CardContent className='page-card-content'>
        <Typography className='page-card-heading' variant='h6'>
          {heading}
        </Typography>
        <Breadcrumbs aria-label='breadcrumb' separator={<span className='subtitle-span' >•</span>}>
          {subtitlesComponents}
        </Breadcrumbs>
      </CardContent>
    </Card>
  );
};

export default PageCardUi;
