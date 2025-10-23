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

  const { data: requests, isLoading } = useQuery<AccessRequest[]>({
    queryKey: ['/api/access-requests'],
  });

  const approveMutation = useMutation({
    mutationFn: async (requestId: string) => {
      return await apiRequest('/api/approve-access', {
        method: 'POST',
        body: JSON.stringify({ requestId }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/access-requests'] });
      toast({
        title: 'Access Approved!',
        description: 'User has been sent their unique password via email',
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
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Clock className="w-6 h-6 text-orange-500" />
              Pending Requests
            </h2>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{request.email}</CardTitle>
                      <CardDescription>
                        Requested {new Date(request.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => approveMutation.mutate(request.id)}
                      disabled={approveMutation.isPending}
                      data-testid={`button-approve-${request.id}`}
                    >
                      {approveMutation.isPending ? 'Approving...' : 'Approve'}
                    </Button>
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
