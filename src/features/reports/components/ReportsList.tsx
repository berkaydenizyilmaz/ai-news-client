import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Search, Filter, Eye } from 'lucide-react';
import { useReports } from '../hooks/use-reports';
import { ReportCard } from './ReportCard';
import type { ReportStatus, ReportedType } from '../types';

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

export const ReportsList = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ReportStatus | ''>('');
  const [reportedType, setReportedType] = useState<ReportedType | ''>('');
  const [search, setSearch] = useState('');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const { data, isLoading, error } = useReports({
    page,
    status: status || undefined,
    reported_type: reportedType || undefined,
    search: search || undefined,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const resetFilters = () => {
    setStatus('');
    setReportedType('');
    setSearch('');
    setPage(1);
  };

  if (selectedReport) {
    return (
      <ReportCard
        reportId={selectedReport}
        onBack={() => setSelectedReport(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Şikayet Yönetimi
          </CardTitle>
          <CardDescription>
            Kullanıcı şikayetlerini görüntüleyin ve yönetin
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtreler */}
          <div className="flex flex-wrap gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Şikayet nedeni veya açıklama ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tüm Durumlar</SelectItem>
                <SelectItem value="pending">Bekliyor</SelectItem>
                <SelectItem value="reviewed">İncelendi</SelectItem>
                <SelectItem value="resolved">Çözüldü</SelectItem>
                <SelectItem value="dismissed">Reddedildi</SelectItem>
              </SelectContent>
            </Select>

            <Select value={reportedType} onValueChange={setReportedType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tür" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tüm Türler</SelectItem>
                <SelectItem value="news">Haber</SelectItem>
                <SelectItem value="comment">Yorum</SelectItem>
                <SelectItem value="forum_post">Forum Gönderisi</SelectItem>
                <SelectItem value="forum_topic">Forum Konusu</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={resetFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Temizle
            </Button>
          </div>

          {/* Tablo */}
          {isLoading ? (
            <div className="text-center py-8">Yükleniyor...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Şikayetler yüklenirken hata oluştu
            </div>
          ) : !data?.reports.length ? (
            <div className="text-center py-8 text-muted-foreground">
              Şikayet bulunamadı
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tür</TableHead>
                    <TableHead>Neden</TableHead>
                    <TableHead>Şikayetçi</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <Badge variant="outline">
                          {TYPE_LABELS[report.reported_type]}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {report.reason}
                      </TableCell>
                      <TableCell>
                        {report.reporter?.username || 'Bilinmeyen'}
                      </TableCell>
                      <TableCell>
                        <Badge className={STATUS_COLORS[report.status]}>
                          {STATUS_LABELS[report.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(report.created_at).toLocaleDateString('tr-TR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedReport(report.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Sayfalama */}
              {data.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Önceki
                  </Button>
                  <span className="px-4 py-2 text-sm">
                    {page} / {data.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                    disabled={page === data.totalPages}
                  >
                    Sonraki
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 