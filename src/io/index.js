import video from "@/io/video.js";
import xlsx from "@/io/xlsx.js";
import file from "@/io/file.js";
import json from "@/io/json.js";

export default {
  video: video,
  file: file,
  json: json,
  xlsx: xlsx,
  download: file.download
};
