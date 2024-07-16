import { Dialog } from "@mui/material";
import type { ReactNode } from "react";
import styled from "styled-components";

import Button from "@components/Button";

interface ButtonItem {
  label: string;
  onClick(): void;
}

interface Props {
  title?: ReactNode;
  buttons?: ButtonItem[];
  children: ReactNode;
  isOpen?: boolean;
  onClose: () => void;
}

const Modal = ({
  title,
  buttons = [],
  children,
  isOpen = false,
  onClose,
}: Props) => {
  return (
    <Wrapper
      transitionDuration={{
        exit: 0,
        enter: 200,
      }}
      open={isOpen}
      onClose={() => {
        onClose();
      }}
    >
      <InnerWrapper>
        {title && <Title>{title}</Title>}

        <Description>{children}</Description>

        {buttons.length > 0 && (
          <Buttons>
            {buttons.map((item) => (
              <Button key={item.label} onClick={item.onClick}>
                {item.label}
              </Button>
            ))}
          </Buttons>
        )}
      </InnerWrapper>
    </Wrapper>
  );
};

export default Modal;

const Wrapper = styled(Dialog)`
  min-width: 320px;

  .MuiPaper-root {
    padding: 18px 10px 24px 20px;
    min-width: 320px;
    max-width: 100%;
    max-height: 60vh;
    height: 100%;
    border-radius: 16px;
    border: 1px solid ${({ theme }) => theme.app.border};
    box-shadow: none;
    color: ${({ theme }) => theme.app.text.main};
    background: ${({ theme }) => theme.app.bg.light};
    overflow: hidden;

    ${({ theme }) => theme.medias.max500} {
      width: 95%;
    }
  }
`;

const InnerWrapper = styled.div`
  padding-right: 10px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

const Title = styled.span`
  display: block;
  margin-bottom: 16px;
  width: 100%;
  color: ${({ theme }) => theme.app.text.dark2};
  font-size: 22px;
  font-weight: 700;
  text-align: center;
`;

const Description = styled.div`
  width: 100%;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 2;

  .button-wrap {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
`;

const Buttons = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;
