import { useState } from "react";
import type { TicketSearchParams } from "../types";
import { DEFAULT_PAGE_SIZE } from "../constants/ticketConstants";

export const useTicketFilters = () => {
  const [params, setParams] = useState<TicketSearchParams>({
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
    status: "",
  });

  const updateStatus = (status: string | undefined) => {
    setParams((prev) => ({ 
      ...prev, 
      status: status || "", 
      page: 1 
    }));
  };

  const updatePagination = (page: number, page_size: number) => {
    setParams((prev) => ({ ...prev, page, page_size }));
  };

  const resetFilters = () => {
    setParams({
      page: 1,
      page_size: DEFAULT_PAGE_SIZE,
      status: "",
    });
  };

  return {
    params,
    updateStatus,
    updatePagination,
    resetFilters,
  };
};
