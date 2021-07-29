import { ButtonHTMLAttributes } from "react";

import "./styles.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isOutlined?: boolean;
}

const Button = ({ isOutlined = false, ...props }: ButtonProps) => {
  return (
    <button className={`button ${isOutlined ? "outlined" : ""}`} {...props} />
  );
};

export { Button };
