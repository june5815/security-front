import { useEffect, useState } from 'react';

import DeleteModal from '@/shared/DeleteModal';
import DetailNoticeCommentForm from '@/entities/notice/ui/detail/DetailNoticeCommentForm';
import DetailNoticeCommentList from '@/entities/notice/ui/detail/DetailNoticeCommentList';
import DetailNoticeInfo from '@/entities/notice/ui/detail/DetailNoticeInfo';
import useAuthStore from '@/lib/stores/useAuthStore';
import { useRouter } from 'next/router';
import useNoticeDetailStore from '@/lib/stores/useNoticeDetailStore';
import useCommentStore from '@/lib/stores/useCommentStore';
import { CommentsCreateRequest, CommentsUpdateRequest } from '@/lib/types';
import { createComment, deleteComment, updateComment } from '@/lib/api/comments';
import { deleteNotice } from '@/lib/api/notices';

export default function DetailAdminNoticePage() {
  const [newComment, setNewComment] = useState('');
  const [editComment, setEditComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState('');
  const [isNoticeDeleteModalOpen, setIsNoticeDeleteModalOpen] = useState(false);
  const [isCommentDeleteModalOpen, setIsCommentDeleteModalOpen] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const authentication = useAuthStore((state) => state.authentication);
  const { data, updateParams } = useNoticeDetailStore();
  const { paginationState: commentPaginationState, updateParams: updateCommentParams, add: addComment, delete: removeComment, update: updateCommentData } = useCommentStore();
  const { totalCount: commentTotalCount } = commentPaginationState;

  useEffect(() => {
    if (id && typeof id === 'string') {
      updateParams({id});
      updateCommentParams({resourceId: id, resourceType: 'NOTICE'});
    }
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authentication?.id) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!newComment.trim()) {
      alert('댓글 내용을 입력하세요.');
      return;
    }
    try {
      const payload: CommentsCreateRequest = {
        content: newComment,
        resourceType: 'NOTICE',
        resourceId: id as string,
      };
      const createdComment = await createComment(payload);
      addComment(createdComment);
      setNewComment('');
    } catch (error) {
      alert('댓글 등록에 실패했습니다.');
      console.error(error);
    }
  };

  const handleEditClick = (commentId: string, content: string) => {
    setIsEditing(true);
    setEditingCommentId(commentId);
    setEditComment(content);
  };

  const handleEditCommentSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();
    try {
      const payload: CommentsUpdateRequest = {
        content: editComment,
      };
      await updateComment(editingCommentId, payload);
      updateCommentData(editingCommentId, payload);
      setIsEditing(false);
      setEditComment('');
    } catch (error) {
      console.error('댓글 수정 실패:', error);
    }
  };

  const handleNoticeDeleteClick = () => {
    setIsNoticeDeleteModalOpen(true);
  };

  const handleNoticeDeleteSubmit = async (id: string | string[] | undefined) => {
    try {
      await deleteNotice(id as string);
      setIsNoticeDeleteModalOpen(false);
      router.push('/admin/notice');
    } catch (error) {
      console.error('공지사항 삭제 실패:', error);
    }
  };

  const handleCommentDeleteSubmit = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      removeComment(commentId);
      setIsCommentDeleteModalOpen(false);
      setEditingCommentId('');
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  return (
    <div className='text-gray-900'>
      {data && (
        <>
          <DetailNoticeInfo
            onEdit={() => router.push(`/admin/notice/edit/${id}`)}
            onDelete={handleNoticeDeleteClick}
          />

          <div className='mt-[40px] mb-[90px] text-lg leading-relaxed whitespace-pre-wrap'>
            {data.content}
          </div>
        </>
      )}

      <div>
        <div className='mb-[30px] w-full border-b border-gray-500 pb-2 font-medium text-gray-500'>
          {commentTotalCount > 0 ? `댓글 ${commentTotalCount}` : '등록된 댓글이 없습니다.'}
        </div>

        <DetailNoticeCommentForm
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onSubmit={handleCommentSubmit}
        />

        <DetailNoticeCommentList
          isEditing={isEditing}
          editingCommentId={editingCommentId}
          editComment={editComment}
          setEditComment={setEditComment}
          onEditClick={handleEditClick}
          onEditSubmit={handleEditCommentSubmit}
          onEditCancel={() => setIsEditing(false)}
          onDeleteClick={(commentId) => {
            setEditingCommentId(commentId);
            setIsCommentDeleteModalOpen(true);
          }}
        />
      </div>

      {isNoticeDeleteModalOpen && (
        <DeleteModal
          isModalOpen={isNoticeDeleteModalOpen}
          setIsModalOpen={setIsNoticeDeleteModalOpen}
          onDelete={() => handleNoticeDeleteSubmit(id)}
        />
      )}
      {isCommentDeleteModalOpen && (
        <DeleteModal
          isModalOpen={isCommentDeleteModalOpen}
          setIsModalOpen={setIsCommentDeleteModalOpen}
          onDelete={() => handleCommentDeleteSubmit(editingCommentId)}
        />
      )}
    </div>
  );
}
