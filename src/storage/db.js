import Dexie from "dexie";
import relationships from "dexie-relationships";
import io from "@/io";
const db = new Dexie("mri_vuewer", { addons: [relationships] });
db.version(1).stores({
  files:
    "++id,name,source,fps,duration,originSize,videoStream,audioStream,meta,frames,textgrid"
});
db.version(2).stores({
  files:
    "++id,name,source,fps,duration,originSize,videoStream,audioStream,metaData,frames,textgrid"
});
db.version(3).stores({
  files:
    "++id,name,source,fps,duration,originSize,videoStream,audioStream,metaData,textgrid",
  frames: "++id, idx, time, fileId -> files.id",
  points: "++id, x, y, size, color, frameId -> frames.id",
  rects:
    "++id, x, y, width, height, rotation, scaleX, scaleY, size, color, frameId -> frames.id"
});
db.version(4).stores({
  files:
    "++id,name,source,fps,duration,originSize,videoStream,audioStream,metaData,textgrid",
  frames: "++id, idx, time, fileId -> files.id",
  points: "++id, x, y, size, color, label, frameId -> frames.id",
  rects:
    "++id, x, y, width, height, rotation, scaleX, scaleY, size, color, label, frameId -> frames.id"
});

const dump = function() {
  return new Promise((resolve, reject) => {
    db.files
      .toArray()
      .then(items => {
        const json = JSON.stringify(items);
        const blob = new Blob([json], { type: "application/json" });
        io.file.download(blob, "corpora.json");
        resolve(true);
      })
      .catch(error => reject(error));
  });
};

const load = function(json) {
  return new Promise((resolve, reject) => {
    try {
      const obj = JSON.parse(json);
      db.files
        .clear()
        .then(() => {
          db.files
            .bulkPut(obj)
            .then(() => {
              db.files
                .toArray()
                .then(items => {
                  resolve(items);
                })
                .catch(error => reject(error));
            })
            .catch(error => reject(error));
        })
        .catch(error => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  files: db.files,
  frames: db.frames,
  points: db.points,
  rects: db.rects,
  dump: dump,
  load: load
};
