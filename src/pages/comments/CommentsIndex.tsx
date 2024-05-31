import "../../styles/pages/CommentsIndex.css";
import { useSetRecoilState } from "recoil";
import { loading } from "../../core/atoms/Loading.atom";
import * as commentApi from "../../core/apis/Comment.api";
import { useEffect, useState } from "react";
import { CommentType } from "../../core/types/Comment.type.";
import { useLocation } from "react-router-dom";
import DefaultLayout from "../../layouts/DefaultLayout";
import DiscordIcon from "../../assets/DiscordIcon";
import CommentInsertForm from "./components/CommentInsertForm";
import Comment from "./components/Comment";
import PageNation from "../../components/PageNation";
import { useMember } from "../../core/apis/Member.api";

interface activeCommentType {
  id: number;
  type: string;
}

const CommentsIndex = () => {
  const { data: member } = useMember();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = parseInt(queryParams.get("page") || "1", 10);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [rootComments, setRootComments] = useState<CommentType[]>([]);
  const [activeComment, setActiveComment] = useState<activeCommentType>();
  const [totalPages, setTotalPages] = useState(1);
  const setLoadingState = useSetRecoilState(loading);

  // 방명록 데이터
  const getComment = async (page: number) => {
    setLoadingState(true);
    try {
      const data = await commentApi.getComments(page);
      setComments(data.commentDtoList);
      setTotalPages(data.totalPages);
      isRootComments(data.commentDtoList);
    } catch (error) {
      console.log(error);
    }
    setLoadingState(false);
  };

  // 데이터 호출
  useEffect(() => {
    getComment(page);
  }, [page]);

  //게시글 추가
  const addComment = async (text: string, parentId?: number) => {
    await commentApi.addComment(text, parentId);
    getComment(page);
  };

  //게시글 수정
  const updateComment = async (
    text: string,
    commentId: number,
    page: number
  ) => {
    // const data = await comment.updateComment(text, commentId, page);
    // setBackendComments(data.commentDtoList);
    // isRootComments(data.commentDtoList);
    // setActiveComment(null);
  };

  //게시글 삭제
  const deleteComment = async (commentId: number) => {
    // const data = await comment.deleteComment(commentId);
    // setBackendComments(data.commentDtoList);
    // setTotalPages(data.totalPages);
    // isRootComments(data.commentDtoList);
    // setCurrentPage(1);
    // setActiveComment(null);
  };

  //루트 코멘트인가?
  const isRootComments = (commentsList: CommentType[]) => {
    const rootComents = commentsList.filter(
      (comment) => comment.parentId === 0
    );
    setRootComments(rootComents);
  };

  //답글인가? (루트 코멘트가 있는가?)
  const getReplies = (commentId: number) => {
    if (comments) {
      return comments
        .filter((backendComment) => backendComment.parentId === commentId)
        .sort(
          (a, b) =>
            new Date(a.regDate).getTime() - new Date(b.regDate).getTime()
        );
    }
    return [];
  };

  return (
    <DefaultLayout>
      <div className="comments">
        <h2>
          방명록 <p>하고싶으신 말씀 자유롭게 남겨주세요!</p>
        </h2>
        <div className="noticeBox box01">
          <p className="notice">주요 공지사항</p>
          <div className="cont">
            <ul>
              <li>
                개발자 : <DiscordIcon /> 마볼링#2884{" "}
              </li>
              <li>
                UI담당자 : <DiscordIcon /> 얀비#7431
              </li>
            </ul>
          </div>
          <div className="cont">
            <p>
              사용해주시고 많은 의견주셔서 너무 감사합니다. 최대한 빠르게
              업데이트 하도록 해보겠습니다!
            </p>
            <ul>
              <li>
                서버에 접속이 안되는 경우, 보통 업데이트 중이므로 1~2분 후
                접속이 가능합니다.
              </li>
              <li>
                슬라임/메데이아의 경우 서버별로 다르고, 길드가 직접 운영하기
                때문에 추가가 어려울 것 같습니다.
              </li>
            </ul>
          </div>
          <div className="cont">
            <p style={{ fontWeight: "bold" }}>개발자에게 커피 한잔</p>
            <ul>
              <li>
                보내주신 소중한 후원금은 서버 유지 및 발전 비용으로 사용됩니다.
              </li>
              <li>카카오뱅크 3333-08-6962739</li>
              <li>예금주 : 이민혁</li>
            </ul>
          </div>
        </div>
        <div className="noticeBox box05">
          {member?.username && (
            <CommentInsertForm
              submitLabel="작성하기"
              handleSubmit={addComment}
            />
          )}
          <div className="comments-container">
            {rootComments.map((rootComment) => (
              <Comment
                key={rootComment.id}
                comment={rootComment}
                replies={getReplies(rootComment.id)}
                activeComment={activeComment}
                setActiveComment={setActiveComment}
                addComment={addComment}
                deleteComment={deleteComment}
                updateComment={updateComment}
                currentPage={page}
              />
            ))}
          </div>
        </div>
      </div>
      <PageNation totalPages={totalPages} />
    </DefaultLayout>
  );
};

export default CommentsIndex;
