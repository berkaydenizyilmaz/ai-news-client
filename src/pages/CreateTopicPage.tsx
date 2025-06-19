import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { TopicForm } from '@/features/forum'

export function CreateTopicPage() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/forum')
  }

  const handleSuccess = (topicId: string) => {
    navigate(`/forum/topic/${topicId}`)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Forum'a Dön
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Yeni Konu Oluştur</h1>
          <p className="text-muted-foreground">
            Toplulukla paylaşmak istediğin konuyu oluştur
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Konu Detayları</CardTitle>
          <CardDescription>
            Konunu açık ve anlaşılır bir şekilde tanımla
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TopicForm 
            onSuccess={handleSuccess}
            onCancel={handleBack}
          />
        </CardContent>
      </Card>
    </div>
  )
} 