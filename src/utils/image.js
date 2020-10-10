import cv from "opencv.js/opencv.js";
import io from "@/io/image";

const readBase64 = async (dataURL, size) => {
  const srcC = document.createElement("canvas");
  srcC.width = size.width;
  srcC.height = size.height;

  const img = await io.load(dataURL);
  const ctx = srcC.getContext("2d");
  ctx.drawImage(img, 0, 0, size.width, size.height);
  return cv.imread(srcC);
};

const writeBase64 = dst => {
  const canvas = document.createElement("canvas");
  cv.imshow(canvas, dst);
  return canvas.toDataURL();
};

const adaptiveThreshold = (dataURL, size) => {
  return new Promise((resolve, reject) => {
    const opt = cv.ADAPTIVE_THRESH_GAUSSIAN_C;
    const thr = cv.THRESH_BINARY;

    readBase64(dataURL, size).then(src => {
      try {
        const dst = new cv.Mat();
        cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
        cv.adaptiveThreshold(src, dst, 200, opt, thr, 3, 2);
        resolve(writeBase64(dst));
      } catch (e) {
        reject(e);
      }
    });
  });
};

const otsuThreshold = (dataURL, size) => {
  return new Promise((resolve, reject) => {
    const opt = cv.THRESH_BINARY + cv.THRESH_OTSU;
    readBase64(dataURL, size).then(src => {
      try {
        const dst = new cv.Mat();
        cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
        cv.threshold(src, dst, 0, 255, opt);
        resolve(writeBase64(dst));
      } catch (e) {
        reject(e);
      }
    });
  });
};

const bilateralFilter = (dataURL, size) => {
  return new Promise((resolve, reject) => {
    readBase64(dataURL, size).then(src => {
      try {
        const dst = new cv.Mat();
        cv.cvtColor(src, src, cv.COLOR_RGBA2RGB, 0);
        cv.bilateralFilter(src, dst, 9, 75, 75, cv.BORDER_DEFAULT);
        resolve(writeBase64(dst));
      } catch (e) {
        reject(e);
      }
    });
  });
};

const laplacianFilter = (dataURL, size) => {
  return new Promise((resolve, reject) => {
    readBase64(dataURL, size).then(src => {
      try {
        const dst = new cv.Mat();
        cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
        cv.Laplacian(src, dst, cv.CV_8U, 1, 1, 0, cv.BORDER_DEFAULT);
        resolve(writeBase64(dst));
      } catch (e) {
        reject(e);
      }
    });
  });
};

const canny = (dataURL, size) => {
  return new Promise((resolve, reject) => {
    readBase64(dataURL, size).then(src => {
      try {
        const dst = new cv.Mat();
        cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
        cv.Canny(src, dst, 50, 100, 3, false);
        resolve(writeBase64(dst));
      } catch (e) {
        reject(e);
      }
    });
  });
};

// 指定された矩形範囲内で前景を抽出
const grabCut = (dataURL, size) => {
  return new Promise((resolve, reject) => {
    readBase64(dataURL, size).then(src => {
      try {
        let mask = new cv.Mat();
        let bgdModel = new cv.Mat();
        let fgdModel = new cv.Mat();
        let rect = new cv.Rect(0, 50, 250, 150);
        cv.cvtColor(src, src, cv.COLOR_RGBA2RGB, 0);
        cv.grabCut(
          src,
          mask,
          rect,
          bgdModel,
          fgdModel,
          1,
          cv.GC_INIT_WITH_RECT
        );

        for (let i = 0; i < src.rows; i++) {
          for (let j = 0; j < src.cols; j++) {
            if (mask.ucharPtr(i, j)[0] == 0 || mask.ucharPtr(i, j)[0] == 2) {
              src.ucharPtr(i, j)[0] = 0;
              src.ucharPtr(i, j)[1] = 0;
              src.ucharPtr(i, j)[2] = 0;
            }
          }
        }
        let color = new cv.Scalar(0, 0, 255);
        let point1 = new cv.Point(rect.x, rect.y);
        let point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
        cv.rectangle(src, point1, point2, color);
        resolve(writeBase64(src));
      } catch (e) {
        reject(e);
      }
    });
  });
};
export default {
  grabCut,
  bilateralFilter,
  laplacianFilter,
  adaptiveThreshold,
  otsuThreshold,
  canny
};
