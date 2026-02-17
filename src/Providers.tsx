//CONTEXT PROVIDERS
import { AuthProvider } from './context/AuthContext';
import { ProspectsProvider } from './context/ProspectsContext';
import { SubscriptionAlertProvider } from './context/SubscriptionAlertContext';
import { ToastProvider } from './context/ToastContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface Props {
    children: React.ReactNode;
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 2,
            gcTime: 1000 * 60 * 5
        }
    }
});

export default function Providers({ children }: Props) {
    return (
      <QueryClientProvider client={queryClient}>
          <ToastProvider>
              <AuthProvider>
                  <ProspectsProvider>
                    <SubscriptionAlertProvider>
                        {children}
                    </SubscriptionAlertProvider>
                  </ProspectsProvider>
              </AuthProvider>
          </ToastProvider>
      </QueryClientProvider>
    );
}
