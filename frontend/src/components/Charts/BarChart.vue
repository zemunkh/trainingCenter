<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import rooms from '@/assets/static/rooms.json'
import weeks from '@/assets/static/weeks.json'
// import resize from './mixins/resize'
const today = new Date((new Date()).valueOf() + (8 * 60 * 60 * 1000))
export default {
  props: {
    chartdata: {
      type: Array,
      default: () => []
    },
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '80%'
    },
    height: {
      type: String,
      default: '450px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartdata: function(val, oldVal) {
      console.log('Data changed!')
      if (val !== oldVal) {
        console.log('Data changed!')
        this.initChart(this.chartdata)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart(this.chartdata)
    })
    setTimeout(() => {
      this.initChart(this.chartdata)
    }, 3000)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart(data) {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.clear()
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.setWeekDates(),
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: rooms[0].label,
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: data[0]
        }, {
          name: rooms[1].label,
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: data[1]
        }, {
          name: rooms[2].label,
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: data[2]
        }, {
          name: rooms[3].label,
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: data[3]
        }, {
          name: rooms[4].label,
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: data[4]
        }]
      })
    },
    setWeekDates() {
      const weekDays = ['Дав', 'Мяг', 'Лхг', 'Пүр', 'Баа', 'Бям', 'Ням']
      const days = weekDays
      // console.log('Label: ', weeks[today.getDay()].label)
      weeks.forEach((day, index) => {
        // console.log('Day1: %s Day2: %s', weeks[today.getDay()].label, weekDays[index])
        if (weeks[today.getDay()].label !== weekDays[6]) {
          days.push(days.shift())
        }
      })
      return days
    }
  }
}
</script>
