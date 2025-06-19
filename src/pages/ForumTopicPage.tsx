import { useParams, useNavigate } from 'react-router-dom'
import { TopicDetail } from '@/features/forum'

export function ForumTopicPage() {
  const { topicId } = useParams<{ topicId: string }>()
  const navigate = useNavigate()

  if (!topicId) {
    navigate('/forum')
    return null
  }

  const handleBack = () => {
    navigate('/forum')
  }

  const handleEdit = (topicId: string) => {
    navigate(`/forum/topic/${topicId}/edit`)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <TopicDetail 
        topicId={topicId}
        onBack={handleBack}
        onEdit={handleEdit}
      />
    </div>
  )
} 