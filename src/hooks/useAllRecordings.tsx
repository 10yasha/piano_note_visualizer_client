import { useState } from "react";
import { RecordingInfo } from "../types/GeneralTypes";
import api, { handleErrorWrapper } from "../api/api";

export const useAllRecordings = () => {
  const [records, setRecords] = useState<RecordingInfo[]>([]);

  const fetchRecordings = async () => {
    await handleErrorWrapper(async () => {
      const res = await api.get("/recording");
      setRecords(res.data as RecordingInfo[]);
    });
  };

  return { records, fetchRecordings };
};
