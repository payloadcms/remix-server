import LogoSrc from '../assets/payload-logo.svg';

type Props = Omit<JSX.IntrinsicElements['img'], 'src' | 'alt'>;

export const Logo = (props: Props) => (
    <img src={LogoSrc} alt="Payload Logo" {...props} />
);
