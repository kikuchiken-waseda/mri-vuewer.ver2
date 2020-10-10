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
db.version(5)
  .stores({
    files:
      "++id,name,source,fps,duration,originSize,videoStream,audioStream,metaData,textgrid,lastModifiedAt",
    frames: "++id, idx, time, fileId -> files.id",
    points: "++id, x, y, size, color, label, frameId -> frames.id",
    rects:
      "++id, x, y, width, height, rotation, scaleX, scaleY, size, color, label, frameId -> frames.id"
  })
  .upgrade(trans => {
    const now = Date.now();
    return trans.files.toCollection().modify(file => {
      file.lastModifiedAt = now;
    });
  });

// db.files.hook("updating", function(mods, primKey, file) {
//   const now = Date.now();
//   file.lastModifiedAt = now;
//   return file;
// });
db.open();

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

const get = async function(id) {
  const data = await db.files.get(Number(id));
  data.frames = await db.frames
    .where({ fileId: data.id })
    .with({ points: "points", rects: "rects" });
  data.bname = data.name.split(".")[0];
  return data;
};

const add_points = async function(data) {
  const items = data.map(x => {
    const p = x.data;
    const frameId = x.frameId;
    return { x: p.x, y: p.y, size: p.size, color: p.color, frameId: frameId };
  });
  await db.points.bulkPut(items);
};

const add_rects = async function(data) {
  const items = data.map(x => {
    const r = x.data;
    const frameId = x.frameId;

    return {
      x: r.x,
      y: r.y,
      width: r.width,
      height: r.height,
      rotation: r.rotation,
      scaleX: r.scaleX,
      scaleY: r.scaleY,
      size: r.size,
      color: r.color,
      frameId: frameId
    };
  });
  await db.points.bulkPut(items);
};

const add_frames = async function(fileId, obj) {
  let frames = [];
  if (obj.frames) {
    const points = [];
    const rects = [];
    let i = 0;
    for (const f of obj.frames) {
      if (f.idx && f.time) {
        if (obj.points) points.push({ data: obj.points, idx: i });
        if (obj.rects) rects.push({ data: obj.rects, idx: i });
        frames.push({ idx: f.idx, time: f.time, fileId: fileId });
        i++;
      }
    }
    if (rects.length > 0 || points.length > 0) {
      const frames = await db.frames.where({ fileId: fileId }).toArray();
      const point_datas = points.map(x => {
        return { data: x.data, frameId: frames[x.idx].id };
      });
      const rect_datas = rects.map(x => {
        return { data: x.data, frameId: frames[x.idx].id };
      });
      add_points(point_datas);
      add_rects(rect_datas);
    }
  } else {
    let step = 0;
    let currentTime = 0;
    const total = Math.floor(obj.duration * obj.fps);
    const frameRate = 1 / obj.fps;
    while (step < total) {
      step++;
      currentTime = currentTime + frameRate;
      frames.push({
        idx: step,
        time: currentTime,
        fileId: fileId
      });
    }
  }
  await db.frames.bulkPut(frames);
};

const add = async function(obj) {
  obj.lastModifiedAt = Date.now();
  let fileId;
  const keys = Object.keys(obj);
  if (obj.name && obj.source) {
    // 動画解析が必要かをチェック
    let require_ffmpeg = false;
    if (keys.indexOf("fps") === -1) require_ffmpeg = true;
    if (keys.indexOf("duration") === -1) require_ffmpeg = true;
    if (keys.indexOf("originSize") === -1) require_ffmpeg = true;
    if (keys.indexOf("videoStream") === -1) require_ffmpeg = true;
    if (keys.indexOf("audioStream") === -1) require_ffmpeg = true;
    if (require_ffmpeg) {
      const buff = io.file.toBuff(obj.source);
      io.video.info(buff, async function(res) {
        // file の作成
        const item = {
          name: obj.name,
          source: obj.source,
          metaData: obj.metaData || {},
          textgrid: obj.textgrid || {},
          fps: res.videoStream.fps,
          duration: res.duration,
          originSize: res.size,
          videoStream: res.videoStream,
          audioStream: res.audioStream
        };
        fileId = await db.files.put(item);
        add_frames(fileId, {
          frames: obj.frames,
          fps: item.fps,
          duration: item.duration
        });
      });
    } else {
      const item = {
        name: obj.name,
        source: obj.source,
        metaData: obj.metaData || {},
        textgrid: obj.textgrid || {},
        fps: obj.fps,
        duration: obj.duration,
        originSize: obj.originSize,
        videoStream: obj.videoStream,
        audioStream: obj.audioStream
      };
      fileId = await db.files.put(item);
      await add_frames(fileId, {
        frames: obj.frames,
        fps: item.fps,
        duration: item.duration
      });
    }
  }
  return fileId;
};

const destory = async function(id) {
  const frames = await db.frames.where({ fileId: id }).toArray();
  for (const f in frames) {
    const points = await db.points.where({ frameId: f.id }).toArray();
    const rects = await db.rects.where({ frameId: f.id }).toArray();
    if (points.length > 0) {
      await db.points.bulkDelete(points.map(x => x.id));
    }
    if (rects.length > 0) {
      await db.rects.bulkDelete(rects.map(x => x.id));
    }
  }
  await db.frames.bulkDelete(frames.map(f => f.id));
  await db.files.delete(id);
};

const put = async function(obj) {
  const files = await db.files.where({ name: obj.name }).toArray();
  if (files.length > 0) await destory(files[0].id);
  const id = await add(obj);
  return id;
};

const gets = async function() {
  return await db.files.toArray();
};

export default {
  files: db.files,
  frames: db.frames,
  points: db.points,
  rects: db.rects,
  dump: dump,
  load: load,
  get: get,
  gets: gets,
  destory: destory,
  put: put,
  add: add
};
