import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { Plus } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { CategoryList, TopicList, TopicForm } from '@/features/forum'

type ForumView = 'categories' | 'topics' | 'create-topic'

export function ForumPage() {
  const [currentView, setCurrentView] = useState<ForumView>('categories')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const { user } = useAuthStore()

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    setCurrentView('topics')
  }

  const handleBackToCategories = () => {
    setCurrentView('categories')
    setSelectedCategoryId('')
  }

  const handleCreateTopic = () => {
    if (!user) {
      // Redirect to login or show login modal
      return
    }
    setCurrentView('create-topic')
  }

  const handleTopicCreated = (topicId: string) => {
    // Navigate to the created topic
    window.location.href = `/forum/topic/${topicId}`
  }

  const handleCancelCreate = () => {
    setCurrentView('categories')
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Forum</h1>
          <p className="text-muted-foreground">
            Toplulukla tartış, sorular sor ve deneyimlerini paylaş
          </p>
        </div>
        
        {user && currentView !== 'create-topic' && (
          <Button onClick={handleCreateTopic} className="gap-2">
            <Plus className="h-4 w-4" />
            Yeni Konu
          </Button>
        )}
      </div>

      {/* Breadcrumb */}
      {currentView !== 'categories' && (
        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <button 
            onClick={handleBackToCategories}
            className="hover:text-foreground transition-colors"
          >
            Forum
          </button>
          {currentView === 'topics' && (
            <>
              <span>/</span>
              <span>Konular</span>
            </>
          )}
          {currentView === 'create-topic' && (
            <>
              <span>/</span>
              <span>Yeni Konu</span>
            </>
          )}
        </div>
      )}

      {/* Content */}
      <div className="space-y-6">
        {currentView === 'categories' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Kategoriler</h2>
            <CategoryList onCategorySelect={handleCategorySelect} />
          </div>
        )}

        {currentView === 'topics' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Konular</h2>
              <Button variant="outline" onClick={handleBackToCategories}>
                Kategorilere Dön
              </Button>
            </div>
            <TopicList 
              categoryId={selectedCategoryId}
              onTopicSelect={(topicId) => {
                // Navigate to topic detail page
                window.location.href = `/forum/topic/${topicId}`
              }}
            />
          </div>
        )}

        {currentView === 'create-topic' && (
          <Card>
            <CardHeader>
              <CardTitle>Yeni Konu Oluştur</CardTitle>
              <CardDescription>
                Toplulukla paylaşmak istediğin konuyu oluştur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TopicForm 
                onSuccess={handleTopicCreated}
                onCancel={handleCancelCreate}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 