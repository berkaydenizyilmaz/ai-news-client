import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, X } from 'lucide-react';
import { useRssSource } from '../services/rss-api';
import { useRss } from '../hooks/use-rss';
import type { CreateRssSourceRequest, UpdateRssSourceRequest } from '../types';

const rssSourceSchema = z.object({
  name: z.string().min(1, 'Kaynak adı gereklidir').max(255, 'Kaynak adı çok uzun'),
  url: z.string().url('Geçerli bir URL giriniz'),
  description: z.string().max(500, 'Açıklama çok uzun').optional().or(z.literal('')),
  is_active: z.boolean(),
});

type RssSourceFormData = z.infer<typeof rssSourceSchema>;

interface RssSourceFormProps {
  sourceId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const RssSourceForm = ({ sourceId, onSuccess, onCancel }: RssSourceFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!sourceId;
  const { data: existingSource, isLoading: isLoadingSource } = useRssSource(sourceId || '');
  const { createRssSource, updateRssSource } = useRss();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<RssSourceFormData>({
    resolver: zodResolver(rssSourceSchema),
    defaultValues: {
      name: '',
      url: '',
      description: '',
      is_active: true,
    },
  });

  const isActive = watch('is_active');

  // Load existing data for editing
  useEffect(() => {
    if (isEditing && existingSource) {
      reset({
        name: existingSource.name,
        url: existingSource.url,
        description: existingSource.description || '',
        is_active: existingSource.is_active,
      });
    }
  }, [existingSource, isEditing, reset]);

  const onSubmit = async (data: RssSourceFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditing && sourceId) {
        const updateData: UpdateRssSourceRequest = {
          name: data.name,
          url: data.url,
          description: data.description || undefined,
          is_active: data.is_active,
        };
        await updateRssSource.mutateAsync(sourceId, updateData);
      } else {
        const createData: CreateRssSourceRequest = {
          name: data.name,
          url: data.url,
          description: data.description || undefined,
        };
        await createRssSource.mutateAsync(createData);
      }
      
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditing && isLoadingSource) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>RSS kaynağı yükleniyor...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? 'RSS Kaynağını Düzenle' : 'Yeni RSS Kaynağı Ekle'}
        </CardTitle>
        <CardDescription>
          {isEditing 
            ? 'Mevcut RSS kaynağının bilgilerini güncelleyin'
            : 'Yeni bir RSS kaynağı eklemek için aşağıdaki formu doldurun'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Kaynak Adı *</Label>
            <Input
              id="name"
              placeholder="Örn: TechCrunch"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">RSS URL *</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/rss.xml"
              {...register('url')}
            />
            {errors.url && (
              <p className="text-sm text-destructive">{errors.url.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              placeholder="RSS kaynağı hakkında kısa açıklama..."
              rows={3}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={(checked) => setValue('is_active', checked)}
            />
            <Label htmlFor="is_active">
              Aktif {isActive ? '(RSS çekme işlemlerine dahil)' : '(Pasif durumda)'}
            </Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditing ? 'Güncelleniyor...' : 'Oluşturuluyor...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Güncelle' : 'Oluştur'}
                </>
              )}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-2" />
                İptal
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}; 