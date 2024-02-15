import axios from "axios";

export const defaultFetcherGet = (url: string) =>
  axios.get(url).then((res) => res.data);

export const defaultFetcherPost = (url: string, data: any) =>
  axios.post(url, data).then((res) => res.data);

export const defaultFetcherPut = (url: string, data: any) =>
  axios.put(url, data).then((res) => res.data);
