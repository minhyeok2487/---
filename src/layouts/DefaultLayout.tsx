import { useState } from "react";
import type { FC } from "react";
import styled from "styled-components";

import GoogleAdvertise from "@components/GoogleAdvertise";
import SignUpCharactersNotify from "@components/SignUpCharactersNotify";

import ContentWrapper from "./common/ContentWrapper";
import Header from "./common/Header";
import Wrapper from "./common/Wrapper";

interface Props {
  pageTitle?: string;
  children: React.ReactNode;
}

const DefaultLayout: FC<Props> = ({ pageTitle, children }) => {
  const [randomNumber] = useState(Math.random() < 0.5 ? 0 : 1);

  return (
    <>
      <Header />

      <Wrapper>
        <ContentWrapper>
          {/* <EmergencyNotice /> */}

          {pageTitle && <Title>{pageTitle}</Title>}

          <SignUpCharactersNotify />

          {children}

          {randomNumber === 1 && (
            <CoupangWrappeer>
              <iframe
                title="coupang"
                src="https://ads-partners.coupang.com/widgets.html?id=783667&template=carousel&trackingCode=AF8712424&subId=&width=680&height=140&tsource="
                width="100%"
                scrolling="no"
                style={{ margin: "0 auto" }}
              />
            </CoupangWrappeer>
          )}
        </ContentWrapper>

        {randomNumber === 0 && (
          <GoogleAdvertise
            client="ca-pub-9665234618246720"
            slot="2191443590"
            format="auto"
            responsive="true"
          />
        )}
      </Wrapper>
    </>
  );
};

export default DefaultLayout;

const Title = styled.h2`
  margin-bottom: 16px;
  width: 100%;
  font-size: 22px;
  font-weight: 700;
  text-align: left;
  color: ${({ theme }) => theme.app.text.main};
`;

const CoupangWrappeer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 40px;
`;
