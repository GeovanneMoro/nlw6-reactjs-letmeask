import { ButtonHTMLAttributes } from 'react';

import './styles.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = (props: ButtonProps) => {
  return <button className="button" {...props} />;
};

export { Button };
