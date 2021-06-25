<template>
  <div class="app-container">
    <h3>Шинэ үйлчлүүлэгч бүртгэх</h3>

    <el-row>
      <el-col :span="20">
        <el-input v-model="firstname" placeholder="Нэрээр хайх" style="width:100%;" @keyup.enter.native="handleSearch" />
      </el-col>
      <el-col :span="4">
        <el-button
          :loading="loadingSearch"
          type="primary"
          style="width:100%; margin-bottom:30px;"
          @click.native.prevent="handleSearch"
        >Хайх
        </el-button>
      </el-col>
    </el-row>
    <el-form ref="userInfo" :model="userInfo" label-width="120px">
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item
              prop="passportNumber"
              label="Регистер"
              :rules="rules.passportNumber"
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
            :rules="rules.department"
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
              :rules="rules.name"
            >
              <el-input v-model="userInfo.lastname" placeholder="Овог" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="jobTitle"
            label="Албан тушаал"
            :rules="rules.jobTitle"
          >
            <el-input
              v-model="userInfo.jobTitle"
              placeholder="Ямар тушаал"
              style="width:100%;"
            />
            <!-- <el-select
              v-model="userInfo.jobTitle"
              placeholder="Ямар тушаал"
              style="width:100%;"
            >
              <el-option
                v-for="item in optionsJobTitle"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            prop="firstname"
            label="Өөрийн нэр"
            :rules="rules.name"
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
            :rules="rules.birthdate"
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
            :rules="rules.email"
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
            :rules="rules.testedDate"
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
            :rules="rules.phoneNumber"
          >
            <el-input v-model="userInfo.phoneNumber" type="number" placeholder="99119911" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-button :loading="loading" type="primary" style="width: 100%;" @click="onSubmit('userInfo')">Бүртгэх</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-dialog title="Хайлтын үр дүн" :visible.sync="isVisible" width="80%">
      <el-table :data="result">
        <el-table-column
          prop="lastname"
          label="Овог"
          width="150"
        />
        <el-table-column
          prop="firstname"
          label="Нэр"
          width="150"
        />
        <el-table-column
          prop="department"
          label="Алба"
          width="200"
        />
        <el-table-column
          prop="position"
          label="Мэргэжил"
          width="200"
        />
        <el-table-column
          prop="phone"
          label="Утасны дугаар"
          width="200"
        />
        <el-table-column
          label="Үйлдэл"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="chooseRow(scope.$index, scope.row)"
            >Сонгох
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>

import { createCustomer, searchCustomers } from '@/api/user'
import letters from '@/assets/static/letters.json'
import departments from '@/assets/static/deps.json'
import jobTitles from '@/assets/static/jobTitles.json'
const today = new Date()

export default {
  data() {
    return {
      userInfo: {
        lastname: '',
        firstname: '',
        passportId: {
          letter1: 'А',
          letter2: 'А'
        },
        passportNumber: '',
        birthdate: new Date('January 1, 2002'),
        gender: 'male',
        department: null,
        jobTitle: '',
        phoneNumber: null,
        email: '',
        testedDate: new Date(),
        expiryDate: today.setMonth(today.getMonth() + 3),
        fields: []
      },
      loading: false,
      loadingSearch: false,
      firstname: 'Мөнх-Эрдэнэ',
      result: null,
      isValid: true,
      isVisible: false,
      rules: {
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
  methods: {
    handleSearch(e) {
      e.preventDefault()
      if (this.firstname.length > 0) {
        this.loadingSearch = true
        searchCustomers({
          firstname: this.firstname.trim()
        }).then(response => {
          this.result = response.results
          console.log('Result: ', response.results[0].firstname)
          this.isVisible = true
          this.loadingSearch = false
        }).catch(error => {
          console.log('Error: ', error)
          this.$message({
            message: 'Алдаатай хүсэлт',
            type: 'warning'
          })
          this.loadingSearch = false
        })
      } else {
        this.$message({
          message: 'Хэт богино байна',
          type: 'warning'
        })
      }
    },
    chooseRow(index, row) {
      console.log('Chosen row: ', row.firstname)
      this.userInfo.firstname = row.firstname
      this.userInfo.lastname = row.lastname
      this.userInfo.gender = row.gender === '1' ? 'male' : 'female'
      this.userInfo.phoneNumber = row.phone
      this.userInfo.email = row.email
      this.userInfo.passportId.letter1 = row.rd[0]
      this.userInfo.passportId.letter2 = row.rd[1]
      this.userInfo.passportNumber = row.rd.substring(2, 10)
      this.userInfo.department = null
      this.userInfo.jobTitle = row.position
      this.userInfo.birthdate = this.extractBirthdate(row.rd)
      this.isVisible = false
    },
    onSubmit(userInfo) {
      this.$refs[userInfo].validate((valid) => {
        if (valid) {
          this.loading = true
          const customerId = `${this.userInfo.passportId.letter1 + this.userInfo.passportId.letter2 + this.userInfo.passportNumber.trim()}`
          this.$message('Хадгалж болно!')
          return new Promise((resolve, reject) => {
            createCustomer({
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
              console.log(response)
              this.loading = false
              this.$message({
                message: 'Амжилттай нэмэгдлээ.',
                type: 'success'
              })
              resolve()
            }).catch(error => {
              console.log(error)
              this.loading = false
              this.$message({
                message: 'Хадгалах хүсэлт амжилтгүй боллоо. \n Бүртгэлтэй хэрэглэгч',
                type: 'warning'
              })
            })
          })
        } else {
          console.log('Passportid: ', `${this.userInfo.passportId.letter1 + this.userInfo.passportId.letter2 + this.userInfo.passportNumber}`)
          console.log('Validation fail')
          this.$message('Буруу эсвэл дутуу мэдээлэл оруулсан байна!')
          return false
        }
      })
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
        console.log('Conversion %s %s %s', year, month, day)
        return new Date(`${month}/${day}/${year}`)
      } else {
        return null
      }
    },
    triggerExtractDate(passportNumber) {
      this.userInfo.birthdate = this.extractBirthdate('AA'.concat(passportNumber))
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style lang="scss">
.line{
  text-align: center;
}
</style>

