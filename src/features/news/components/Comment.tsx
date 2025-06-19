import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { 
  MessageSquare, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Reply, 
  Shield,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { useDeleteComment } from '../hooks/use-comments'
import { CommentForm } from './CommentForm'
import { ReportButton } from '@/components/common/ReportButton'
import type { CommentWithUser } from '../types'

interface CommentProps {
  comment: CommentWithUser
  newsId: string
  depth?: number
  maxDepth?: number
  onReply?: (comment: CommentWithUser) => void
  onEdit?: (comment: CommentWithUser) => void
}

export function Comment({ 
  comment, 
  newsId, 
  depth = 0, 
  maxDepth = 5,
  onReply,
  onEdit 
}: CommentProps) {
  const { user } = useAuthStore()
  const deleteComment = useDeleteComment()
  
  const [showReplies, setShowReplies] = useState(true)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  
  const isModerator = user?.role === 'moderator' || user?.role === 'admin'
  const canReply = depth < maxDepth && !comment.is_deleted
  const canEdit = comment.can_edit && !comment.is_deleted
  const canDelete = comment.can_delete || isModerator

  const handleReply = () => {
    if (onReply) {
      onReply(comment)
    } else {
      setShowReplyForm(true)
    }
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(comment)
    } else {
      setShowEditForm(true)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteComment.mutateAsync(comment.id)
      setShowDeleteDialog(false)
    } catch (error) {
      console.error('Comment deletion failed:', error)
    }
  }

  const toggleReplies = () => {
    setShowReplies(!showReplies)
  }

  if (comment.is_deleted) {
    return (
      <div className={`${depth > 0 ? 'ml-12' : ''} py-4`}>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <MessageSquare className="h-4 w-4" />
          <span className="italic">Bu yorum silindi</span>
        </div>
        
        {/* Silinmiş yorumun alt yorumlarını göster */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map((reply) => (
              <Comment
                key={reply.id}
                comment={reply}
                newsId={newsId}
                depth={depth + 1}
                maxDepth={maxDepth}
                onReply={onReply}
                onEdit={onEdit}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`${depth > 0 ? 'ml-12' : ''} py-4`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={comment.user?.avatar_url} alt={comment.user?.username} />
          <AvatarFallback>
            {comment.user?.username?.charAt(0).toUpperCase() || '?'}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-sm">
              {comment.user?.username || 'Anonim Kullanıcı'}
            </span>
            
            {/* Role badge */}
            {comment.user?.role === 'admin' && (
              <Badge variant="destructive" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            )}
            {comment.user?.role === 'moderator' && (
              <Badge variant="secondary" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Moderatör
              </Badge>
            )}

            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), { 
                addSuffix: true, 
                locale: tr 
              })}
            </span>

            {comment.updated_at !== comment.created_at && (
              <span className="text-xs text-muted-foreground">(düzenlendi)</span>
            )}

            {/* Actions menu */}
            {(canEdit || canDelete || canReply) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-auto">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canReply && (
                    <DropdownMenuItem onClick={handleReply}>
                      <Reply className="h-4 w-4 mr-2" />
                      Yanıtla
                    </DropdownMenuItem>
                  )}
                  {canEdit && (
                    <DropdownMenuItem onClick={handleEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Düzenle
                    </DropdownMenuItem>
                  )}
                  {canDelete && (
                    <DropdownMenuItem 
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Sil
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Content */}
          {showEditForm ? (
            <div className="mb-4">
              <CommentForm
                newsId={newsId}
                editingComment={comment}
                onCancel={() => setShowEditForm(false)}
                onSuccess={() => setShowEditForm(false)}
                autoFocus
              />
            </div>
          ) : (
            <div className="mb-3">
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {comment.content}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {canReply && !showEditForm && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 hover:text-primary"
                onClick={handleReply}
              >
                <Reply className="h-3 w-3 mr-1" />
                Yanıtla
              </Button>
            )}

            {comment.replies && comment.replies.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 hover:text-primary"
                onClick={toggleReplies}
              >
                {showReplies ? (
                  <ChevronUp className="h-3 w-3 mr-1" />
                ) : (
                  <ChevronDown className="h-3 w-3 mr-1" />
                )}
                {comment.replies.length} yanıt {showReplies ? 'gizle' : 'göster'}
              </Button>
            )}

            {/* Report button - only show if user is logged in and it's not their own comment */}
            {user && user.id !== comment.user?.id && !comment.is_deleted && (
              <ReportButton
                reportedType="comment"
                reportedId={comment.id}
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
              />
            )}
          </div>

          {/* Reply form */}
          {showReplyForm && (
            <div className="mt-4">
              <CommentForm
                newsId={newsId}
                parentComment={comment}
                onCancel={() => setShowReplyForm(false)}
                onSuccess={() => setShowReplyForm(false)}
                placeholder={`${comment.user?.username} kullanıcısına yanıt verin...`}
                autoFocus
              />
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && showReplies && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <Comment
                  key={reply.id}
                  comment={reply}
                  newsId={newsId}
                  depth={depth + 1}
                  maxDepth={maxDepth}
                  onReply={onReply}
                  onEdit={onEdit}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yorumu Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu yorumu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              {comment.replies && comment.replies.length > 0 && (
                <span className="block mt-2 font-medium">
                  Bu yorumun {comment.replies.length} adet yanıtı var.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteComment.isPending}
            >
              {deleteComment.isPending ? 'Siliniyor...' : 'Sil'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 