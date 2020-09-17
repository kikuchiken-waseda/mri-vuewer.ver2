import video from "@/io/video.js";
import xlsx from "@/io/xlsx.js";
import file from "@/io/file.js";
import json from "@/io/json.js";
import ver1 from "@/io/ver1.js";
import ver2 from "@/io/ver2.js";

export default {
  video: video,
  file: file,
  json: json,
  obj: {
    ver1: ver1,
    ver2: ver2
  },
  xlsx: xlsx,
  download: file.download
};
