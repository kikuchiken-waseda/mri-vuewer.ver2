import GetVideoInfoInput from "@/views/example/GetVideoInfoInput/GetVideoInfoInput.vue";
import Current from "@/views/example/Current.vue";
import VideoRegister from "@/views/example/VideoRegister";
import VideoTrim from "@/views/example/VideoTrim";
import VideoCard from "@/views/example/VideoCard.vue";
import WindowCard from "@/views/example/WindowCard";

import ImageEdit from "@/views/example/ImageEdit";
import Rects from "@/views/example/rects";

const basename = "example";
const components = [
  Current,
  VideoRegister,
  VideoTrim,
  GetVideoInfoInput,
  VideoCard,
  WindowCard,
  ImageEdit,
  Rects
];
export default components.map(x => {
  return {
    path: `/${basename}/${x.name}`,
    name: `${x.name}`,
    component: x,
    develop: true
  };
});
