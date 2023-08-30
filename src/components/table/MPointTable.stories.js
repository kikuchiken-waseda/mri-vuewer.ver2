import MPointTable from "./MPointTable.vue";

export default {
  component: MPointTable
};

const Template = args => ({
  components: { MPointTable },
  setup: () => ({ args }),
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
  },
  template: '<MPointTable v-bind="args" />'
});

export const Default = Template.bind({});
Default.args = {
  showFrame: false
};
