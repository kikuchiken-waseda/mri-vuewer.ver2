import cv from "opencv.js/opencv.js";

const adaptiveThreshold = (dataURL, size) => {
  return new Promise((resolve, reject) => {
    const srcC = document.createElement("canvas");
    srcC.width = size.width;
    srcC.height = size.height;
    const ctx = srcC.getContext("2d");
    const img = new Image();
    img.src = dataURL;
    img.onload = function() {
      ctx.drawImage(img, 0, 0, size.width, size.height);
      try {
        const src = cv.imread(srcC);
        const dst = new cv.Mat();
        cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
        cv.adaptiveThreshold(
          src,
          dst,
          200,
          cv.ADAPTIVE_THRESH_GAUSSIAN_C,
          cv.THRESH_BINARY,
          3,
          2
        );
        const out = document.createElement("canvas");
        cv.imshow(out, dst);
        resolve(out.toDataURL());
      } catch (e) {
        reject(e);
      }
    };
  });
};

export default {
  adaptiveThreshold: adaptiveThreshold
};
