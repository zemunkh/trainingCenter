<template>
  <div class="app-container">
    <h2>Нийт үйлчлүүлэгчид</h2>

    <el-row>
      <el-col :span="6">
        <el-input
          v-model="search"
          size="mini"
          placeholder="Нэрээр хайх"
        />
      </el-col>
    </el-row>
    <br>
    <el-row>
      <el-col :span="24">
        <el-table
          v-loading="listLoading"
          :data="list.filter(data => !search || data.firstname.toLowerCase().includes(search.toLowerCase()))"
          stripe
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="ID" width="60">
            <template slot-scope="scope">
              {{ scope.$index }}
            </template>
          </el-table-column>
          <el-table-column label="Овог" width="80" align="center">
            <template slot-scope="scope">
              {{ scope.row.lastname.length > 1 ? scope.row.lastname.substring(0, 2) : scope.row.lastname }}
            </template>
          </el-table-column>
          <el-table-column label="Нэр" width="150" align="center">
            <template slot-scope="scope">
              {{ scope.row.firstname }}
            </template>
          </el-table-column>
          <el-table-column label="Нас" width="110" align="center">
            <template slot-scope="scope">
              {{ displayYear(scope.row.birthdate) }}
            </template>
          </el-table-column>
          <el-table-column label="Хүйс" width="90" align="center">
            <template slot-scope="scope">
              {{ genderFilter(scope.row.gender) }}
            </template>
          </el-table-column>
          <el-table-column label="Харъяа алба" width="150" align="center">
            <template slot-scope="scope">
              {{ scope.row.department }}
            </template>
          </el-table-column>
          <el-table-column label="Шинжилгээ хүчинтэй огноо" width="150" align="center">
            <template slot-scope="scope">
              {{ displayDate(scope.row.testedDate) }}
            </template>
          </el-table-column>
          <el-table-column label="Утасны дугаар" align="center">
            <template slot-scope="scope">
              {{ scope.row.phoneNumber }}
            </template>
          </el-table-column>
          <el-table-column label="Үйлдэл" align="center">
            <template slot-scope="scope">
              <el-row>
                <el-col :span="12">
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-check"
                    @click="chooseCustomerToTimelog(scope.$index, scope.row)"
                  >Сонгох
                  </el-button>
                </el-col>
                <el-col :span="12">
                  <el-button
                    size="mini"
                    type="warning"
                    icon="el-icon-edit"
                    @click="chooseCustomerToEdit(scope.$index, scope.row)"
                  >Засах
                  </el-button>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-dialog title="Хэрэглэгчийн мэдээ засах" :visible.sync="isVisibleEdit" width="50%">
      Хэрэглэгч мэдээлэл
    </el-dialog>

    <el-dialog :visible.sync="isVisibleTimelog" width="40%">
      <el-form ref="timelog" :model="timelog" label-width="120px">
        <el-row>
          <el-col>
            <el-form-item
              prop="name"
              label="Нэр"
            >
              <span>{{ timelog.name }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item
              prop="room"
              label="Танхим сонгох"
            >
              <el-select v-model="timelog.roomId" placeholder="Аль танхимд орох" style="width:100%;">
                <el-option
                  v-for="item in optionsRoom"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item
              prop="entryTime"
              label="Орсон цаг"
              :rules="rules.entryTime"
            >
              <el-time-select
                v-model="timelog.entryTime"
                :picker-options="{
                  start: '06:00',
                  step: '01:00',
                  end: '23:00'
                }"
                placeholder="Цаг сонгох"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item
              prop="exitTime"
              label="Гарах цаг"
              :rules="rules.exitTime"
            >
              <el-time-select
                v-model="timelog.exitTime"
                :picker-options="{
                  start: '07:00',
                  step: '01:00',
                  end: '23:00'
                }"
                placeholder="Цаг сонгох"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <br>
        <el-row>
          <el-col>
            <el-button
              size="mini"
              :loading="loading"
              type="primary"
              style="width: 100%;"
              @click="registerTime('timelog')"
            >Бүртгэх
            </el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            Хүснэгт
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>

import axios from 'axios'
import moment from 'moment'
import rooms from '@/assets/static/rooms.json'
import { createTimelog } from '@/api/timelog'
const today = new Date()
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      timelog: {
        name: '',
        customerId: '',
        roomId: 3,
        entryTime: '',
        exitTime: '',
        keyId: '',
        isActive: true
      },
      activeName: 'first',
      search: '',
      list: [],
      isVisibleTimelog: false,
      isVisibleEdit: false,
      loading: false,
      listLoading: true,
      optionsRoom: rooms,
      rules: {
        entryTime: [
          { required: true, message: 'Цагийг оруулна уу!', trigger: 'blur' }
        ],
        exitTime: [
          { required: true, message: 'Цагийг оруулна уу!', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchCustomers()
  },
  methods: {
    chooseCustomerToEdit(index, row) {
      this.isVisibleEdit = true
    },
    chooseCustomerToTimelog(index, row) {
      console.log('Me chosen: ', row)
      this.timelog.customerId = row.id
      this.timelog.name = `${row.lastname.length > 1 ? row.lastname.substring(0, 2) : row.lastname}. ${row.firstname}`
      this.isVisibleTimelog = true
    },
    registerTime(timelogForm) {
      console.log('Entry time: ', this.timelog.entryTime)
      console.log('Exit time: ', this.timelog.exitTime)
      const year = today.getFullYear()
      const month = today.getMonth()
      const date = today.getDate()
      const entryTime = new Date(`${month + 1}/${date}/${year} ${this.timelog.entryTime}`)
      const exitTime = new Date(`${month + 1}/${date}/${year} ${this.timelog.exitTime}`)
      console.log('Converted Entry date: ', entryTime)
      console.log('Converted Exit date: ', exitTime)
      this.$refs[timelogForm].validate((valid) => {
        if (valid) {
          this.loading = true
          return new Promise((resolve, reject) => {
            createTimelog({
              customerId: this.timelog.customerId,
              entryTime: entryTime,
              exitTime: exitTime,
              roomId: this.timelog.roomId,
              lockerNumber: '0',
              isActive: true
            }).then(response => {
              console.log(response)
              this.loading = false
              this.isVisibleTimelog = false
              this.$message({
                message: 'Амжилттай нэмэгдлээ.',
                type: 'success'
              })
              resolve()
            }).catch(error => {
              console.log(error)
              this.loading = false
              this.$message({
                message: 'Хадгалах хүсэлт амжилтгүй боллоо.',
                type: 'warning'
              })
            })
          })
        } else {
          this.loading = false
          console.log('Validation fail')
          this.$message('Буруу эсвэл дутуу мэдээлэл оруулсан байна!')
          return false
        }
      })
      // this.loading = false
    },
    fetchCustomers() {
      this.listLoading = true
      axios.get('/api/customers').then(
        response => {
          this.list = response.data
          this.listLoading = false
        }).catch(error => {
        console.log('Error: ', error)
        this.listLoading = false
      })
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    genderFilter(gender) {
      switch (gender) {
        case 'male':
          return 'Эр'
        case 'female':
          return 'Эм'
        default:
          return 'Эр'
      }
    },
    displayDate: function(date) {
      moment.locales('mn')
      return moment(date).format('L')
    },
    displayYear: function(date) {
      return moment(date).format('YYYY')
    }
  }
}
</script>

<style lang="scss">
.line{
  text-align: center;
}
.center {
  display: block;
  text-align: center;
}
</style>

