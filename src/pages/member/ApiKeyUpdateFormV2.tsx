import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

import UtilLink from "@pages/auth/components/UtilLink";

import useUpdateApiKey from "@core/hooks/mutations/member/useUpdateApiKey";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";
import InputBox from "@components/InputBox";

const ApiKeyUpdateForm = () => {
  const queryClient = useQueryClient();

  const characterInputRef = useRef<HTMLInputElement>(null);

  const [apiKey, setApiKey] = useState("");
  const [apiKeyMessage, setApiKeyMessage] = useState("");

  const updateApiKey = useUpdateApiKey({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getMyInformation(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCharacters(),
      });

      toast.success("API KEY 변경이 완료되었습니다.");
      setApiKey("");
    },
  });

  // 메시지 리셋
  const messageReset = () => {
    setApiKeyMessage("");
  };

  // 유효성 검사
  const validation = (): boolean => {
    let isValid = true;

    if (!apiKey) {
      isValid = false;

      if (!apiKey) {
        setApiKeyMessage("ApiKey를 입력해주세요.");
      }
    }

    return isValid;
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    messageReset();

    if (validation()) {
      updateApiKey.mutate({
        apiKey,
      });
    }
  };

  return (
    <Container>
      <Wrap>
        <InputBox
          type="text"
          placeholder="로스트아크 ApiKey"
          value={apiKey}
          setValue={setApiKey}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              characterInputRef.current?.focus();
            }
          }}
          message={apiKeyMessage}
        />
        <div style={{ marginLeft: 10 }}>
          <Button variant="contained" size="large" onClick={handleSubmit}>
            API KEY 업데이트
          </Button>
        </div>
      </Wrap>
      <Wrap>
        <UtilRow>
          <UtilLink to="https://repeater2487.tistory.com/190" target="_blank">
            API KEY 발급하는 방법이 궁금해요!
          </UtilLink>
          <UtilLink
            to="https://developer-lostark.game.onstove.com"
            target="_blank"
          >
            API KEY 발급 받기
          </UtilLink>
        </UtilRow>
      </Wrap>
    </Container>
  );
};

export default ApiKeyUpdateForm;

const Container = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
`;

const Wrap = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const UtilRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 10px;
`;
