<template>
  <div class="app-container">
    <h1 align="center">{{ roomName }}</h1>

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
          :data="list != null ? list.filter(data => data.isActive === true) : []"
          :default-sort="{prop: 'date', order: 'descending'}"
          stripe
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="ID" width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="Нэр" prop="customerName" sortable width="220" align="center">
            <template slot-scope="scope">
              {{ scope.row.customerName }}
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
          <el-table-column label="Гарах цаг" prop="exitTime" sortable width="130" align="center">
            <template slot-scope="scope">
              {{ displayTime(scope.row.exitTime) }}
            </template>
          </el-table-column>
          <el-table-column label="Төлөв" align="center" prop="isActive" sortable width="150">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.isActive ? 'success' : 'danger'"
                disable-transitions
              >
                {{ scope.row.isActive ? 'Идэвхтэй' : 'Идэвхгүй' }}
              </el-tag>
            </template>
          </el-table-column>
          <!-- <el-table-column label="Танхим" align="center">
            <template slot-scope="scope">
              {{ roomFilter(scope.row.roomId) }}
            </template>
          </el-table-column> -->
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
        <h3>Өдөр сонгож хайх</h3>
        <br>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" align="left">
        <div class="block">
          <div class="block">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="-с"
              start-placeholder="Эхлэх огноо"
              end-placeholder="Дуусах огноо"
              @change="rangePicked()"
            />
          </div>
        </div>
      </el-col>
      <el-col :span="12" align="right">
        <el-button
          type="info"
          icon="el-icon-download"
          plain
          size="medium"
          :disabled="downloadDisable"
        >
          <download-csv
            :name="filename"
            :data="generatedData"
          >Татах
          </download-csv>
        </el-button>
      </el-col>
    </el-row>
    <br>
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
          <el-table-column align="center" label="ID" width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="Нэр" prop="customerName" sortable width="220" align="center">
            <template slot-scope="scope">
              {{ scope.row.customerName }}
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
                :type="scope.row.isActive ? 'success' : 'info'"
                disable-transitions
              >
                {{ scope.row.isActive ? 'Идэвхтэй' : 'Идэвхгүй' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Үйлдэл" align="center">
            <template slot-scope="scope">
              <el-button
                :loading="loadingByDate"
                type="primary"
                icon="el-icon-delete"
                plain
                @click="confirm(scope.row)"
              >Устгах
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
import { updateCustomerById, fetchCustomerById } from '@/api/user'
import { updateTimelogById, fetchTimelogByRoomId, fetchTimelogRoomDateRange, deleteTimelog } from '@/api/timelog'
const today = new Date()
const beforeYesterday = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 48)
const ROOM_ID = 3 // Аэробек
const CAPACITY = rooms[ROOM_ID].max
export default {
  data() {
    return {
      list: [],
      loading: false,
      listByDate: [],
      generatedData: [],
      filename: '',
      loadingByDate: false,
      loadingGenerate: false,
      optionsRoom: rooms,
      dateRange: [beforeYesterday, today],
      startDate: new Date(),
      endDate: new Date(),
      downloadDisable: true,
      percentage: 10,
      activeUsers: 0,
      roomName: rooms[ROOM_ID].label,
      capacity: CAPACITY,
      colors: [
        { color: '#6f7ad3', percentage: 20 },
        { color: '#1989fa', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#e6a23c', percentage: 80 },
        { color: '#f56c6c', percentage: 100 }
      ],
      userInfo: {
        courtTime: 0,
        poolTime: 0,
        fitnessTime: 0,
        aeroTime: 0,
        subTime: 0
      }
    }
  },
  created() {
    this.fetchTimelogs()
    this.fetchTimelogsByRange(beforeYesterday, today)
  },
  methods: {
    generateData() {
      this.loadingGenerate = true
      let data
      let index = 0
      if (this.listByDate.length > 0) {
        this.downloadDisable = false
        this.filename = `${this.displayDate(this.listByDate[0].entryTime)}-${rooms[ROOM_ID].label}.csv`
        this.listByDate.forEach(element => {
          index++
          data = {
            'Д/Д': index,
            'ID': element.customerId,
            'Нэр': element.customerName,
            'Огноо': this.displayDate(element.entryTime),
            'Орсон цаг': this.displayTime(element.entryTime),
            'Гарсан цаг': this.displayTime(element.exitTime),
            'Танхим': this.optionsRoom[element.roomId].label
          }
          this.generatedData.push(data)
        })
      } else {
        this.downloadDisable = true
      }
      this.loadingGenerate = false
    },
    rangePicked() {
      const start = this.dateRange[0]
      const end = new Date(this.dateRange[1])
      end.setHours(today.getHours(), today.getMinutes(), 0, 0)
      // console.log('End: ', end)
      this.fetchTimelogsByRange(start, end)
    },
    fetchTimelogsByRange(start, end) {
      return new Promise((resolve, reject) => {
        fetchTimelogRoomDateRange({
          roomId: ROOM_ID,
          start: start,
          end: end
        }).then(response => {
          // console.log(response)
          this.loadingByDate = false
          // console.log('Response Date: ', response)
          this.listByDate = response
          this.generateData()
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
          // console.log(response)
          this.loading = false
          // console.log('Response: ', response)
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
      // console.log('Active: ', this.activeUsers)
      this.percentage = Math.ceil(this.activeUsers * 100 / CAPACITY)
    },
    registerExit(row) {
      this.$alert('Та зөвшөөрч байна уу?', 'Зөвшөөрөл', {
        confirmButtonText: 'Тийм',
        cancelButtonText: 'Үгүй',
        type: 'warning'
      }).then(() => {
        return new Promise((resolve, reject) => {
          console.log('Row: ', row)
          fetchCustomerById({
            customerId: row.customerId
          }).then(response => {
            console.log('Court time: ', response[0])
            this.userInfo.courtTime = response[0].courtTime
            this.userInfo.poolTime = response[0].poolTime
            this.userInfo.fitnessTime = response[0].fitnessTime
            this.userInfo.aeroTime = response[0].aeroTime
            this.userInfo.subTime = response[0].subTime
            this.updateStatus(row)
            resolve()
          }).catch(error => {
            console.log(error)
            this.timelogLoading = false
            this.$message({
              message: 'Таталт амжилтгүй.',
              type: 'warning'
            })
          })
        })
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
          // console.log('Response: ', response)
          this.updateCustomerUsage(row)
          this.$message({
            message: 'Амжилттай хадгалав.',
            type: 'success'
          })
          this.fetchTimelogs()
          this.fetchTimelogsByRange(this.dateRange[0], this.dateRange[1])
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
    updateCustomerUsage(timelog) {
      console.log('Room: ', timelog)
      let data = null
      const entryTime = new Date(timelog.entryTime)
      const exitTime = new Date(timelog.exitTime)
      const hours = Math.abs(Math.round((exitTime.getTime() - entryTime.getTime()) / (1000 * 60 * 60)))
      console.log('Хичээллэсэн цаг: ', hours)
      switch (timelog.roomId) {
        case this.optionsRoom[0].value:
          data = {
            id: timelog.customerId,
            courtTime: this.userInfo.courtTime + hours
          }
          break
        case this.optionsRoom[1].value:
          data = {
            id: timelog.customerId,
            poolTime: this.userInfo.poolTime + hours
          }
          break
        case this.optionsRoom[2].value:
          data = {
            id: timelog.customerId,
            fitnessTime: this.userInfo.fitnessTime + hours
          }
          break
        case this.optionsRoom[3].value:
          data = {
            id: timelog.customerId,
            aeroTime: this.userInfo.aeroTime + hours
          }
          break
        case this.optionsRoom[4].value:
          data = {
            id: timelog.customerId,
            subTime: this.userInfo.subTime + hours
          }
          break
        default:
          break
      }
      return new Promise((resolve, reject) => {
        updateCustomerById(data).then(response => {
          console.log('Res: ', response)
          this.$message({
            message: 'Цагийн мэдээллийг амжилттай шинэчлэв.',
            type: 'success'
          })
          resolve()
        }).catch(error => {
          console.log(error)
          this.$message({
            message: 'Шинэчлэх хүсэлт амжилтгүй боллоо.',
            type: 'warning'
          })
        })
      })
    },
    confirm(row) {
      this.$alert('Та зөвшөөрч байна уу?', 'Зөвшөөрөл', {
        confirmButtonText: 'Тийм',
        cancelButtonText: 'Үгүй',
        type: 'warning'
      }).then(() => {
        this.deleteTimelogById(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Цуцлагдлаа'
        })
      })
    },
    deleteTimelogById(row) {
      this.loadingByDate = true
      // console.log('Timelog Id: ', row.id)
      return new Promise((resolve, reject) => {
        deleteTimelog({
          id: row.id
        }).then(response => {
          this.loadingByDate = false
          // console.log('Response: ', response)
          this.$message({
            message: 'Амжилттай устгав.',
            type: 'success'
          })
          this.fetchTimelogsByRange(this.dateRange[0], this.dateRange[1])
          resolve()
        }).catch(error => {
          console.log(error)
          this.loadingByDate = false
          this.$message({
            message: 'Устгаж чадсангүй.',
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

