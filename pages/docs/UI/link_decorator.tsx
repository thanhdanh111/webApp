import { urlWithHttpRegex } from 'constants/docs_regex';

function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character?.getEntity();

      return (
        entityKey !== null &&
        contentState?.getEntity(entityKey)?.getType() === 'LINK'
      );
    },
    callback,
  );
}

const Link = (props) => {
  const url = props?.contentState?.getEntity(props?.entityKey)?.getData()?.url;

  function openNewTab() {
    const urlWithHttpRegexFunc = new RegExp(urlWithHttpRegex);
    const isUrlWithHttp = urlWithHttpRegexFunc.test(url);

    if (!isUrlWithHttp) {
      window.open(`//${url}`);

      return;
    }

    window.open(url);
  }

  return (
    <a
      href={url}
      contentEditable={false}
      onClick={() => openNewTab()}
      rel='noopener noreferrer'
      className='docs-link-href'
      target='blank'
    >
      {props.children}
    </a>
  );
};

export const docsLinkDecorator = {
  strategy: findLinkEntities,
  component: Link,
};
