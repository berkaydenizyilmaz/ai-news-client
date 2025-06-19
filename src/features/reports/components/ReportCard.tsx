import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, User, Calendar, MessageSquare, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useReport, useReviewReport, useDeleteReport } from '../hooks/use-reports';
import { useAuthStore } from '@/store/auth-store';
import type { ReviewReportRequest } from '../types';

interface ReportCardProps {
  reportId: string;
  onBack: () => void;
}

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
  dismissed: 'bg-gray-100 text-gray-800',
};

const STATUS_LABELS = {
  pending: 'Bekliyor',
  reviewed: 'İncelendi',
  resolved: 'Çözüldü',
  dismissed: 'Reddedildi',
};

const TYPE_LABELS = {
  news: 'Haber',
  comment: 'Yorum',
  forum_post: 'Forum Gönderisi',
  forum_topic: 'Forum Konusu',
};

export const ReportCard = ({ reportId, onBack }: ReportCardProps) => {
  const [reviewStatus, setReviewStatus] = useState<'reviewed' | 'resolved' | 'dismissed'>('reviewed');
  const [reviewNotes, setReviewNotes] = useState('');
  
  const { user } = useAuthStore();
  const { data: report, isLoading, error } = useReport(reportId);
  const reviewMutation = useReviewReport();
  const deleteMutation = useDeleteReport();

  const handleReview = () => {
    if (!report) return;

    const data: ReviewReportRequest = {
      status: reviewStatus,
      review_notes: reviewNotes.trim() || undefined,
    };

    reviewMutation.mutate(
      { id: report.id, data },
      {
        onSuccess: () => {
          setReviewNotes('');
        },
      }
    );
  };

  const handleDelete = () => {
    if (!report) return;
    deleteMutation.mutate(report.id, {
      onSuccess: onBack,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Yükleniyor...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !report) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            Şikayet yüklenirken hata oluştu
          </div>
          <div className="flex justify-center mt-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri Dön
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const canReview = user?.role === 'moderator' || user?.role === 'admin';
  const canDelete = user?.role === 'admin';
  const isPending = report.status === 'pending';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri Dön
        </Button>
        <h1 className="text-2xl font-bold">Şikayet Detayı</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Ana Bilgiler */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Şikayet Bilgileri
              <Badge className={STATUS_COLORS[report.status]}>
                {STATUS_LABELS[report.status]}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Tür:</span>
              <Badge variant="outline">
                {TYPE_LABELS[report.reported_type]}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Şikayetçi:</span>
              <span>{report.reporter?.username || 'Bilinmeyen'}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Tarih:</span>
              <span>{new Date(report.created_at).toLocaleString('tr-TR')}</span>
            </div>

            <div className="space-y-2">
              <span className="font-medium">Neden:</span>
              <p className="text-sm bg-muted p-3 rounded">{report.reason}</p>
            </div>

            {report.description && (
              <div className="space-y-2">
                <span className="font-medium">Açıklama:</span>
                <p className="text-sm bg-muted p-3 rounded">{report.description}</p>
              </div>
            )}

            {report.reviewed_by && report.reviewer && (
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Değerlendiren:</span>
                  <span>{report.reviewer.username}</span>
                </div>
                {report.reviewed_at && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(report.reviewed_at).toLocaleString('tr-TR')}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Değerlendirme */}
        {canReview && (
          <Card>
            <CardHeader>
              <CardTitle>Değerlendirme</CardTitle>
              <CardDescription>
                Bu şikayeti değerlendirin ve durumunu güncelleyin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Durum</label>
                <Select value={reviewStatus} onValueChange={setReviewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reviewed">İncelendi</SelectItem>
                    <SelectItem value="resolved">Çözüldü</SelectItem>
                    <SelectItem value="dismissed">Reddedildi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Değerlendirme Notları</label>
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Bu şikayetle ilgili notlarınızı yazın..."
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleReview}
                  disabled={reviewMutation.isPending}
                  className="flex-1"
                >
                  {reviewMutation.isPending ? 'Güncelleniyor...' : 'Durumu Güncelle'}
                </Button>

                {canDelete && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Şikayeti Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bu şikayeti kalıcı olarak silmek istediğinizden emin misiniz?
                          Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {deleteMutation.isPending ? 'Siliniyor...' : 'Sil'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}; 