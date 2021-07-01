<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import rooms from '@/assets/static/rooms.json'
import weeks from '@/assets/static/weeks.json'
import { fetchTimelogRoomDateRange } from '@/api/timelog'
// import resize from './mixins/resize'
// const animationDuration = 6000
const today = new Date((new Date()).valueOf() + (8 * 60 * 60 * 1000))
const weekAgo = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 168)
const prev = [1, 1, 1, 1, 1, 1, 1]
export default {
  props: {
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
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  created() {
    // this.fetchTimelogsByRange(weekAgo, today, 0)
    this.fetchTimelogsByRooms()
  },
  methods: {
    fetchTimelogsByRooms() {
      const weeklyCountsByRooms = []
      const weekIndex = this.getIndexWeekdays()
      rooms.forEach(room => {
        console.log('Room name: ', room.label)
        weeklyCountsByRooms.push(this.fetchTimelogsByRange(weekAgo, today, room.value, weekIndex))
      })
      // this.setSeriesData(weeklyCountsByRooms)
      // this.initChart()
    },
    setSeriesData(weeklyCountsByRooms) {
      return [{
        name: rooms[0].label,
        type: 'bar',
        stack: 'vistors',
        barWidth: '60%',
        data: weeklyCountsByRooms[0]
      }, {
        name: rooms[1].label,
        type: 'bar',
        stack: 'vistors',
        barWidth: '60%',
        data: weeklyCountsByRooms[1]
      }, {
        name: rooms[2].label,
        type: 'bar',
        stack: 'vistors',
        barWidth: '60%',
        data: weeklyCountsByRooms[2]
      }, {
        name: rooms[3].label,
        type: 'bar',
        stack: 'vistors',
        barWidth: '60%',
        data: weeklyCountsByRooms[3]
      }, {
        name: rooms[4].label,
        type: 'bar',
        stack: 'vistors',
        barWidth: '60%',
        data: weeklyCountsByRooms[4]
      }]
    },
    fetchTimelogsByRange(start, end, roomId, weekIndex) {
      return new Promise((resolve, reject) => {
        fetchTimelogRoomDateRange({
          roomId: roomId,
          start: start,
          end: end
        }).then(response => {
          // console.log(response)
          // Add to each room array
          let entryDate
          const weeklyCount = [0, 0, 0, 0, 0, 0, 0]
          response.forEach(log => {
            // console.log('Log: ', new Date(log.entryTime))
            entryDate = new Date(log.entryTime)
            switch (entryDate.getDay()) {
              case weekIndex[0]:
                weeklyCount[0]++
                break
              case weekIndex[1]:
                weeklyCount[1]++
                break
              case weekIndex[2]:
                weeklyCount[2]++
                break
              case weekIndex[3]:
                weeklyCount[3]++
                break
              case weekIndex[4]:
                weeklyCount[4]++
                break
              case weekIndex[5]:
                weeklyCount[5]++
                break
              case weekIndex[6]:
                weeklyCount[6]++
                break
              default:
                break
            }
            console.log('Sum ', weeklyCount)
            return weeklyCount
          })
          resolve()
        }).catch(error => {
          console.log(error)
          return [0, 0, 0, 0, 0, 0, 0]
        })
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
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
          data: prev
        }, {
          name: rooms[1].label,
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: prev
        }, {
          name: rooms[2].label,
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: prev
        }, {
          name: rooms[3].label,
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: prev
        }, {
          name: rooms[4].label,
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: prev
        }]
      })
    },
    setWeekDates() {
      const weekDays = ['Дав', 'Мяг', 'Лхг', 'Пүр', 'Баа', 'Бям', 'Ням']
      const days = weekDays
      // console.log('Label: ', weeks[today.getDay()].label)
      weeks.forEach((day, index) => {
        // console.log('Day1: %s Day2: %s', weeks[today.getDay()].label, weekDays[index])
        if (weeks[today.getDay()].label !== weekDays[0]) {
          days.push(days.shift())
        }
      })
      return days
    },
    getIndexWeekdays() {
      const weekDays = [0, 1, 2, 3, 4, 5, 6]
      const days = weekDays
      weeks.forEach((day, index) => {
        // console.log('Day1: %s Day2: %s', weeks[today.getDay()].label, weekDays[index])
        if (today.getDay() !== weekDays[0]) {
          days.push(days.shift())
        }
      })
      return days
    }
  }
}
</script>
