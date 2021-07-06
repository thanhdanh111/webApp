import { FC } from 'react';

interface InitialProps {
  onClickAdd: () => void;
}
const SvgOptionProcess: FC<InitialProps> = (props: InitialProps) => {

  const { onClickAdd }: InitialProps = props;

  return (
    <>
      <div className='div-svg-process'>
        <svg onClick={onClickAdd} width='34' height='27' className='svg-process'>
          <rect rx='0' ry='100' height='25' width='30' fill='none'/>
        </svg>
      </div>
    </>
  );
};

export default SvgOptionProcess;
