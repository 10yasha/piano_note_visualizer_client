import api, { handleErrorWrapper } from "../../api/api";

import { RecordingInfo, ExtraTag } from "../../types/GeneralTypes";

export const addRecording = async (newRecording: RecordingInfo) => {
  var recordingId: number;
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

  await handleErrorWrapper(async () => {
    const res = await api.post("recording", mainInfo);
    console.log("added recording:", res.data)
    recordingId = res.data.id;
  });

    // add extra tags
  newRecording.extraTags.forEach(async (extraTag) => {
    await handleErrorWrapper(async () => {
      const res = await api.post(`extra-tag/${recordingId}`,
        {
          tag: extraTag.tag,
        }
      );
      console.log("added tag:", res.data)
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

  await handleErrorWrapper(async () => {
    const res = await api.post(`recording/${updatedRecording.id}`, mainInfo);
  });
}

export const updateExtraTags = async (prevTags: ExtraTag[], curTags: ExtraTag[]) => {
  // add new tags
  curTags.forEach(async (curTag) => {
    if (!prevTags.find((prevTag) => prevTag.tag === curTag.tag)) {
      await handleErrorWrapper(async () => {
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
      await handleErrorWrapper(async () => {
        const res = await api.delete(`/extra-tag/${prevTag.id}`);
      });
    }
  });
}

export const deleteRecording = async (recordingToRemove: RecordingInfo) => {
  // remove extra tags first due to foreign key constraint
  recordingToRemove.extraTags.forEach(async (extraTag) => {
    await handleErrorWrapper(async () => {
      console.log("deleting tag:", extraTag.id, extraTag.tag);
      const res = await api.delete(`/extra-tag/${extraTag.id}`);
    });
  });

  await handleErrorWrapper(async () => {
    console.log("deleting recording:", recordingToRemove.id, recordingToRemove.name);
    const res = await api.delete(`/recording/${recordingToRemove.id}`);
  })
};