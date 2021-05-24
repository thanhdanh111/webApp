import { storiesOf } from '@storybook/react';
import ProjectDetail from './detail';

storiesOf('Detail Projects', module).add('Header', () => {
  return <>
    <ProjectDetail />
  </>;
});
