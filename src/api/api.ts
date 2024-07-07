import axios, { AxiosError } from 'axios';

export default axios.create({
  baseURL: 'http://localhost:5128/api',
});

export const handleErrorWrapper = (apiCall: () => void) => {
  try {
    apiCall();
  } catch (e: unknown) {
    const err = e as AxiosError;
    if (err.response) {
      console.error(err.response.data);
      console.error(err.response.status);
      console.error(err.response.headers);
    } else {
      console.error(`Error: ${err.message}`);
    }
  }
};
