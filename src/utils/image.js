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

const findContours = (dataURL, size) => {
  return new Promise((resolve, reject) => {
    readBase64(dataURL, size).then(src => {
      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();
      let hull = new cv.Mat();
      let defect = new cv.Mat();
      try {
        cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
        cv.findContours(
          src,
          contours,
          hierarchy,
          cv.RETR_CCOMP,
          cv.CHAIN_APPROX_SIMPLE
        );
        const results = [];
        for (let i = 0; i < contours.size(); i++) {
          const cnt = contours.get(i);
          const area = cv.contourArea(cnt, false);
          if (area > 30000 && area < 50000) {
            cv.convexHull(cnt, hull, false, false);
            cv.convexityDefects(cnt, hull, defect);
            const item = {
              id: i,
              area: area,
              lines: [],
              fars: []
            };
            for (let ii = 0; ii < defect.rows; ++ii) {
              item.lines.push({
                start: {
                  x: cnt.data32S[defect.data32S[ii * 4] * 2],
                  y: cnt.data32S[defect.data32S[ii * 4] * 2 + 1]
                },
                end: {
                  x: cnt.data32S[defect.data32S[ii * 4 + 1] * 2],
                  y: cnt.data32S[defect.data32S[ii * 4 + 1] * 2 + 1]
                }
              });
              item.fars.push({
                x: cnt.data32S[defect.data32S[ii * 4 + 2] * 2],
                y: cnt.data32S[defect.data32S[ii * 4 + 2] * 2 + 1]
              });
            }
            results.push(item);
          }
        }
        resolve(results);
      } catch (e) {
        reject(e);
      } finally {
        contours.delete();
        hierarchy.delete();
        hull.delete();
        defect.delete();
      }
    });
  });
};

const convexDefects = (dataURL, size) => {
  return new Promise((resolve, reject) => {
    const opt = cv.THRESH_BINARY + cv.THRESH_OTSU;
    readBase64(dataURL, size).then(src => {
      let dst = new cv.Mat();
      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();
      let hull = new cv.Mat();
      let defect = new cv.Mat();
      try {
        cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
        cv.threshold(src, dst, 0, 255, opt);
        cv.findContours(
          dst,
          contours,
          hierarchy,
          cv.RETR_CCOMP,
          cv.CHAIN_APPROX_SIMPLE
        );
        const results = [];
        for (let i = 0; i < contours.size(); i++) {
          const cnt = contours.get(i);
          const area = cv.contourArea(cnt, false);
          if (area > 30000 && area < 50000) {
            cv.convexHull(cnt, hull, false, false);
            cv.convexityDefects(cnt, hull, defect);
            const item = {
              id: i,
              area: area,
              concavos: [],
              convexes: []
            };
            for (let ii = 0; ii < defect.rows; ++ii) {
              item.convexes.push({
                x: cnt.data32S[defect.data32S[ii * 4] * 2],
                y: cnt.data32S[defect.data32S[ii * 4] * 2 + 1]
              });
              item.convexes.push({
                x: cnt.data32S[defect.data32S[ii * 4 + 1] * 2],
                y: cnt.data32S[defect.data32S[ii * 4 + 1] * 2 + 1]
              });
              item.concavos.push({
                x: cnt.data32S[defect.data32S[ii * 4 + 2] * 2],
                y: cnt.data32S[defect.data32S[ii * 4 + 2] * 2 + 1]
              });
            }
            results.push(item);
          }
        }
        resolve(results);
      } catch (e) {
        reject(e);
      } finally {
        src.delete();
        dst.delete();
        contours.delete();
        hierarchy.delete();
        hull.delete();
        defect.delete();
      }
    });
  });
};

const adaptiveThreshold = (dataURL, size) => {
  return new Promise((resolve, reject) => {
    const opt = cv.ADAPTIVE_THRESH_GAUSSIAN_C;
    const thr = cv.THRESH_BINARY;

    readBase64(dataURL, size).then(src => {
      const dst = new cv.Mat();
      try {
        cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
        cv.adaptiveThreshold(src, dst, 200, opt, thr, 3, 2);
        resolve(writeBase64(dst));
      } catch (e) {
        reject(e);
      } finally {
        src.delete();
        dst.delete();
      }
    });
  });
};

const otsuThreshold = (dataURL, size) => {
  return new Promise((resolve, reject) => {
    const opt = cv.THRESH_BINARY + cv.THRESH_OTSU;
    readBase64(dataURL, size).then(src => {
      const dst = new cv.Mat();
      try {
        cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
        cv.threshold(src, dst, 0, 255, opt);
        resolve(writeBase64(dst));
      } catch (e) {
        reject(e);
      } finally {
        src.delete();
        dst.delete();
      }
    });
  });
};

const bilateralFilter = (dataURL, size) => {
  return new Promise((resolve, reject) => {
    readBase64(dataURL, size).then(src => {
      const dst = new cv.Mat();
      try {
        cv.cvtColor(src, src, cv.COLOR_RGBA2RGB, 0);
        cv.bilateralFilter(src, dst, 9, 75, 75, cv.BORDER_DEFAULT);
        resolve(writeBase64(dst));
      } catch (e) {
        reject(e);
      } finally {
        src.delete();
        dst.delete();
      }
    });
  });
};

const laplacianFilter = (dataURL, size) => {
  return new Promise((resolve, reject) => {
    readBase64(dataURL, size).then(src => {
      const dst = new cv.Mat();
      try {
        cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
        cv.Laplacian(src, dst, cv.CV_8U, 1, 1, 0, cv.BORDER_DEFAULT);
        resolve(writeBase64(dst));
      } catch (e) {
        reject(e);
      } finally {
        src.delete();
        dst.delete();
      }
    });
  });
};

const canny = (dataURL, size) => {
  return new Promise((resolve, reject) => {
    readBase64(dataURL, size).then(src => {
      const dst = new cv.Mat();
      try {
        cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
        cv.Canny(src, dst, 50, 100, 3, false);
        resolve(writeBase64(dst));
      } catch (e) {
        reject(e);
      } finally {
        src.delete();
        dst.delete();
      }
    });
  });
};

// 指定された矩形範囲内で前景を抽出
const grabCut = (dataURL, size) => {
  return new Promise((resolve, reject) => {
    readBase64(dataURL, size).then(src => {
      let mask = new cv.Mat();
      let bgdModel = new cv.Mat();
      let fgdModel = new cv.Mat();

      try {
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
      } finally {
        src.delete();
        mask.delete();
        bgdModel.delete();
        fgdModel.delete();
      }
    });
  });
};
export default {
  findContours,
  convexDefects,
  grabCut,
  bilateralFilter,
  laplacianFilter,
  adaptiveThreshold,
  otsuThreshold,
  canny
};
