import { queryClient, QueryClientProvider } from '@/lib/ReactQuery';

export function QueryProvider({ children }: any) {
  return (
    <>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </>
  );
}