import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { RecordingInfo } from '../types/GeneralTypes';
import api from "../api/api";

export const useAllRecordings = () => {
  const [records, setRecords] = useState<RecordingInfo[]>([]);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const res = await api.get("/recording");
        setRecords(res.data);
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

    fetchRecordings();
  }, []);

  return records;
};
