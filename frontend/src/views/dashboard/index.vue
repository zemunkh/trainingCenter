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
            :courtdata="courtData"
            :pooldata="poolData"
            :fitnessdata="fitnessData"
            :aerodata="aeroData"
            :subdata="subData"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import rooms from '@/assets/static/rooms.json'
import { fetchActiveTimelog } from '@/api/timelog'
import BarChart from '../../components/Charts/BarChart.vue'

export default {
  name: 'Dashboard',
  components: { BarChart },
  data() {
    return {
      courtData: [400, 52, 200, 334, 390, 330, 220],
      poolData: [400, 52, 200, 334, 390, 330, 220],
      fitnessData: [400, 52, 200, 334, 390, 330, 220],
      aeroData: [20, 20, 20, 20, 20, 20, 20],
      subData: [40, 40, 40, 40, 40, 40, 40],
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
      loadingByDate: false
    }
  },
  computed: {
    ...mapGetters([
      'username'
    ])
  },
  created() {
    this.fetchTimelogs()
  },
  methods: {
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
