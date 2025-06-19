import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';
import { ReportForm } from '@/features/reports';
import { useAuthStore } from '@/store/auth-store';
import type { ReportedType } from '@/features/reports/types';

interface ReportButtonProps {
  reportedType: ReportedType;
  reportedId: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const ReportButton = ({ 
  reportedType, 
  reportedId, 
  variant = 'ghost', 
  size = 'sm',
  className = ''
}: ReportButtonProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={`gap-2 text-orange-600 hover:text-orange-700 ${className}`}
        >
          <AlertTriangle className="h-4 w-4" />
          Şikayet Et
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <ReportForm
          reportedType={reportedType}
          reportedId={reportedId}
          onSuccess={() => setShowDialog(false)}
          onCancel={() => setShowDialog(false)}
        />
      </DialogContent>
    </Dialog>
  );
}; 