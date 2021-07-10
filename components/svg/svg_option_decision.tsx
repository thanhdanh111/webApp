import { FC } from 'react';

interface InitialProps {
  onClickAdd: () => void;
}

const SvgOptionDecision: FC<InitialProps> = (props: InitialProps) => {

  const { onClickAdd }: InitialProps = props;

  return (
    <>
      <div className='div-svg-decision'>
        <svg width='34' height='33' viewBox='-0.5, -0.5, 31, 31' onClick={onClickAdd} >
          <path
            d='M15 0 L0 15 L15 30 L30 15z'
            stroke='#ffffff'
            fill='none'
            strokeWidth='2px'
          />
        </svg>
      </div>
    </>
  );
};

export default SvgOptionDecision;
