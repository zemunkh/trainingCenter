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
          <el-table-column label="Овог" prop="lastname" sortable width="80" align="center">
            <template slot-scope="scope">
              {{ scope.row.lastname.length > 1 ? scope.row.lastname.substring(0, 2) : scope.row.lastname }}
            </template>
          </el-table-column>
          <el-table-column label="Нэр" prop="firstname" sortable width="150" align="center">
            <template slot-scope="scope">
              {{ scope.row.firstname }}
            </template>
          </el-table-column>
          <el-table-column label="Нас" prop="birthdate" sortable width="110" align="center">
            <template slot-scope="scope">
              {{ displayYear(scope.row.birthdate) }}
            </template>
          </el-table-column>
          <el-table-column label="Хүйс" prop="gender" sortable width="90" align="center">
            <template slot-scope="scope">
              {{ genderFilter(scope.row.gender) }}
            </template>
          </el-table-column>
          <el-table-column label="Харъяа алба" width="150" align="center">
            <template slot-scope="scope">
              {{ departmentFilter(scope.row.department) }}
            </template>
          </el-table-column>
          <el-table-column label="Шинжилгээ хүчинтэй огноо" width="150" align="center">
            <template slot-scope="scope">
              <el-tag
                :type="dateCheck(scope.row.testedDate) ? 'success' : 'danger'"
                disable-transitions
              >
                {{ displayDate(scope.row.testedDate) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Нийт цаг" align="center">
            <template slot-scope="scope">
              {{ scope.row.courtTime + scope.row.poolTime + scope.row.fitnessTime + scope.row.aeroTime + scope.row.subTime }} цаг
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

    <el-dialog title="Хэрэглэгчийн мэдээ засах" :visible.sync="isVisibleEdit" width="60%">
      <el-form ref="userInfo" :model="userInfo" label-width="120px">
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item
                prop="passportNumber"
                label="Регистер"
                :rules="userRules.passportNumber"
              >
                <el-select v-model="userInfo.passportId.letter1" placeholder="А" style="width:20%;">
                  <el-option
                    v-for="item in letters"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-select v-model="userInfo.passportId.letter2" placeholder="Б" style="width:20%;">
                  <el-option
                    v-for="item in letters"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-input v-model="userInfo.passportNumber" placeholder="9121200" style="width:60%;" @input="triggerExtractDate(userInfo.passportNumber)" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="department"
              label="Харъяа алба"
              :rules="userRules.department"
            >
              <el-select
                v-model="userInfo.department"
                filterable
                allow-create
                placeholder="Аль салбар нэгж алба"
                style="width:100%;"
              >
                <el-option
                  v-for="item in optionsDepartment"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item
                prop="lastname"
                label="Овог"
                :rules="userRules.name"
              >
                <el-input v-model="userInfo.lastname" placeholder="Овог" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="jobTitle"
              label="Албан тушаал"
              :rules="userRules.jobTitle"
            >
              <el-input
                v-model="userInfo.jobTitle"
                placeholder="Ямар тушаал"
                style="width:100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              prop="firstname"
              label="Өөрийн нэр"
              :rules="userRules.name"
            >
              <el-input v-model="userInfo.firstname" placeholder="Нэр" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Хүйс">
              <el-select
                v-model="userInfo.gender"
                placeholder="Хүйс"
              >
                <el-option
                  v-for="item in optionsGender"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              prop="birthdate"
              label="Төрсөн он"
              :rules="userRules.birthdate"
            >
              <el-date-picker
                v-model="userInfo.birthdate"
                type="year"
                placeholder="Огноог оруулах"
                style="width:100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="email"
              label="Имейл"
              :rules="userRules.email"
            >
              <el-input v-model="userInfo.email" placeholder="mail@mcaa.gov.mn" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              prop="testedDate"
              label="Шинжилгээ өгсөн огноо"
              :rules="userRules.testedDate"
            >
              <el-date-picker
                v-model="userInfo.testedDate"
                type="date"
                placeholder="Мэдээг оруулах"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="phoneNumber"
              label="Утас"
              :rules="userRules.phoneNumber"
            >
              <el-input v-model="userInfo.phoneNumber" type="number" placeholder="99119911" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" align="right">
            <el-button :loading="loading" type="success" style="width: 50%;" icon="el-icon-circle-check" @click="onSave('userInfo')">Хадгалах</el-button>
          </el-col>
          <el-col :span="12" align="right">
            <el-button
              :loading="loadingDelete"
              type="danger"
              style="width: 50%;"
              icon="el-icon-delete"
              @click="confirm(userInfo.id)"
            >Устгах
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="isVisibleTimelog" width="60%">
      <el-form ref="timelog" :model="timelog" label-width="120px">
        <el-row>
          <el-col>
            <el-form-item
              prop="name"
              label="Нэр"
            >
              <span>{{ timelog.customerName }}</span>
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
                  end: '23:00',
                  minTime: timelog.entryTime
                }"
                placeholder="Цаг сонгох"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <br>
        <el-row>
          <el-col align="center">
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
      </el-form>

      <br>

      <el-row>
        <el-col align="center">
          <el-table
            v-loading="timelogLoading"
            :data="timelogList"
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
            <el-table-column label="Орсон цаг" width="120" align="center">
              <template slot-scope="scope">
                {{ displayDate(scope.row.entryTime) }}
              </template>
            </el-table-column>
            <el-table-column label="Орсон цаг" width="120" align="center">
              <template slot-scope="scope">
                {{ displayTime(scope.row.entryTime) }}
              </template>
            </el-table-column>
            <el-table-column label="Гарсан цаг" width="120" align="center">
              <template slot-scope="scope">
                {{ displayTime(scope.row.exitTime) }}
              </template>
            </el-table-column>
            <el-table-column label="Танхим" align="center">
              <template slot-scope="scope">
                {{ roomFilter(scope.row.roomId) }}
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
                  :loading="loading"
                  type="primary"
                  plain
                  :disabled="!scope.row.isActive"
                  @click="registerExit(scope.row)"
                >{{ scope.row.isActive ? 'Гарсан' : 'Байхгүй' }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>

import axios from 'axios'
import moment from 'moment'
import rooms from '@/assets/static/rooms.json'
import letters from '@/assets/static/letters.json'
import departments from '@/assets/static/deps.json'
import jobTitles from '@/assets/static/jobTitles.json'
import { createTimelog, updateTimelogById, fetchTimelogByCustomerId, fetchActiveTimelogByRoom, fetchTimelogByCustomerIdActive, deleteTimelogByCustomerId } from '@/api/timelog'
import { deleteById, updateCustomerById } from '@/api/user'
const today = new Date()
const today1 = new Date()
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
        customerId: '',
        customerName: '',
        roomId: 0,
        entryTime: '',
        exitTime: '',
        keyId: '',
        isActive: true
      },
      userInfo: {
        id: null,
        lastname: '',
        firstname: '',
        passportId: {
          letter1: 'А',
          letter2: 'А'
        },
        passportNumber: '',
        birthdate: new Date('January 1, 2002'),
        gender: 'male',
        courtTime: 0,
        poolTime: 0,
        fitnessTime: 0,
        aeroTime: 0,
        subTime: 0,
        department: null,
        jobTitle: '',
        phoneNumber: null,
        email: '',
        testedDate: new Date(),
        expiryDate: today1.setMonth(today1.getMonth() + 3),
        fields: []
      },
      activeName: 'first',
      search: '',
      list: [],
      timelogList: [],
      isVisibleTimelog: false,
      isVisibleEdit: false,
      loading: false,
      loadingDelete: false,
      listLoading: true,
      timelogLoading: false,
      optionsRoom: rooms,
      rules: {
        entryTime: [
          { required: true, message: 'Цагийг оруулна уу!', trigger: 'blur' }
        ],
        exitTime: [
          { required: true, message: 'Цагийг оруулна уу!', trigger: 'blur' }
        ]
      },
      userRules: {
        name: [
          { required: true, message: 'Хүний нэр оруулна уу!', trigger: 'blur' },
          { min: 2, max: 41, message: 'Хэт богино байна!', trigger: ['blur', 'change'] },
          { type: 'string', message: 'Зөвхөн тэмдэгт байна!', trigger: ['blur', 'change'] }
        ],
        email: [
          { required: true, message: 'Имейл хаяг оруулна уу!', trigger: 'blur' },
          { type: 'email', message: 'Формат буруу байна!', trigger: ['blur', 'change'] }
        ],
        birthdate: [
          { required: true, message: 'Огноог оруулна уу!', trigger: 'blur' },
          { type: 'date', message: 'Зөвхөн огноо байх ёстой!', trigger: ['blur', 'change'] }
        ],
        phoneNumber: [
          { required: true, message: 'Утасны дугаар оруулна уу!', trigger: 'blur' },
          { min: 8, message: 'Хэт богино байна!', trigger: ['blur', 'change'] },
          { max: 8, message: 'Урт байна!', trigger: ['blur', 'change'] },
          { pattern: /^[0-9 -_]{1,11}$/, message: 'Зөвхөн тоо байна!', trigger: ['blur', 'change'] }
        ],
        passportNumber: [
          { required: true, message: 'Регистерийн дугаар оруулна уу!', trigger: 'blur' },
          { min: 8, message: 'Дутуу байна!', trigger: ['blur', 'change'] },
          { max: 8, message: 'Урт байна!', trigger: ['blur', 'change'] },
          { pattern: /^[0-9 -_]{1,11}$/, message: 'Зөвхөн тоо байна!', trigger: ['blur', 'change'] }
        ],
        testedDate: [
          { required: true, message: 'Огноог оруулна уу!', trigger: 'blur' },
          { type: 'date', message: 'Зөвхөн огноо байх ёстой!', trigger: ['blur', 'change'] }
        ],
        department: [
          { required: true, message: 'Алба нэгжийн мэдээлэл оруулна уу!', trigger: 'blur' },
          { pattern: /^[0-9 -_]{1,11}$/, message: 'Зөвхөн тоо байна!', trigger: ['blur', 'change'] }
        ],
        jobTitle: [
          { required: true, message: 'Албан тушаалын мэдээлэл оруулна уу!', trigger: 'blur' }
        ]
      },
      optionsDepartment: departments,
      optionsJobTitle: jobTitles,
      optionsGender: [
        {
          value: 'male',
          label: 'Эрэгтэй'
        },
        {
          value: 'female',
          label: 'Эмэгтэй'
        }
      ],
      letters: letters
    }
  },
  created() {
    this.fetchCustomers()
  },
  methods: {
    onSave(userInfo) {
      this.$refs[userInfo].validate((valid) => {
        if (valid) {
          this.loading = true
          const customerId = `${this.userInfo.passportId.letter1 + this.userInfo.passportId.letter2 + this.userInfo.passportNumber.trim()}`
          this.$message('Хадгалж болно!')
          return new Promise((resolve, reject) => {
            updateCustomerById({
              id: this.userInfo.id,
              firstname: this.userInfo.firstname.trim(),
              lastname: this.userInfo.lastname.trim(),
              customerId: customerId,
              gender: this.userInfo.gender,
              email: this.userInfo.email.trim(),
              birthdate: this.userInfo.birthdate,
              department: this.userInfo.department,
              jobTitle: this.userInfo.jobTitle,
              testedDate: this.userInfo.testedDate,
              phoneNumber: this.userInfo.phoneNumber.trim()
            }).then(response => {
              // console.log(response)
              this.loading = false
              this.$message({
                message: 'Амжилттай хадгалав.',
                type: 'success'
              })
              this.isVisibleEdit = false
              this.fetchCustomers()
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
          // console.log('Passportid: ', `${this.userInfo.passportId.letter1 + this.userInfo.passportId.letter2 + this.userInfo.passportNumber}`)
          console.log('Validation fail')
          this.$message('Буруу эсвэл дутуу мэдээлэл оруулсан байна!')
          return false
        }
      })
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
        console.log('Row: ', row)
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
          this.fetchTimelogs(row.customerId)
          // this.list = response.data
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
      const startTime = new Date(timelog.entryTime)
      const endTime = new Date(timelog.exitTime)
      const hours = Math.abs(Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)))
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
      console.log('Data: ', data)
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
    confirm(id) {
      this.$alert('Та зөвшөөрч байна уу?', 'Зөвшөөрөл', {
        confirmButtonText: 'Тийм',
        cancelButtonText: 'Үгүй',
        type: 'warning'
      }).then(() => {
        this.onDelete(id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Цуцлагдлаа'
        })
      })
    },
    onDelete(id) {
      return new Promise((resolve, reject) => {
        this.loadingDelete = true
        deleteById({
          id: id
        }).then(response => {
          resolve()
          return new Promise((resolve, reject) => {
            deleteTimelogByCustomerId({
              customerId: id
            }).then(response => {
              // console.log(response)
              this.loading = false
              this.$message({
                message: 'Амжилттай устгалаа.',
                type: 'success'
              })
              this.fetchCustomers()
              this.isVisibleEdit = false
              resolve()
            }).catch(error => {
              console.log(error)
              this.loadingDelete = false
              this.$message({
                message: 'Цагийн бүртгэл устгахад алдаа гарлаа.',
                type: 'warning'
              })
            })
          })
        }).catch(error => {
          console.log(error)
          this.loadingDelete = false
          this.$message({
            message: 'Устгах хүсэлт амжилтгүй боллоо.',
            type: 'warning'
          })
        })
      })
    },
    chooseCustomerToEdit(index, row) {
      // console.log('ID: ', row.id)
      this.isVisibleEdit = true
      this.userInfo.id = row.id
      this.userInfo.firstname = row.firstname
      this.userInfo.lastname = row.lastname
      this.userInfo.gender = row.gender === 'male' ? 'male' : 'female'
      this.userInfo.phoneNumber = row.phoneNumber
      this.userInfo.testedDate = new Date(row.testedDate)
      this.userInfo.email = row.email
      this.userInfo.passportId.letter1 = row.customerId[0]
      this.userInfo.passportId.letter2 = row.customerId[1]
      this.userInfo.passportNumber = row.customerId.substring(2, 10)
      this.userInfo.department = row.department
      this.userInfo.jobTitle = row.jobTitle
      this.userInfo.birthdate = this.extractBirthdate(row.customerId)
      this.userInfo.courtTime = row.courtTime
      this.userInfo.poolTime = row.poolTime
      this.userInfo.fitnessTime = row.fitnessTime
      this.userInfo.aeroTime = row.aeroTime
      this.userInfo.subTime = row.subTime
    },
    chooseCustomerToTimelog(index, row) {
      // console.log('Me chosen: ', row)
      this.timelog.customerId = row.id
      this.timelog.customerName = `${row.lastname.length > 1 ? row.lastname.substring(0, 2) : row.lastname}. ${row.firstname}`
      this.isVisibleTimelog = true
      this.timelogList = null
      this.fetchTimelogs(row.id)
    },
    registerTime(timelogForm) {
      let activerUsersNum = 0
      const year = today.getFullYear()
      const month = today.getMonth()
      const date = today.getDate()
      const entryTime = new Date(`${year}-${month + 1}-${date} ${this.timelog.entryTime}`)
      const exitTime = new Date(`${year}-${month + 1}-${date} ${this.timelog.exitTime}`)
      // console.log('Converted Entry date: ', entryTime)
      // console.log('Converted Exit date: ', exitTime)
      this.$refs[timelogForm].validate((valid) => {
        if (valid) {
          this.loading = true
          return new Promise((resolve, reject) => {
            fetchActiveTimelogByRoom({
              roomId: this.timelog.roomId
            }).then(response => {
              activerUsersNum = response.length
              // console.log('Active users/Capacity:  %s | %s', activerUsersNum, rooms[this.timelog.roomId].max)
              if (activerUsersNum < rooms[this.timelog.roomId].max) {
                return new Promise((resolve, reject) => {
                  // console.log('Customer ID: ', this.timelog.customerId)
                  fetchTimelogByCustomerIdActive({
                    customerId: this.timelog.customerId
                  }).then(timelogs => {
                    // console.log(timelogs.length)
                    if (timelogs.length > 0) {
                      this.loading = false
                      this.$message({
                        message: 'Амжилтгүй. Идэвхтэй үйлчлүүлэгч',
                        type: 'warning'
                      })
                    } else {
                      return new Promise((resolve, reject) => {
                        createTimelog({
                          customerId: this.timelog.customerId,
                          customerName: this.timelog.customerName,
                          entryTime: entryTime,
                          exitTime: exitTime,
                          roomId: this.timelog.roomId,
                          lockerNumber: '0',
                          isActive: true
                        }).then(response => {
                          // console.log(response)
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
                    }
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
              } else {
                this.loading = false
                this.$message({
                  message: 'Заал дүүрсэн байна. Бүртгэх боломжгүй',
                  type: 'warning'
                })
              }
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
    fetchTimelogs(id) {
      this.timelogLoading = true
      return new Promise((resolve, reject) => {
        // console.log('Customer ID: ', id)
        fetchTimelogByCustomerId({
          customerId: id
        }).then(response => {
          // console.log(response)
          this.timelogList = response
          this.timelogLoading = false
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
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    departmentFilter(department) {
      const res = this.optionsDepartment.filter(v => v.id === department)
      if (res.length > 0) {
        return res[0].name
      } else {
        return 'Мэдээлэл байхгүй'
      }
    },
    roomFilter(roomId) {
      const res = this.optionsRoom.filter(v => v.value === roomId)
      if (res.length > 0) {
        return res[0].label
      } else {
        return this.optionsRoom[0].label
      }
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
    extractBirthdate(register) {
      let year
      let month
      let day
      if (register.length === 10 && register != null) {
        if (register[4] === '2' || register[4] === '3') {
          year = '20'.concat(register.substring(2, 4))
          month = (parseInt(register.substring(4, 6)) - 20).toString()
        } else {
          year = '19'.concat(register.substring(2, 4))
          month = register.substring(4, 6)
        }
        day = register.substring(6, 8)
        // console.log('Conversion %s %s %s', year, month, day)
        return new Date(`${month}/${day}/${year}`)
      } else {
        return null
      }
    },
    triggerExtractDate(passportNumber) {
      this.userInfo.birthdate = this.extractBirthdate('AA'.concat(passportNumber))
    },
    dateCheck: function(date) {
      const testDate = new Date(date)
      const d = new Date()
      const to = new Date().getTime()
      const from = d.setMonth(d.getMonth() - 3)
      // console.log('Converted to: ', new Date(to))
      // console.log('Converted from: ', new Date(from))
      // console.log('Tested date: ', testDate)
      if (testDate.getTime() >= from && testDate.getTime() <= to) {
        return true
      } else return false
    },
    displayTime: function(date) {
      const d = new Date(date)
      return moment(d).format('HH:mm')
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

