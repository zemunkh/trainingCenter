<template>
  <div class="dashboard-container">
    <h1 align="center">Ерөнхий цонх</h1>
    <br>
    <el-row :gutter="20">
      <el-col :span="8" align="center">
        <el-card class="box-card">
          <el-progress
            type="dashboard"
            :percentage="percentage_court"
            :color="colors"
          />
          <h4 align="center">{{ `${activeUsers_court}/${capacity_court}` }}</h4>
          <h3>{{ optionsRoom[0].label.toUpperCase() }}</h3>
        </el-card>
      </el-col>
      <el-col :span="8" align="center">
        <el-card class="box-card">
          <el-progress
            type="dashboard"
            :percentage="percentage_pool"
            :color="colors"
          />
          <h4 align="center">{{ `${activeUsers_pool}/${capacity_pool}` }}</h4>
          <h3>{{ optionsRoom[1].label }}</h3>
        </el-card>
      </el-col>
      <el-col :span="8" align="center">
        <el-card class="box-card">
          <el-progress
            type="dashboard"
            :percentage="percentage_fitness"
            :color="colors"
          />
          <h4 align="center">{{ `${activeUsers_fitness}/${capacity_fitness}` }}</h4>
          <h3>{{ optionsRoom[2].label }}</h3>
        </el-card>
      </el-col>
    </el-row>
    <br>
    <el-row :gutter="20">
      <el-col :span="12" align="center">
        <el-card class="box-card">
          <el-progress
            type="dashboard"
            :percentage="percentage_aero"
            :color="colors"
          />
          <h4 align="center">{{ `${activeUsers_aero}/${capacity_aero}` }}</h4>
          <h3>{{ optionsRoom[3].label }}</h3>
        </el-card>
      </el-col>
      <el-col :span="12" align="center">
        <el-card class="box-card">
          <el-progress
            type="dashboard"
            :percentage="percentage_sub"
            :color="colors"
          />
          <h4 align="center">{{ `${activeUsers_pool}/${capacity_sub}` }}</h4>
          <h3>{{ optionsRoom[4].label }}</h3>
        </el-card>
      </el-col>
    </el-row>
    <div class="dashboard-text">Username: {{ username }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import rooms from '@/assets/static/rooms.json'
import { fetchTimelogByRoomId } from '@/api/timelog'
export default {
  name: 'Dashboard',
  data() {
    return {
      percentage_court: 10,
      activeUsers_court: 0,
      capacity_court: 30,

      percentage_pool: 10,
      activeUsers_pool: 0,
      capacity_pool: 40,

      percentage_fitness: 10,
      activeUsers_fitness: 0,
      capacity_fitness: 30,

      percentage_aero: 10,
      activeUsers_aero: 0,
      capacity_aero: 20,

      percentage_sub: 10,
      activeUsers_sub: 0,
      capacity_sub: 20,
      optionsRoom: rooms,
      colors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
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
  },
  methods: {
    fetchTimelogs() {
      return new Promise((resolve, reject) => {
        fetchTimelogByRoomId({
          roomId: 0
        }).then(response => {
          console.log(response)
          this.loading = false
          console.log('Response: ', response)
          this.list = response
          this.getActiveUsers(response)
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
