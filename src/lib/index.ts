import axios, { AxiosError } from 'axios';
import useSWR from 'swr';

export function shallowEqualArrays(arrA: any[], arrB: any[]): boolean {
  if (arrA === arrB) {
    return true;
  }

  if (!arrA || !arrB) {
    return false;
  }

  const len = arrA.length;

  if (arrB.length !== len) {
    return false;
  }

  for (let i = 0; i < len; i++) {
    if (arrA[i] !== arrB[i]) {
      return false;
    }
  }

  return true;
}

type RepositoryResponse = {
  repository: string;
}[];

export function useRepositoryOptions(user: string) {
  const defaultOptions = [{ label: 'No Items', value: '' }];
  const { data, error, isLoading } = useSWR<
    { label: string; value: string }[],
    AxiosError
  >(
    ['/api/repository', user],
    async ([url, user]) => {
      if (!user) {
        return defaultOptions;
      }
      const res = await axios.get<RepositoryResponse>(`${url}?user=${user}`);
      if (res.status !== 200) {
        return defaultOptions;
      }
      const data = res.data;
      if (data.length === 0) {
        return defaultOptions;
      }
      return data.map((d) => ({ label: d.repository, value: d.repository }));
    },
    { keepPreviousData: true }
  );

  return { options: data ? data : defaultOptions, error, isLoading };
}

type FileResponse = {
  filepath: string;
}[];

export function useFileOptions(repository: string) {
  const defaultOptions = [{ label: 'No Items', value: '' }];
  const { data, error, isLoading } = useSWR(
    ['/api/file', repository],
    async ([url, repository]) => {
      if (!repository) {
        return defaultOptions;
      }
      const res = await axios.get<FileResponse>(
        `${url}?repository=${repository}`
      );
      if (res.status !== 200) {
        return defaultOptions;
      }
      const data = res.data;
      if (data.length === 0) {
        return defaultOptions;
      }
      return data.map((d) => ({ label: d.filepath, value: d.filepath }));
    },
    { keepPreviousData: true }
  );

  return { options: data ? data : defaultOptions, error, isLoading };
}
