<template>
  <div class="dashboard-container">
    <h1 align="center">Ерөнхий цонх</h1>
    <br>
    <el-row :gutter="20">
      <el-col :span="8" align="center">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span><b>{{ optionsRoom[0].label.toUpperCase() }}</b></span>
          </div>
          <el-progress
            type="dashboard"
            :percentage="percentage_court"
            :color="colors"
          />
          <h4 align="center">{{ `${activeUsers_court}/${capacity_court}` }}</h4>
        </el-card>
      </el-col>
      <el-col :span="8" align="center">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span><b>{{ optionsRoom[1].label.toUpperCase() }}</b></span>
          </div>
          <el-progress
            type="dashboard"
            :percentage="percentage_pool"
            :color="colors"
          />
          <h4 align="center">{{ `${activeUsers_pool}/${capacity_pool}` }}</h4>
        </el-card>
      </el-col>
      <el-col :span="8" align="center">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span><b>{{ optionsRoom[2].label.toUpperCase() }}</b></span>
          </div>
          <el-progress
            type="dashboard"
            :percentage="percentage_fitness"
            :color="colors"
          />
          <h4 align="center">{{ `${activeUsers_fitness}/${capacity_fitness}` }}</h4>
        </el-card>
      </el-col>
    </el-row>
    <br>
    <el-row :gutter="20">
      <el-col :span="12" align="center">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span><b>{{ optionsRoom[3].label.toUpperCase() }}</b></span>
          </div>
          <el-progress
            type="dashboard"
            :percentage="percentage_aero"
            :color="colors"
          />
          <h4 align="center">{{ `${activeUsers_aero}/${capacity_aero}` }}</h4>
        </el-card>
      </el-col>
      <el-col :span="12" align="center">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span><b>{{ optionsRoom[4].label.toUpperCase() }}</b></span>
          </div>
          <el-progress
            type="dashboard"
            :percentage="percentage_sub"
            :color="colors"
          />
          <h4 align="center">{{ `${activeUsers_sub}/${capacity_sub}` }}</h4>
        </el-card>
      </el-col>
    </el-row>
    <br>
    <h1 align="center">7 хоногийн танхимийн үзүүлэлт</h1>
    <br>
    <el-row>
      <el-col align="center">
        <div class="chart-wrapper">
          <bar-chart
            :chartdata="chartData"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import rooms from '@/assets/static/rooms.json'
import weeks from '@/assets/static/weeks.json'
import { fetchActiveTimelog, fetchTimelogRoomDateRange } from '@/api/timelog'
import BarChart from '../../components/Charts/BarChart.vue'

const today = new Date((new Date()).valueOf() + (8 * 60 * 60 * 1000))
const weekAgo = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 168)

export default {
  name: 'Dashboard',
  components: { BarChart },
  data() {
    return {
      percentage_court: 10,
      activeUsers_court: 0,
      capacity_court: rooms[0].max,

      percentage_pool: 10,
      activeUsers_pool: 0,
      capacity_pool: rooms[1].max,

      percentage_fitness: 10,
      activeUsers_fitness: 0,
      capacity_fitness: rooms[2].max,

      percentage_aero: 10,
      activeUsers_aero: 0,
      capacity_aero: rooms[3].max,

      percentage_sub: 10,
      activeUsers_sub: 0,
      capacity_sub: rooms[4].max,
      optionsRoom: rooms,
      loading: false,
      colors: [
        { color: '#6f7ad3', percentage: 20 },
        { color: '#1989fa', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#e6a23c', percentage: 80 },
        { color: '#f56c6c', percentage: 100 }
      ],
      loadingByDate: false,
      chartData: [
        [5, 4, 3, 3, 4, 5, 6],
        [5, 4, 3, 3, 4, 5, 6],
        [5, 4, 3, 3, 4, 5, 6],
        [5, 4, 3, 3, 4, 5, 6],
        [5, 4, 3, 3, 4, 5, 6]
      ]
    }
  },
  computed: {
    ...mapGetters([
      'username'
    ])
  },
  created() {
    this.fetchTimelogs()
    this.fetchTimelogsByRoomsWeekly()
  },
  methods: {
    fetchTimelogsByRoomsWeekly() {
      const weekIndex = this.getIndexWeekdays()
      this.chartData = []
      rooms.forEach((room, index) => {
        // console.log('Room name: ', room.label)
        this.fetchTimelogsByRange(weekAgo, today, room.value, weekIndex)
      })
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
          console.log('Response: %s, Room: %s', response.length, rooms[roomId].label)
          if (response.length === 0) {
            console.log('Empty room, ', rooms[roomId].label)
            this.chartData[roomId] = weeklyCount
            return weeklyCount
          }
          response.forEach(log => {
            // console.log('Log: ', new Date(log.entryTime))
            entryDate = new Date(log.entryTime)
            switch (entryDate.getDay()) {
              case weekIndex[0]:
                weeklyCount[6]++
                break
              case weekIndex[1]:
                weeklyCount[5]++
                break
              case weekIndex[2]:
                weeklyCount[4]++
                break
              case weekIndex[3]:
                weeklyCount[3]++
                break
              case weekIndex[4]:
                weeklyCount[2]++
                break
              case weekIndex[5]:
                weeklyCount[1]++
                break
              case weekIndex[6]:
                weeklyCount[0]++
                break
              default:
                break
            }
            // console.log('Sum ', weeklyCount)
            this.chartData[roomId] = weeklyCount
            return weeklyCount
          })
          resolve()
        }).catch(error => {
          console.log(error)
          return [0, 0, 0, 0, 0, 0, 0]
        })
      })
    },
    fetchTimelogs() {
      this.loading = true
      return new Promise((resolve, reject) => {
        fetchActiveTimelog().then(response => {
          this.loading = false
          // console.log('Len: ', response.length)
          this.setActiveUsers(response)
          resolve()
        }).catch(error => {
          console.log(error)
          this.loading = false
          this.$message({
            message: 'Цагийн мэдээлэл амжилтгүй татагдлаа.',
            type: 'warning'
          })
        })
      })
    },
    setActiveUsers(timelogs) {
      if (timelogs.length > 0) {
        timelogs.forEach(timelog => {
          switch (timelog.roomId) {
            case rooms[0].value:
              this.activeUsers_court++
              break
            case rooms[1].value:
              this.activeUsers_pool++
              break
            case rooms[2].value:
              this.activeUsers_fitness++
              break
            case rooms[3].value:
              this.activeUsers_aero++
              break
            case rooms[4].value:
              this.activeUsers_sub++
              break
            default:
              break
          }
        })
      }
      this.percentage_court = Math.ceil(this.activeUsers_court * 100 / this.capacity_court)
      this.percentage_pool = Math.ceil(this.activeUsers_pool * 100 / this.capacity_pool)
      this.percentage_fitness = Math.ceil(this.activeUsers_fitness * 100 / this.capacity_fitness)
      this.percentage_aero = Math.ceil(this.activeUsers_aero * 100 / this.capacity_aero)
      this.percentage_sub = Math.ceil(this.activeUsers_sub * 100 / this.capacity_sub)
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

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
