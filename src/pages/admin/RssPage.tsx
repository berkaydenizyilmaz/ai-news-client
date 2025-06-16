import { useState } from 'react';
import { RssSourcesList, RssSourceForm } from '@/features/admin';

type ViewMode = 'list' | 'create' | 'edit';

export const RssPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);

  const handleCreateClick = () => {
    setViewMode('create');
    setEditingSourceId(null);
  };

  const handleEditClick = (sourceId: string) => {
    setViewMode('edit');
    setEditingSourceId(sourceId);
  };

  const handleFormSuccess = () => {
    setViewMode('list');
    setEditingSourceId(null);
  };

  const handleFormCancel = () => {
    setViewMode('list');
    setEditingSourceId(null);
  };

  return (
    <>
      {viewMode === 'list' && (
        <RssSourcesList
          onCreateClick={handleCreateClick}
          onEditClick={handleEditClick}
        />
      )}
      
      {(viewMode === 'create' || viewMode === 'edit') && (
        <RssSourceForm
          sourceId={editingSourceId || undefined}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
    </>
  );
};
