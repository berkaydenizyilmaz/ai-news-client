import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { ArrowLeft, Save, Settings as SettingsIcon } from 'lucide-react';
import { useSetting, useCreateSetting, useUpdateSetting } from '../services/settings-api';
import { useErrorHandler } from '@/hooks/use-error-handler';

// Form validation schema
const settingsFormSchema = z.object({
  key: z.string()
    .min(1, 'Key gereklidir')
    .regex(/^[a-zA-Z0-9_.-]+$/, 'Key sadece harf, rakam, _, ., - karakterlerini içerebilir'),
  value: z.string().min(1, 'Değer gereklidir'),
  type: z.enum(['string', 'number', 'boolean', 'json'], {
    required_error: 'Tip seçimi gereklidir'
  }),
  category: z.string().optional(),
  description: z.string().optional(),
});

type SettingsFormData = z.infer<typeof settingsFormSchema>;

interface SettingsFormProps {
  settingKey?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Settings form bileşeni
// Yeni ayar oluşturma veya mevcut ayarı düzenleme
export const SettingsForm = ({ settingKey, onSuccess, onCancel }: SettingsFormProps) => {
  const isEditing = Boolean(settingKey);
  
  const { data: existingSetting, isLoading: isLoadingSetting } = useSetting(settingKey || '');
  
  const createSetting = useCreateSetting();
  const updateSetting = useUpdateSetting();
  const { handleError } = useErrorHandler();

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      key: '',
      value: 'false', // Default boolean value
      type: 'string',
      category: 'none',
      description: '',
    },
  });

  // Load existing setting data
  useEffect(() => {
    if (isEditing && existingSetting) {
      form.reset({
        key: existingSetting.key,
        value: existingSetting.value,
        type: existingSetting.type as 'string' | 'number' | 'boolean' | 'json',
        category: existingSetting.category || 'none',
        description: existingSetting.description || '',
      });
    }
  }, [existingSetting, form, isEditing]);

  const onSubmit = async (data: SettingsFormData) => {
    try {
      // Validate and format value based on type
      let formattedValue = data.value;
      
      if (data.type === 'number') {
        const numValue = parseFloat(data.value);
        if (isNaN(numValue)) {
          form.setError('value', { message: 'Geçerli bir sayı giriniz' });
          return;
        }
        formattedValue = numValue.toString();
      } else if (data.type === 'boolean') {
        // Switch component already ensures 'true' or 'false' values
        formattedValue = data.value;
      } else if (data.type === 'json') {
        try {
          JSON.parse(data.value);
        } catch {
          form.setError('value', { message: 'Geçerli bir JSON formatı giriniz' });
          return;
        }
      }

      const settingData = {
        key: data.key,
        value: formattedValue,
        type: data.type,
        category: data.category && data.category !== 'none' 
          ? data.category as 'general' | 'rss' | 'ai' | 'auth' | 'news' | 'forum' | 'email' | 'security'
          : undefined,
        description: data.description || undefined,
      };

      if (isEditing) {
        // Düzenleme sırasında sadece value ve description güncellenebilir
        await updateSetting.mutateAsync({
          key: data.key,
          data: {
            value: formattedValue,
            description: data.description || undefined,
          }
        });
      } else {
        await createSetting.mutateAsync(settingData);
      }

      onSuccess?.();
    } catch (error) {
      const errorMessage = handleError(error);
      form.setError('root', { message: errorMessage });
    }
  };

  const watchedType = form.watch('type');

  // Reset value when type changes (only for new settings)
  useEffect(() => {
    if (!isEditing) {
      const currentValue = form.getValues('value');
      if (watchedType === 'boolean' && !['true', 'false'].includes(currentValue)) {
        form.setValue('value', 'false');
      } else if (watchedType !== 'boolean' && ['true', 'false'].includes(currentValue)) {
        form.setValue('value', '');
      }
    }
  }, [watchedType, form, isEditing]);

  const getValuePlaceholder = (type: string) => {
    switch (type) {
      case 'string': return 'Metin değeri girin...';
      case 'number': return '123 veya 45.67';
      case 'boolean': return 'true veya false';
      case 'json': return '{"key": "value"} veya ["item1", "item2"]';
      default: return 'Değer girin...';
    }
  };

  const getValueDescription = (type: string) => {
    switch (type) {
      case 'string': return 'Herhangi bir metin değeri';
      case 'number': return 'Sayısal değer (tam sayı veya ondalık)';
      case 'boolean': return 'true veya false değeri';
      case 'json': return 'Geçerli JSON formatında veri';
      default: return '';
    }
  };

  if (isLoadingSetting) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {onCancel && (
          <Button variant="outline" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri
          </Button>
        )}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <SettingsIcon className="h-8 w-8" />
            {isEditing ? 'Ayar Düzenle' : 'Yeni Ayar'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing 
              ? `"${settingKey}" ayarını düzenleyin`
              : 'Yeni sistem ayarı oluşturun'
            }
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Ayar Bilgileri</CardTitle>
          <CardDescription>
            Ayar detaylarını girin. Tüm alanlar doldurulduktan sonra kaydedin.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Key Field */}
              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="ayar_anahtari" 
                        {...field}
                        disabled={isEditing} // Key cannot be changed when editing
                      />
                    </FormControl>
                    <FormDescription>
                      Ayarın benzersiz anahtarı. Sadece harf, rakam, _, ., - karakterleri kullanılabilir.
                      {isEditing && ' (Düzenleme sırasında değiştirilemez)'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

                             {/* Type Field */}
               <FormField
                 control={form.control}
                 name="type"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Tip *</FormLabel>
                     <Select 
                       onValueChange={field.onChange} 
                       disabled={isEditing}
                       defaultValue={field.value}
                       key={`type-${field.value}-${isEditing}`}
                     >
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue placeholder="Veri tipini seçin" />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         <SelectItem value="string">String (Metin)</SelectItem>
                         <SelectItem value="number">Number (Sayı)</SelectItem>
                         <SelectItem value="boolean">Boolean (true/false)</SelectItem>
                         <SelectItem value="json">JSON (Nesne/Dizi)</SelectItem>
                       </SelectContent>
                     </Select>
                     <FormDescription>
                       Ayarın veri tipi. Bu, değerin nasıl işleneceğini belirler.
                       {isEditing && ' (Düzenleme sırasında değiştirilemez)'}
                     </FormDescription>
                     <FormMessage />
                   </FormItem>
                 )}
               />

              {/* Value Field */}
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Değer *</FormLabel>
                    <FormControl>
                      {watchedType === 'boolean' ? (
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={field.value === 'true'}
                            onCheckedChange={(checked) => field.onChange(checked ? 'true' : 'false')}
                          />
                          <span className="text-sm text-muted-foreground">
                            {field.value === 'true' ? 'Açık (true)' : 'Kapalı (false)'}
                          </span>
                        </div>
                      ) : watchedType === 'json' ? (
                        <Textarea 
                          placeholder={getValuePlaceholder(watchedType)}
                          className="min-h-[120px] font-mono"
                          {...field}
                        />
                      ) : (
                        <Input 
                          placeholder={getValuePlaceholder(watchedType)}
                          {...field}
                        />
                      )}
                    </FormControl>
                    <FormDescription>
                      {getValueDescription(watchedType)}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

                             {/* Category Field */}
               <FormField
                 control={form.control}
                 name="category"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Kategori</FormLabel>
                     <Select 
                       onValueChange={field.onChange} 
                       disabled={isEditing}
                       defaultValue={field.value}
                       key={`category-${field.value}-${isEditing}`}
                     >
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue placeholder="Kategori seçin (opsiyonel)" />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         <SelectItem value="none">Kategori Yok</SelectItem>
                         <SelectItem value="general">General</SelectItem>
                         <SelectItem value="rss">RSS</SelectItem>
                         <SelectItem value="ai">AI</SelectItem>
                         <SelectItem value="auth">Auth</SelectItem>
                         <SelectItem value="news">News</SelectItem>
                         <SelectItem value="forum">Forum</SelectItem>
                         <SelectItem value="email">Email</SelectItem>
                         <SelectItem value="security">Security</SelectItem>
                       </SelectContent>
                     </Select>
                     <FormDescription>
                       Ayarın ait olduğu kategori. Filtreleme ve organizasyon için kullanılır.
                       {isEditing && ' (Düzenleme sırasında değiştirilemez)'}
                     </FormDescription>
                     <FormMessage />
                   </FormItem>
                 )}
               />

              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Açıklama</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Bu ayarın ne işe yaradığını açıklayın..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Ayarın amacı ve kullanımı hakkında açıklama.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Form Error */}
              {form.formState.errors.root && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {form.formState.errors.root.message}
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  disabled={createSetting.isPending || updateSetting.isPending}
                  className="flex-1 sm:flex-none"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {createSetting.isPending || updateSetting.isPending 
                    ? 'Kaydediliyor...' 
                    : isEditing 
                      ? 'Güncelle' 
                      : 'Kaydet'
                  }
                </Button>
                {onCancel && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onCancel}
                    disabled={createSetting.isPending || updateSetting.isPending}
                  >
                    İptal
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}; 