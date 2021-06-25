function findImageEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character?.getEntity();

      return (
        entityKey !== null &&
        contentState?.getEntity(entityKey)?.getType() === 'IMAGE'
      );
    },
    callback,
  );
}

const Image = (props) => {
  const url = props?.contentState?.getEntity(props?.entityKey)?.getData()?.url;
  const defaultHeight = 480;
  const defaultWidth = 600;

  return <img
    src={url ?? ''}
    style={{
      width: `${defaultWidth}px`,
      height: `${defaultHeight}`,
    }}
  />;
};

export const docsImageDecorator = {
  strategy: findImageEntities,
  component: Image,
};
