import axios, { AxiosError } from 'axios';

export default axios.create({
  baseURL: 'http://localhost:5128/api',
});

export const handleErrorWrapper = async (apiCall: () => Promise<void>) => {
  try {
    await apiCall();
  } catch (e: unknown) {
    const err = e as AxiosError;
    if (err.response) {
      console.error(err.response.headers);
      console.error(err.response.status);
      console.error(err.response.data);
    } else {
      console.error(`Error: ${err.message}`);
    }
  }
};
