const toPng = (src, size, time) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.id = "tmp-video";
    video.onloadeddata = () => (video.currentTime = time);
    video.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        const { width, height } = size;
        canvas.id = "tmp-canvas";
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(video, 0, 0, width, height);
        const result = canvas.toDataURL("image/png");
        resolve(result);
        video.remove();
        canvas.remove();
      } catch (e) {
        reject(e);
      }
    };
    video.src = src;
  });
};

export default {
  toPng
};
