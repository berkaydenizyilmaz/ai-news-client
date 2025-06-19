import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  ThumbsUp, 
  ThumbsDown, 
  Edit, 
  Trash2, 
  AlertTriangle 
} from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { useTopicPosts, useDeleteForumPost } from '../hooks/use-forum'
import { PostForm } from './PostForm'
import { ReportButton } from '@/components/common/ReportButton'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import type { PostsQueryParams } from '../types'

interface PostListProps {
  topicId: string
}

export function PostList({ topicId }: PostListProps) {
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [params, setParams] = useState<PostsQueryParams>({
    page: 1,
    limit: 20
  })
  
  const { user } = useAuthStore()
  const { data, isLoading, error } = useTopicPosts(topicId, params)
  const deletePostMutation = useDeleteForumPost()



  const handleDeletePost = async (postId: string) => {
    if (!confirm('Bu gönderiyi silmek istediğinizden emin misiniz?')) return
    
    try {
      await deletePostMutation.mutateAsync({ id: postId, topicId })
    } catch (error) {
      console.error('Post deletion failed:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Gönderiler yüklenirken hata oluştu</p>
      </div>
    )
  }

  if (!data?.posts?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Henüz yanıt bulunmuyor</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {data.posts.map((post) => {
        const canEdit = user && (
          user.id === post.user.id || 
          user.role === 'admin' || 
          user.role === 'moderator'
        )

        const canDelete = user && (
          user.id === post.user.id || 
          user.role === 'admin' || 
          user.role === 'moderator'
        )

        const isEditing = editingPostId === post.id

        return (
          <Card key={post.id} className={post.is_deleted ? 'opacity-60' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.user.avatar_url} />
                    <AvatarFallback>
                      {post.user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{post.user.username}</span>
                      <Badge variant="secondary" className="text-xs">
                        {post.user.role}
                      </Badge>
                      {post.is_deleted && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Silindi
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(post.created_at), {
                        addSuffix: true,
                        locale: tr
                      })}
                      {post.updated_at !== post.created_at && (
                        <span className="ml-2">(düzenlendi)</span>
                      )}
                    </div>
                  </div>
                </div>

                {(canEdit || canDelete) && !post.is_deleted && (
                  <div className="flex items-center gap-2">
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingPostId(isEditing ? null : post.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                        disabled={deletePostMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <PostForm
                  topicId={topicId}
                  editingPost={post}
                  onSuccess={() => setEditingPostId(null)}
                  onCancel={() => setEditingPostId(null)}
                />
              ) : (
                <>
                  <div className="prose prose-sm max-w-none mb-4">
                    <p className="whitespace-pre-wrap">
                      {post.is_deleted ? 'Bu gönderi silindi.' : post.content}
                    </p>
                  </div>

                  {!post.is_deleted && (
                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{post.like_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsDown className="h-4 w-4" />
                          <span>{post.dislike_count}</span>
                        </div>
                      </div>
                      
                      {/* Report button - only show if user is logged in and it's not their own post */}
                      {user && user.id !== post.user.id && (
                        <ReportButton
                          reportedType="forum_post"
                          reportedId={post.id}
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                        />
                      )}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )
      })}

      {/* Pagination */}
      {data && data.total_pages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={params.page === 1}
            onClick={() => setParams(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
          >
            Önceki
          </Button>
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Sayfa {params.page} / {data.total_pages}
          </span>
          <Button
            variant="outline"
            disabled={params.page === data.total_pages}
            onClick={() => setParams(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
          >
            Sonraki
          </Button>
        </div>
      )}
    </div>
  )
} 