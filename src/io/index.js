import video from "@/io/video.js";
import image from "@/io/image.js";
import xlsx from "@/io/xlsx.js";
import file from "@/io/file.js";
import json from "@/io/json.js";
import zip from "@/io/zip.js";
import ver1 from "@/io/ver1.js";
import ver2 from "@/io/ver2.js";
import tg from "@/io/textgrid.js";
import xy from "@/io/xy.js";

const obj = { ver1, ver2 };
const download = file.download;
export default { video, file, json, zip, obj, xlsx, image, download, tg, xy };
