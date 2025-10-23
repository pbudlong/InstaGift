import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, Mail, Clock } from 'lucide-react';
import type { AccessRequest } from '@shared/schema';

export default function Requests() {
  const { toast } = useToast();
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(new Set());

  const { data: requests, isLoading } = useQuery<AccessRequest[]>({
    queryKey: ['/api/access-requests'],
  });

  const approveMutation = useMutation({
    mutationFn: async (requestId: string) => {
      return await apiRequest('POST', '/api/approve-access', { requestId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/access-requests'] });
      setSelectedRequests(new Set());
      toast({
        title: 'Access Approved!',
        description: 'Users have been sent their unique passwords via email (BCC to you)',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Approval Failed',
        description: error.message || 'Failed to approve access request',
        variant: 'destructive',
      });
    },
  });

  const handleApproveSelected = async () => {
    const requestIds = Array.from(selectedRequests);
    if (requestIds.length === 0) return;

    for (const requestId of requestIds) {
      await approveMutation.mutateAsync(requestId);
    }
  };

  const toggleRequest = (requestId: string) => {
    const newSelected = new Set(selectedRequests);
    if (newSelected.has(requestId)) {
      newSelected.delete(requestId);
    } else {
      newSelected.add(requestId);
    }
    setSelectedRequests(newSelected);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading requests...</p>
      </div>
    );
  }

  const pendingRequests = requests?.filter(r => !r.approved) || [];
  const approvedRequests = requests?.filter(r => r.approved) || [];

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-display font-bold">Access Requests</h1>
          <p className="text-muted-foreground">
            Approve requests to grant users access with unique passwords
          </p>
        </div>

        {pendingRequests.length === 0 && approvedRequests.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Mail className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No access requests yet</p>
            </CardContent>
          </Card>
        )}

        {pendingRequests.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Clock className="w-6 h-6 text-orange-500" />
                Pending Requests
              </h2>
              <Button
                onClick={handleApproveSelected}
                disabled={selectedRequests.size === 0 || approveMutation.isPending}
                data-testid="button-approve-selected"
              >
                {approveMutation.isPending 
                  ? 'Approving...' 
                  : `Approve Selected (${selectedRequests.size})`}
              </Button>
            </div>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <Checkbox
                        checked={selectedRequests.has(request.id)}
                        onCheckedChange={() => toggleRequest(request.id)}
                        data-testid={`checkbox-${request.id}`}
                      />
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg">{request.email}</CardTitle>
                        <CardDescription>
                          Requested {new Date(request.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {approvedRequests.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              Approved Requests
            </h2>
            <div className="space-y-3">
              {approvedRequests.map((request) => (
                <Card key={request.id} className="border-green-200 dark:border-green-900">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{request.email}</CardTitle>
                        <CardDescription>
                          Password: <span className="font-mono font-semibold text-foreground">{request.password}</span>
                        </CardDescription>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
