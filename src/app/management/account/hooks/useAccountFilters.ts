import { useState } from 'react';
import { defaultParams } from '@/constants/constant';

export function useAccountFilters() {
  const [globalParams, setGlobalParams] = useState(() => new URLSearchParams(window.location.search));

  const [params, setParams] = useState({
    ...defaultParams(globalParams),
    role: globalParams.get('role') || '',
    department_name: globalParams.get('department_name') || '',
  });

  const handlePageChange = (page: any, page_size: any) => {
    const filteredParams = new URLSearchParams();
    for (let [key, value] of globalParams.entries()) {
      if (key !== 'page' && key !== 'page_size') {
        filteredParams.set(key, value);
      }
    }

    filteredParams.set('page', page);
    filteredParams.set('page_size', page_size);

    window.location.search = `?${filteredParams}`;
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

  return {
    params,
    setParams,
    handlePageChange,
    handleSearch,
  };
}
