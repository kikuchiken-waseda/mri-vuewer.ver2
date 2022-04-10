import ffmpeg from "ffmpeg.js/ffmpeg-mp4.js";

const version = callback => {
  let stdout = "";
  let stderr = "";
  const result = ffmpeg({
    arguments: ["-version"],
    print: function(data) {
      stdout += data + "\n";
    },
    printErr: function(data) {
      stderr += data + "\n";
    },
    onExit: function(code) {
      if (code == 0) {
        callback(code, stdout);
      } else {
        throw new Error(stderr);
      }
    }
  });
  return result;
};

const initVideoObject = () => {
  return {
    name: null,
    source: null,
    fps: null,
    duration: null,
    videoStream: {
      codec_name: null,
      pix_fmt: null,
      bitrate: null,
      fps: null,
      tbr: null,
      tbn: null,
      tbc: null
    },
    audioStream: {
      codec_name: null,
      sample_rate: null,
      channel_layout: null,
      sample_fmt: null,
      bitrate: null
    },
    originSize: {
      width: null,
      height: null
    },
    errors: {
      fps: null,
      duration: null,
      videoStream: null,
      audioStream: null,
      originSize: {
        width: null,
        height: null
      }
    }
  };
};

const info = (buff, callback) => {
  const video = new Uint8Array(buff);
  let stdout = "";
  const result = ffmpeg({
    MEMFS: [{ name: "data.mp4", data: video }],
    arguments: ["-i", "data.mp4"],
    print: function(data) {
      stdout += data + "\n";
    },
    printErr: function(data) {
      stdout += data + "\n";
    },
    onExit: function() {
      let item = initVideoObject();
      if (stdout) {
        for (const line of stdout.split("\n")) {
          try {
            if (~line.indexOf("Duration")) {
              const timeInfo = line
                .split(",")[0]
                .split(": ")[1]
                .split(":")
                .map(val => {
                  return Number(val);
                });
              item.duration =
                timeInfo[0] * 60 * 60 + timeInfo[1] * 60 + timeInfo[2];
            }
          } catch {
            item.errors.duration = "$vuetify.io.video.error.duration";
          }
          if (~line.indexOf("Stream")) {
            const info = line.split(": ");
            if (info.length == 3) {
              const detail = info[2].split(", ");
              if (info[1] == "Video") {
                try {
                  const sizeText = detail.filter(x =>
                    x.match(/^([1-9]\d*|0)(\.\d+)?x([1-9]\d*|0)(\.\d+)?/)
                  )[0];
                  if (sizeText) {
                    const size = sizeText.split(" ")[0].split("x");
                    item.originSize = {
                      width: Number(size[0]),
                      height: Number(size[1])
                    };
                  }
                } catch {
                  this.video.errors.originSize.width =
                    "$vuetify.io.video.error.originSize.width";
                  this.video.errors.originSize.height =
                    "$vuetify.io.video.error.originSize.height";
                }

                item.videoStream.codec_name = detail[0];
                item.videoStream.pix_fmt = detail[1];
                try {
                  item.videoStream.bitrate = Number(
                    detail.filter(x => x.match(/kb\/s/))[0].split(" ")[0]
                  );
                } catch {
                  item.videoStream.bitrate = null;
                }
                try {
                  item.videoStream.fps = Number(
                    detail.filter(x => x.match(/fps/))[0].split(" ")[0]
                  );
                } catch {
                  item.videoStream.fps = null;
                  item.errors.fps = "$vuetify.io.video.error.fps";
                }
                try {
                  item.videoStream.tbr = Number(
                    detail.filter(x => x.match(/tbr/))[0].split(" ")[0]
                  );
                } catch {
                  item.videoStream.tbr = null;
                }

                try {
                  item.videoStream.tbn = Number(
                    detail.filter(x => x.match(/tbn/))[0].split(" ")[0]
                  );
                } catch {
                  item.videoStream.tbn = null;
                }
                try {
                  item.videoStream.tbc = Number(
                    detail.filter(x => x.match(/tbc/))[0].split(" ")[0]
                  );
                } catch {
                  item.videoStream.tbc = null;
                }
              } else {
                item.audioStream.codec_name = detail[0];
                try {
                  item.audioStream.sample_rate = Number(
                    detail[1].split(" ")[0]
                  );
                } catch {
                  item.audioStream.sample_rate = null;
                }
                item.audioStream.channel_layout = detail[2];
                item.audioStream.sample_fmt = detail[3];
                try {
                  item.audioStream.bitrate = Number(detail[4].split(" ")[0]);
                } catch {
                  item.audioStream.bitrate = null;
                }
              }
            }
          }
        }
        callback(item);
      }
    }
  });
  return result;
};

const toMp4 = buff => {
  const video = new Uint8Array(buff);
  const args = `-i data.avi -vcodec libx264 -pix_fmt yuv420p output.mp4 -c:a libfdk_aac -threads 4 -loglevel error`;
  const result = ffmpeg({
    MEMFS: [{ name: "data.avi", data: video }],
    arguments: args.split(" "),
    print: () => {},
    printErr: error => console.error(error)
  });
  return result;
};

