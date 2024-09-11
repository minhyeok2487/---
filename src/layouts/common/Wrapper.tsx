import type { ReactNode } from "react";
import styled from "styled-components";

interface Props {
  children: ReactNode;
}

const Wrapper = ({ children }: Props) => {
  return <StyledWrapper>{children}</StyledWrapper>;
};

export default Wrapper;

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  margin: 60px auto 0;
  padding: 20px 0;
  width: 100%;
  max-width: 1920px;
  height: 100%;

  ${({ theme }) => theme.medias.max1280} {
    padding: 20px 16px;
  }
`;
