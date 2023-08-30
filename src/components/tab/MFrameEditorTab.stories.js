import MFrameEditorTab from "./MFrameEditorTab.vue";

export default {
  component: MFrameEditorTab
};

const Template = () => ({
  components: { MFrameEditorTab },
  template: "<MFrameEditorTab />",
  mounted: function() {
    this.$store.commit("current/frame/points", [
      {
        x: 62.17142857142857,
        y: 115.01714285714286,
        color: "#F44336",
        label: "points-0",
        size: 5,
        frameId: 1,
        id: 40
      },
      {
        x: 74.24,
        y: 105.50857142857143,
        color: "#F44336",
        label: "points-1",
        size: 5,
        frameId: 1,
        id: 41
      },
      {
        x: 88.50285714285714,
        y: 97.46285714285715,
        color: "#F44336",
        label: "points-2",
        size: 5,
        frameId: 1,
        id: 42
      },
      {
        x: 103.49714285714286,
        y: 100.02285714285715,
        color: "#F44336",
        label: "points-3",
        size: 5,
        frameId: 1,
        id: 43
      }
    ]);
    this.$store.commit("current/frame/polygons", [
      {
        frameId: 1,
        label: "polygon-FZkDqzgB14L_QGPeaKvvJ",
        color: "#F44336",
        points: [
          {
            x: 67.29142857142857,
            y: 113.55428571428571,
            id: "o93JkaoU2-RfCKlRIcTBu"
          },
          {
            x: 82.28571428571429,
            y: 99.65714285714286,
            id: "mug6nTnR4rB-6tkyUQ4oQ"
          },
          {
            x: 88.86857142857143,
            y: 113.55428571428571,
            id: "Jt5YsNECzTnL6yn3E4LU9"
          },
          {
            x: 67.29142857142857,
            y: 113.55428571428571,
            id: "-aFLbOS7-m3-mkuAUxBho"
          }
        ],
        size: 5,
        id: 15
      },
      {
        frameId: 1,
        label: "polygon-x06Htzm2KZTjvmf1AZH3a",
        color: "#F44336",
        points: [
          {
            x: 119.95428571428572,
            y: 38.94857142857143,
            id: "VL6S0zRtWHHc3WFQ1BCVw"
          },
          {
            x: 109.34857142857143,
            y: 75.52,
            id: "3nNZEewgcNFUDdpuQF41n"
          },
          {
            x: 173.34857142857143,
            y: 91.97714285714285,
            id: "bormPiTXPJesxiYeGbWPz"
          },
          {
            x: 183.58857142857144,
            y: 45.16571428571429,
            id: "A0lWqX9wgjpf0R9hCDvC0"
          },
          {
            x: 119.95428571428572,
            y: 38.94857142857143,
            id: "1ZZ6wTYsUvERzb25f0CDl"
          }
        ],
        size: 5,
        id: 16
      }
    ]);
  }
});

export const Default = Template.bind({});
Default.args = {};
