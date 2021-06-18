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
    window.open(url);
  }

  return (
    <a
      href={url}
      contentEditable={true}
      suppressContentEditableWarning={true}
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