// 全てのフレームを個別の png として分割します.
const toPng = (buff, frame, fps, duration, crop = null) => {
  const video = new Uint8Array(buff);
  const lank = String(Math.round(duration * fps)).length;
  let args;
  const farg = `-vf trim=start_frame=${frame - 1}:end_frame=${frame}`;
  if (crop) {
    const { x, y, w, h } = crop;
    args = `-i data.mp4 ${farg},crop=${w}:${h}:${x}:${y} -vsync 0 %0${lank}d.png -loglevel error`;
  } else {
    args = `-i data.mp4 ${farg} %0${lank}d.png -vsync 0 -loglevel error`;
  }
  const result = ffmpeg({
    MEMFS: [{ name: "data.mp4", data: video }],
    arguments: args.split(" "),
    print: () => {},
    printErr: error => console.error(error)
  });
  return result;
};

// 全てのフレームを個別の png として分割します.
const toPngs = (buff, fps, duration, crop = null) => {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      const video = new Uint8Array(buff);
      const lank = String(Math.round(duration * fps)).length;
      let args;
      if (crop) {
        const { x, y, w, h } = crop;
        args = `-i data.mp4 -vf crop=${w}:${h}:${x}:${y} %0${lank}d.png -loglevel error`;
      } else {
        args = `-i data.mp4 %0${lank}d.png -loglevel error`;
      }
      const result = ffmpeg({
        MEMFS: [{ name: "data.mp4", data: video }],
        arguments: args.split(" "),
        print: () => {},
        printErr: error => reject(error)
      });
      resolve(result);
    });
  });
};

const toWav = buff => {
  return new Promise((resolve, reject) => {
    const video = new Uint8Array(buff);
    const args =
      "-i data.mp4 -vn -ac 2 -ar 48000 -acodec pcm_s16le -f wav output.wav -loglevel error";
    const result = ffmpeg({
      MEMFS: [{ name: "data.mp4", data: video }],
      arguments: args.split(" "),
      print: () => {},
      printErr: error => reject(error)
    });
    resolve(result);
  });
};

const bandpass = (buff, low, high) => {
  const video = new Uint8Array(buff);
  const args = `-i data.mp4 -af lowpass=${low},highpass=${high} out.mp4 -loglevel error`;
  const result = ffmpeg({
    MEMFS: [{ name: "data.mp4", data: video }],
    arguments: args.split(" "),
    print: () => {},
    printErr: error => console.error(error)
  });
  return result;
};

const anlmdn = buff => {
  const video = new Uint8Array(buff);
  const args = `-i data.mp4 -af anlmdn out.mp4 -loglevel error`;
  const result = ffmpeg({
    MEMFS: [{ name: "data.mp4", data: video }],
    arguments: args.split(" "),
    print: () => {},
    printErr: error => console.error(error)
  });
  return result;
};

const afftdn = buff => {
  const video = new Uint8Array(buff);
  const args = `-i data.mp4 -af afftdn out.mp4 -loglevel error`;
  const result = ffmpeg({
    MEMFS: [{ name: "data.mp4", data: video }],
    arguments: args.split(" "),
    print: () => {},
    printErr: error => console.error(error)
  });
  return result;
};

const trim = (buff, start, end) => {
  const video = new Uint8Array(buff);
  const duration = end - start;
  const result = ffmpeg({
    MEMFS: [{ name: "data.mp4", data: video }],
    arguments: [
      "-ss",
      String(start),
      "-i",
      "data.mp4",
      "-t",
      String(duration),
      "-c",
      "copy",
      "output.mp4"
    ],
    print: function() {},
    printErr: function() {}
  });
  return result;
};

const trimPng = (buff, start, end) => {
  const video = new Uint8Array(buff);
  const duration = end - start;
  const result = ffmpeg({
    MEMFS: [{ name: "data.mp4", data: video }],
    arguments: [
      "-ss",
      String(start),
      "-i",
      "data.mp4",
      "-t",
      String(duration),
      "-vcodec",
      "png",
      "img_%03d.png"
    ],
    print: function() {},
    printErr: function() {}
  });
  return result;
};

const concat = buffs => {
  const datas = buffs.map((x, i) => {
    const video = new Uint8Array(x);
    return { name: `v${i}.mp4`, data: video };
  });
  const args = datas.map(x => x.name).join("|");
  const result = ffmpeg({
    MEMFS: datas,
    arguments: `-i "concat:${args}" -codec copy output.mp4`.split(" "),
    print: function(data) {
      console.log(data);
    },
    printErr: function(data) {
      console.log(data);
    }
  });
  return result;
};

const toBlob = buff => {
  return new Blob([buff], {
    type: "video/mp4"
  });
};

const toBase64 = blob => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise(resolve => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};

export default {
  version,
  info,
  bandpass,
  anlmdn,
  afftdn,
  trim,
  trimPng,
  concat,
  toWav,
  toMp4,
  toPngs,
  toPng,
  toBlob,
  toBase64,
  initObj: initVideoObject
};
