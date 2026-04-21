import { useState } from 'react';
import { defaultParams } from '@/constants/constant';
import type { AttachmentSearchParams } from '../types';

export const useFileFilters = () => {
  const [globalParams, setGlobalParams] = useState(
    () => new URLSearchParams(window.location.search),
  );

  const [params, setParams] = useState<AttachmentSearchParams>({
    ...defaultParams(globalParams),
  });

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
    handlePageChange,
  };
};
