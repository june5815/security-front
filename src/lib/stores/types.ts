import { type PaginationParams } from '@/lib/types';

export interface BaseStore<T, P> {
  data: T | null;
  update: (newData: Partial<T>) => void;

  params: P;
  updateParams: (newParams: Partial<P>, options?: Partial<{ignoreFetch: boolean}>) => void;

  fetch: (options?: {
    throwError?: boolean;
    ignoreLoading?: boolean;
  }) => Promise<void>;
  clearData: () => void;

  loading: boolean;

  error?: string;
  clearError: () => void;

  clear: () => void;
}



export interface ListStore<T, P> {
  data: T[];
  add: (item: T) => void;
  update: (id: string, newData: Partial<T>) => void;
  delete: (id: string) => void;
  count: () => number;

  params: P;
  updateParams: (newParams: Partial<P>, options?: Partial<{ignoreFetch: boolean}>) => void;

  fetch: (options?: {
    throwError?: boolean;
    ignoreLoading?: boolean;
  }) => Promise<void>;
  clearData: () => void;

  loading: boolean;

  error?: string;
  clearError: () => void;

  clear: () => void;
}

export interface PaginatedStore<T, P extends PaginationParams> {
  data: T[];
  add: (item: T) => void;
  update: (id: string, newData: Partial<T>) => void;
  delete: (id: string) => void;
  count: () => number;

  params: P;
  updateParams: (newParams: Partial<P>, options?: Partial<{ignoreFetch: boolean}>) => void;

  paginationState: PaginationState;
  hasNext: () => boolean;

  fetch: (options?: {
    throwError?: boolean;
    ignoreLoading?: boolean;
  }) => Promise<void>;
  fetchMore: (options?: {
    throwError?: boolean;
    ignoreLoading?: boolean;
  }) => Promise<void>;
  clearData: () => void;

  loading: boolean;

  error?: string;
  clearError: () => void;

  clear: () => void;
}

export interface PaginationState {
  nextPage: number;
  hasNext: boolean;
  totalCount: number;
}