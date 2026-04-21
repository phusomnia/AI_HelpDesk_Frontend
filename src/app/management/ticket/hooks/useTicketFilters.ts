import { useState } from 'react';
import { defaultParams } from '@/constants/constant';
import type { TicketSearchParams } from '../types';

export const useTicketFilters = () => {
  const [globalParams, setGlobalParams] = useState(
    () => new URLSearchParams(window.location.search),
  );

  const [params, setParams] = useState<TicketSearchParams>({
    ...defaultParams(globalParams),
    department_name: globalParams.get('department_name') || '',
    status: globalParams.get('status') || '',
    category: globalParams.get('category') || '',
    priority: globalParams.get('priority') || '',
  });

  const updateFilter = (key: keyof TicketSearchParams, value: string) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const newParams = {
      ...params,
      page: 1,
      page_size: Number(globalParams.get('page_size')) || 10,
    };

    setParams(newParams);

    const filteredParams = new URLSearchParams();
    Object.entries(newParams).forEach(([key, val]) => {
      if (val) filteredParams.set(key, val.toString());
    });
    window.location.search = `?${filteredParams}`;
  };

  const handlePageChange = (page: number, page_size: number) => {
    const filteredParams = new URLSearchParams();
    for (let [key, value] of globalParams.entries()) {
      if (key !== 'page' && key !== 'page_size') {
        filteredParams.set(key, value);
      }
    }

    filteredParams.set('page', String(page));
    filteredParams.set('page_size', String(page_size));

    window.location.search = `?${filteredParams}`;
  };

  return {
    params,
    globalParams,
    updateFilter,
    handleSearch,
    handlePageChange,
  };
};
