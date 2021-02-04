import { storiesOf } from '@storybook/react';
import Header from './header';
import { appWithTranslation } from '../../i18n';

const ComponentWithTranslation = appWithTranslation(Header);

storiesOf('Header', module).add('Header', () => {
  return <ComponentWithTranslation />;
});
