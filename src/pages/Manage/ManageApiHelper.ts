import api, { handleErrorWrapper } from "../../api/api";

import { RecordingInfo, extraTag } from "../../types/GeneralTypes";

export const addRecording = async (newRecording: RecordingInfo) => {
  var recordingId : number;

  // add main info
  const mainInfo = {
    url: newRecording.url,
    name: newRecording.name,
    enName: newRecording.enName,
    jpName: newRecording.jpName,
    jpHiraganaName: newRecording.jpHiraganaName,
    type: newRecording.type,
    mainTag: newRecording.mainTag,
  };

  handleErrorWrapper(async () => {
    console.log("here")
    const res = await api.post("recording", mainInfo);
    recordingId = res.data.id;
  })

  // add extra tags
  newRecording.extraTags.forEach(async (extraTag) => {
      handleErrorWrapper(async () => {
      const res = await api.post(`extra-tag/${recordingId}`,
        {
          tag: extraTag.tag,
        }
      );
    });
  });
};

export const updateMainRecordingInfo = async (updatedRecording: RecordingInfo) => {
  const mainInfo = {
    url: updatedRecording.url,
    name: updatedRecording.name,
    enName: updatedRecording.enName,
    jpName: updatedRecording.jpName,
    jpHiraganaName: updatedRecording.jpHiraganaName,
    type: updatedRecording,
    mainTag: updatedRecording.mainTag,
  };

  handleErrorWrapper(async () => {
    const res = await api.post(`recording/${updatedRecording.id}`, mainInfo);
  });
}

export const updateExtraTags = async (prevTags: extraTag[], curTags: extraTag[]) => {
  // add new tags
  curTags.forEach(async (curTag) => {
    if (!prevTags.find((prevTag) => prevTag.tag === curTag.tag)) {
      handleErrorWrapper(async () => {
        const res = await api.post(
          `/extra-tag/${curTag.recordingId}`,
          {
            tag: curTag.tag,
          }
        );
      });
    }
  });

  // delete removed tags
  prevTags.forEach(async (prevTag) => {
    if (!curTags.find((curTag) => curTag.tag === prevTag.tag)) {
      handleErrorWrapper(async () => {
        const res = await api.delete(`/extra-tag/${prevTag.id}`);
      });
    }
  });
}

export const deleteRecording = async (recordingToRemove: RecordingInfo) => {
  handleErrorWrapper(async () => {
    const res = await api.delete(`/recording/${recordingToRemove.id}`);
  })

  // add extra tags
  recordingToRemove.extraTags.forEach(async (extraTag) => {
      handleErrorWrapper(async () => {
      const res = await api.delete(`/extra-tag/${extraTag.id}`);
    });
  });
};