<template>
  <div class="app-container">
    <h3>Спорт заал</h3>

    <el-row>
      <el-col align="center">
        <el-progress
          type="dashboard"
          :percentage="percentage"
          :color="colors"
        />
      </el-col>
    </el-row>
    <el-row>
      <el-col align="center">
        <h4 align="center">{{ `${activeUsers}/${capacity}` }}</h4>
      </el-col>
    </el-row>

    <el-row>
      <el-col align="center">
        <el-table
          v-loading="loading"
          :data="list.filter(data => data.isActive === true)"
          :default-sort="{prop: 'date', order: 'descending'}"
          stripe
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="ID" width="80">
            <template slot-scope="scope">
              {{ scope.$index }}
            </template>
          </el-table-column>
          <el-table-column label="Өдөр" prop="date" sortable width="120" align="center">
            <template slot-scope="scope">
              {{ displayDate(scope.row.entryTime) }}
            </template>
          </el-table-column>
          <el-table-column label="Орсон цаг" prop="entryTime" sortable width="130" align="center">
            <template slot-scope="scope">
              {{ displayTime(scope.row.entryTime) }}
            </template>
          </el-table-column>
          <el-table-column label="Гарсан цаг" prop="exitTime" sortable width="130" align="center">
            <template slot-scope="scope">
              {{ displayTime(scope.row.exitTime) }}
            </template>
          </el-table-column>
          <el-table-column label="Төлөв" align="center" prop="isActive" sortable>
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.isActive ? 'success' : 'danger'"
                disable-transitions
              >
                {{ scope.row.isActive ? 'Идэвхтэй' : 'Идэвхгүй' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Танхим" align="center">
            <template slot-scope="scope">
              {{ roomFilter(scope.row.roomId) }}
            </template>
          </el-table-column>
          <el-table-column label="Үйлдэл" align="center">
            <template slot-scope="scope">
              <el-button
                :loading="loading"
                type="primary"
                plain
                @click="registerExit(scope.row)"
              >Гарсан
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <br>
    <el-row>
      <el-col align="center">
        <div class="block">
          <h3>Өдөр сонгож хайх</h3>
          <el-date-picker
            v-model="filterDate"
            type="date"
            placeholder="Өдөр сонгох"
          />
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col align="center">
        <el-table
          v-loading="loadingByDate"
          :data="listByDate"
          :default-sort="{prop: 'date', order: 'descending'}"
          stripe
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="ID" width="80">
            <template slot-scope="scope">
              {{ scope.$index }}
            </template>
          </el-table-column>
          <el-table-column label="Өдөр" prop="date" sortable width="120" align="center">
            <template slot-scope="scope">
              {{ displayDate(scope.row.entryTime) }}
            </template>
          </el-table-column>
          <el-table-column label="Орсон цаг" prop="entryTime" sortable width="130" align="center">
            <template slot-scope="scope">
              {{ displayTime(scope.row.entryTime) }}
            </template>
          </el-table-column>
          <el-table-column label="Гарсан цаг" prop="exitTime" sortable width="130" align="center">
            <template slot-scope="scope">
              {{ displayTime(scope.row.exitTime) }}
            </template>
          </el-table-column>
          <el-table-column label="Төлөв" align="center" prop="isActive" sortable>
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.isActive ? 'success' : 'danger'"
                disable-transitions
              >
                {{ scope.row.isActive ? 'Идэвхтэй' : 'Идэвхгүй' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Танхим" align="center">
            <template slot-scope="scope">
              {{ roomFilter(scope.row.roomId) }}
            </template>
          </el-table-column>
          <el-table-column label="Үйлдэл" align="center">
            <template slot-scope="scope">
              <el-button
                :loading="loading"
                type="primary"
                plain
                @click="registerExit(scope.row)"
              >Гарсан
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import moment from 'moment'
import rooms from '@/assets/static/rooms.json'
import { updateTimelogById, fetchTimelogByRoomId, fetchTimelogByDate } from '@/api/timelog'
const ROOM_ID = 0 // Спорт заал
const CAPACITY = 30
export default {
  data() {
    return {
      list: [],
      loading: false,
      listByDate: [],
      loadingByDate: false,
      loadingButton: false,
      optionsRoom: rooms,
      filterDate: new Date(),
      percentage: 10,
      activeUsers: 0,
      capacity: CAPACITY,
      colors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ]
    }
  },
  created() {
    this.fetchTimelogs()
  },
  methods: {
    fetchTimelogsByDate() {
      return new Promise((resolve, reject) => {
        fetchTimelogByDate({
          roomId: ROOM_ID,
          entryDate: this.filterDate
        }).then(response => {
          console.log(response)
          this.loadingByDate = false
          console.log('Response Date: ', response)
          this.listByDate = response
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
    fetchTimelogs() {
      return new Promise((resolve, reject) => {
        fetchTimelogByRoomId({
          roomId: ROOM_ID
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
    },
    getActiveUsers(timelogs) {
      this.activeUsers = 0
      if (timelogs.length > 0) {
        timelogs.forEach(element => {
          if (element.isActive) {
            this.activeUsers++
          }
        })
      }
      console.log('Active: ', this.activeUsers)
      this.percentage = Math.ceil(this.activeUsers * 100 / CAPACITY)
    },
    registerExit(row) {
      this.$alert('Та зөвшөөрч байна уу?', 'Зөвшөөрөл', {
        confirmButtonText: 'Тийм',
        cancelButtonText: 'Үгүй',
        type: 'warning'
      }).then(() => {
        this.updateStatus(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Цуцлагдлаа'
        })
      })
    },
    updateStatus(row) {
      return new Promise((resolve, reject) => {
        updateTimelogById({
          id: row.id,
          isActive: false,
          exitTime: new Date()
        }).then(response => {
          this.loading = false
          console.log('Response: ', response)
          this.$message({
            message: 'Амжилттай хадгалав.',
            type: 'success'
          })
          this.fetchTimelogs()
          this.list = response.data
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
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    roomFilter(roomId) {
      const res = this.optionsRoom.filter(v => v.value === roomId)
      if (res.length > 0) {
        return res[0].label
      } else {
        return this.optionsRoom[0].label
      }
    },
    displayTime: function(date) {
      const d = new Date(date)
      return moment(d).format('HH:mm')
    },
    displayDate: function(date) {
      moment.locales('mn')
      return moment(date).format('L')
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

