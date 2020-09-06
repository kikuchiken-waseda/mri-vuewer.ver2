<template>
  <GChart type="ColumnChart" :data="data" :options="chartOptions" />
</template>

<script>
import { GChart } from "vue-google-charts";
export default {
  name: "m-distance-chart",
  components: {
    GChart
  },
  props: {
    data: {
      type: Array
    }
  },
  data() {
    return {
      chartOptions: {
        chart: {
          title: "distance"
        }
      }
    };
  }
};
</script>
