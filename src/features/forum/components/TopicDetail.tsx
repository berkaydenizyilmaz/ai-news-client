import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  ArrowLeft, 
  MessageSquare, 
  Eye, 
  ThumbsUp, 
  Pin, 
  Lock, 
  Edit, 
  Trash2,
  Reply,
  MoreHorizontal
} from 'lucide-react'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/store/auth-store'
import { useForumTopic, useDeleteForumTopic } from '../hooks/use-forum'
import { PostForm } from './PostForm'
import { PostList } from './PostList'
import { ReportButton } from '@/components/common/ReportButton'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

interface TopicDetailProps {
  topicId: string
  onBack?: () => void
  onEdit?: (topicId: string) => void
}

export function TopicDetail({ topicId, onBack, onEdit }: TopicDetailProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const { user } = useAuthStore()
  
  const { data: topic, isLoading, error } = useForumTopic(topicId)
  const deleteTopicMutation = useDeleteForumTopic()

  const canEdit = user && (
    user.id === topic?.user.id || 
    user.role === 'admin' || 
    user.role === 'moderator'
  )

  const canDelete = user && (
    user.id === topic?.user.id || 
    user.role === 'admin' || 
    user.role === 'moderator'
  )

  const handleDelete = async () => {
    if (!topic || !confirm('Bu konuyu silmek istediğinizden emin misiniz?')) return
    
    try {
      await deleteTopicMutation.mutateAsync(topic.id)
      onBack?.()
    } catch (error) {
      console.error('Topic deletion failed:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !topic) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Konu yüklenirken hata oluştu</p>
        {onBack && (
          <Button variant="outline" onClick={onBack} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri Dön
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri
            </Button>
          )}
          <Badge variant="outline">{topic.category.name}</Badge>
        </div>
        
        {canEdit && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit?.(topic.id)}>
              <Edit className="h-4 w-4 mr-2" />
              Düzenle
            </Button>
            {canDelete && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDelete}
                disabled={deleteTopicMutation.isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Sil
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Topic Content */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {topic.is_pinned && <Pin className="h-4 w-4 text-orange-500" />}
                {topic.status === 'locked' && <Lock className="h-4 w-4 text-red-500" />}
                <CardTitle className="text-2xl">{topic.title}</CardTitle>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={topic.user.avatar_url} />
                    <AvatarFallback>
                      {topic.user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{topic.user.username}</span>
                  <Badge variant="secondary" className="text-xs">
                    {topic.user.role}
                  </Badge>
                </div>
                <span>•</span>
                <span>
                  {formatDistanceToNow(new Date(topic.created_at), {
                    addSuffix: true,
                    locale: tr
                  })}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none mb-6">
            <p className="whitespace-pre-wrap">{topic.content}</p>
          </div>
          
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{topic.reply_count} yanıt</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{topic.view_count} görüntülenme</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                <span>{topic.like_count} beğeni</span>
              </div>
            </div>
            
            {/* Report button - only show if user is logged in and it's not their own topic */}
            {user && user.id !== topic.user.id && (
              <ReportButton
                reportedType="forum_topic"
                reportedId={topic.id}
                variant="ghost"
                size="sm"
                className="text-xs"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reply Button */}
      {user && topic.status === 'active' && (
        <div className="flex justify-center">
          <Button 
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="gap-2"
          >
            <Reply className="h-4 w-4" />
            {showReplyForm ? 'Yanıtı İptal Et' : 'Yanıtla'}
          </Button>
        </div>
      )}

      {/* Reply Form */}
      {showReplyForm && (
        <Card>
          <CardHeader>
            <CardTitle>Yanıt Yaz</CardTitle>
          </CardHeader>
          <CardContent>
            <PostForm 
              topicId={topic.id}
              onSuccess={() => setShowReplyForm(false)}
              onCancel={() => setShowReplyForm(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* Posts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Yanıtlar ({topic.reply_count})
          </h3>
        </div>
        <PostList topicId={topic.id} />
      </div>
    </div>
  )
} 