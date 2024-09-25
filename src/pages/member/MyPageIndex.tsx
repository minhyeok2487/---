import styled, { useTheme } from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import useCharacters from "@core/hooks/queries/character/useCharacters";
import useMyInformation from "@core/hooks/queries/member/useMyInformation";

import Button from "@components/Button";
import Select from "@components/form/Select";

import ApiKeyUpdateForm from "./ApiKeyUpdateFormV2";

const MyPageIndex = () => {
  const getMyInformation = useMyInformation();
  const getCharacters = useCharacters();
  const theme = useTheme();

  return (
    <DefaultLayout>
      <Wrapper>
        <p className="tit">
          <span className="img">
            <img src="" alt="" />
          </span>
          <em>{getMyInformation.data?.mainCharacter.characterName}</em>님
          안녕하세요
        </p>

        <div className="formList">
          <p className="label">로그인 정보</p>
          <div className="formArea">
            <Input
              onChange={() => {}}
              value={getMyInformation.data?.username || ''} // Ensure value is always defined
              readOnly
            />
            <Button variant="contained" size="large" onClick={() => {}}>
              일반 회원으로 전환
            </Button>
          </div>
        </div>

        <div className="formList">
          <p className="label">Apikey</p>
          <div className="formArea left">
            <ApiKeyUpdateForm />
          </div>
        </div>

        <div className="formList">
          <p className="label">대표캐릭터</p>
          <div className="formArea">
            <Select
              fullWidth
              options={
                getCharacters.data?.map((character) => ({
                  label: character.characterName,
                  value: character.characterId, // Assuming each character has a unique id
                })) || []
              } // Fallback to empty array if data is undefined
              onChange={() => {}}
              value={
                getCharacters.data?.find(
                  (character) =>
                    character.characterName ===
                    getMyInformation.data?.mainCharacter.characterName
                )?.characterId || ""
              }
            />
          </div>
        </div>

        {/* <div className="formList">
          <p className="label">캐릭터 노출</p>
          <div className="formArea">
            <Select
              fullWidth
              options={[
                {
                  label: "서버별로 보기",
                  value: 1,
                },
                {
                  label: "전체 보기",
                  value: 2,
                },
              ]}
              onChange={() => {}}
              value={1}
            />
          </div>
        </div> */}

        <span className="line">라인</span>

        <div className="formList">
          <p className="label">계정 초기화</p>
          <div className="formArea left">
            <Button variant="outlined" onClick={() => {}}>
              등록된 캐릭터 전체삭제
            </Button>
          </div>
        </div>

        <div className="formList">
          <div className="formArea left">
            <Button
              variant="outlined"
              color={theme.app.palette.red[650]}
              onClick={() => {}}
            >
              회원탈퇴
            </Button>
          </div>
        </div>
      </Wrapper>
    </DefaultLayout>
  );
};

export default MyPageIndex;

const Wrapper = styled.div`
  width: 100%;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  text-align: center;

  .tit {
    font-size: 20px;

    .img {
      display: block;
      width: 100px;
      height: 100px;
      margin: 0 auto 12px;
      background: gray;
      border-radius: 50%;

      img {
        width: 100%;
        height: auto;
      }
    }

    em {
      font-weight: 700;
    }
  }

  .line {
    display: block;
    width: 100%;
    height: 1px;
    margin-top: 60px;
    font-size: 0;
    text-indent: -999em;
    border-top: 1px dashed ${({ theme }) => theme.app.border};
  }

  .formArea {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;

    button {
      position: absolute;
      right: 10px;
    }
  }

  .formArea.left {
    margin-top: 12px;
    button {
      position: relative;
      right: 0;
    }
  }

  select {
    padding: 0 16px !important;
    font-size: 16px;
    font-weight: 500;
    height: 53px !important;
    border-radius: 10px !important;
  }

  .label {
    margin: 24px 0 6px;
    text-align: left;
    color: ${({ theme }) => theme.app.text.light2};
    font-weight: 300;
  }

  a {
    font-size: 14px;
  }

  @media (max-width: 900px) {
    input {
      width: 100%;
    }
    .formArea {
      display: block;
      text-align: left;
    }

    input + button {
      margin-top: 10px;
    }

    .formArea button {
      position: relative;
      right: 0;
    }
  }
`;
const Input = styled.input`
  padding: 16px;
  width: 80%; // Set a specific width (adjust as needed)
  font-size: 16px;
  line-height: 1;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;
  color: ${({ theme }) => theme.app.text.dark1};
  background: ${({ theme }) => theme.app.bg.white};

  &::placeholder {
    color: ${({ theme }) => theme.app.text.light1};
  }
`;
