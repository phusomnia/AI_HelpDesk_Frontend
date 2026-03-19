import { queryClient, useMutation, useQuery } from "@/lib/ReactQuery";
import { PUBLIC_API_BASE_URL } from "@/constants/constant";

async function fetchDeparments() {
  const response: any = await fetch(
    `${PUBLIC_API_BASE_URL}/departments`,
  );

  if (!response.ok) throw new Error("Lỗi khi tải dữ liệu chat");

  return response.json();
}

export function useDepartments() {
  return useQuery(
    {
      queryKey: ["departments"],
      queryFn: () => fetchDeparments(),
    },
    queryClient
  )
}