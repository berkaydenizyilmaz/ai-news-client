import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle } from 'lucide-react';
import { useCreateReport } from '../hooks/use-reports';
import type { ReportedType } from '../types';

interface ReportFormProps {
  reportedType: ReportedType;
  reportedId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const REPORT_TYPES = {
  news: 'Haber',
  comment: 'Yorum',
  forum_post: 'Forum Gönderisi',
  forum_topic: 'Forum Konusu',
};

export const ReportForm = ({ reportedType, reportedId, onSuccess, onCancel }: ReportFormProps) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const createReportMutation = useCreateReport();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) return;

    createReportMutation.mutate(
      {
        reported_type: reportedType,
        reported_id: reportedId,
        reason: reason.trim(),
        description: description.trim() || undefined,
      },
      {
        onSuccess: () => {
          setReason('');
          setDescription('');
          onSuccess?.();
        },
      }
    );
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          İçerik Şikayeti
        </CardTitle>
        <CardDescription>
          {REPORT_TYPES[reportedType]} için şikayet gönderiyorsunuz
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Şikayet Nedeni *</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Şikayet nedeninizi belirtin"
              maxLength={255}
              required
            />
            <p className="text-xs text-muted-foreground">
              {reason.length}/255 karakter
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detaylı Açıklama</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Şikayetinizle ilgili detayları belirtebilirsiniz (opsiyonel)"
              maxLength={1000}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/1000 karakter
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={!reason.trim() || createReportMutation.isPending}
              className="flex-1"
            >
              {createReportMutation.isPending ? 'Gönderiliyor...' : 'Şikayet Gönder'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                İptal
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}; 