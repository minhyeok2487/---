import type { ReactNode } from "react";
import styled from "styled-components";

interface Props {
  children: ReactNode;
}

const ContentWrapper = ({ children }: Props) => {
  return <StyledWrapper>{children}</StyledWrapper>;
};

export default ContentWrapper;

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1280px;
  height: 100%;
`;
