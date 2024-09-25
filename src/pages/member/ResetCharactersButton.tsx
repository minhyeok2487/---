import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import useResetCharacters from "@core/hooks/mutations/member/useResetCharacters";
import useModalState from "@core/hooks/useModalState";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";
import Modal from "@components/Modal";

const ResetCharactersButton = () => {
  const [resetModal, toggleResetModal] = useModalState<boolean>();
  const queryClient = useQueryClient();

  const resetCharacters = useResetCharacters({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getMyInformation(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCharacters(),
      });

      toast.success("등록된 캐릭터가 정상적으로 삭제되었습니다.");
    },
  });

  return (
    <>
      <div className="formArea left">
        <Button variant="outlined" onClick={() => toggleResetModal(true)}>
          등록된 캐릭터 전체삭제
        </Button>
      </div>
      <Modal
        title="등록 캐릭터 삭제"
        isOpen={!!resetModal}
        onClose={toggleResetModal}
        buttons={[
          {
            label: "확인",
            onClick: resetCharacters.mutate,
          },
          {
            label: "취소",
            onClick: () => toggleResetModal(),
          },
        ]}
      >
        정말로 등록된 캐릭터를 삭제하시겠습니까?
        <br />
        등록된 캐릭터, 숙제, 깐부 데이터가 삭제됩니다.
        <br />
        코멘트 데이터는 유지됩니다.
      </Modal>
    </>
  );
};

export default ResetCharactersButton;
