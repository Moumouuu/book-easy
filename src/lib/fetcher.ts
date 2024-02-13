import axios from "axios";

export const defaultFetcherGet = (url: string) =>
  axios.get(url).then((res) => res.data);

export const defaultFetcherPost = (url: string) =>
  axios.post(url).then((res) => res.data);
