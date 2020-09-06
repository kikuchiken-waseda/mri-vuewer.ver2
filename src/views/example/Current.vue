<template>
  <m-view-layout :heading="heading" :desc="desc">
    <v-card>
      <v-card-title>
        MRI-VUEWER で使用するファイルオブジェクト
      </v-card-title>
      <v-divider />
      <pre>
        {
          name: String,   // ファイル名
          source: String, // Base64 形式で文字列化された動画ファイル
          fps: Number,    // 動画ファイルの FPS
          duration: Number, // 動画ファイルの長さ

          // 動画サイズ
          originSize: {
            width: Number,
            height: Number
          },

          // 動画コーディック
          videoStream: {
            codec_name: String // h264 (High) (avc1 / 0x31637661)
            pix_fmt: String    // yuv420p
            bitrate: Number    // 265
            fps: Number        // 13.79
            tbr: Number        // 13.79
            tbn: Number        // 13792
            tbc: Number        // 27.58
          },

          // 音声コーディック
          audioStream: {
            codec_name: String     // aac (LC) (mp4a / 0x6134706D)
            sample_rate: Number    // 44100
            channel_layout: String // mono
            sample_fmt: String     // fltp
            bitrate: Number        // 69
          },

          // メタ情報
          meta: {
            key: String,
            ...
          },

          // 画像アノテーション情報
          frames: [
            {
              idx: null,       // フレーム番号
              time: float,     // 時間
              points: [
                {
                  label: String,
                  color: String,
                  x: Number,
                  y: Number
                },
                ...
              ],
              rects: [
                {
                  label: String,
                  color: String,
                  width: Number,
                  height: Number,
                  angle: Number
                },
                ...
              ]
            },
            ...
          ],

          // 時間アノテーション情報
          textgrid: {
            key: {
              type: "interval" || "point",
              values: [ 
                { time: Number, text: String },
                ...
              ]
            },
            ...
          }
        }
      </pre>
      <v-divider />
    </v-card>
  </m-view-layout>
</template>
<script>
import MViewLayout from "@/components/base/MViewLayout";
export default {
  name: "current",
  components: {
    MViewLayout
  },
  data: () => ({
    heading: "Example: Current",
    desc: "Vuewer が参照するデータの基本形に関して説明をします"
  })
};
</script>

<style scoped></style>
