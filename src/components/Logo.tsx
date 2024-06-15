import styled from "@emotion/styled";
import { FC } from "react";
import { Link } from "react-router-dom";

interface Props {
  isDarkMode: boolean;
}

const Logo: FC<Props> = ({ isDarkMode }) => {
  return (
    <Link to="/" className="component-logo">
      {isDarkMode ? (
        <Image alt="로아 투두" src="/logo_white.png" />
      ) : (
        <Image alt="로아 투두" src="/logo.png" />
      )}
    </Link>
  );
};

export default Logo;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;
