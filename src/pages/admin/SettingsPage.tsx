import { useState } from 'react';
import { SettingsList, SettingsForm, AdminLayout } from '@/features/admin';

type ViewMode = 'list' | 'create' | 'edit';

export const SettingsPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingSettingKey, setEditingSettingKey] = useState<string | null>(null);

  const handleCreateClick = () => {
    setViewMode('create');
    setEditingSettingKey(null);
  };

  const handleEditClick = (settingKey: string) => {
    setViewMode('edit');
    setEditingSettingKey(settingKey);
  };

  const handleFormSuccess = () => {
    setViewMode('list');
    setEditingSettingKey(null);
  };

  const handleFormCancel = () => {
    setViewMode('list');
    setEditingSettingKey(null);
  };

  return (
    <AdminLayout>
      {viewMode === 'list' && (
        <SettingsList
          onCreateClick={handleCreateClick}
          onEditClick={handleEditClick}
        />
      )}
      
      {(viewMode === 'create' || viewMode === 'edit') && (
        <SettingsForm
          settingKey={editingSettingKey || undefined}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
    </AdminLayout>
  );
}; 