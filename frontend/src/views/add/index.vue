<template>
  <div class="app-container">
    <h3>Шинэ үйлчлүүлэгч бүртгэх</h3>
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
              <el-input v-model="userInfo.passportNumber" placeholder="9121200" style="width:60%;" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Харъяа алба">
            <el-select v-model="userInfo.department" placeholder="Аль салбар нэгж алба" style="width:100%;">
              <el-option
                v-for="item in optionsDepartment"
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
          <el-form-item label="Албан тушаал">
            <el-select
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
            </el-select>
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
  </div>
</template>

<script>

import { createCustomer } from '@/api/user'
import letters from '@/assets/static/letters.json'
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
        department: 3,
        jobTitle: 3,
        phoneNumber: null,
        email: '',
        testedDate: new Date(),
        expiryDate: today.setMonth(today.getMonth() + 3),
        fields: []
      },
      isValid: true,
      loading: false,
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
        ]
      },
      optionsDepartment: [
        {
          value: 1,
          label: 'ХНАА'
        },
        {
          value: 2,
          label: 'НМҮА'
        },
        {
          value: 3,
          label: 'НХҮА'
        },
        {
          value: 4,
          label: 'НБУГ'
        },
        {
          value: 5,
          label: 'НТИА'
        },
        {
          value: 6,
          label: 'ИНЕГ'
        },
        {
          value: 7,
          label: 'АНУГ'
        }
      ],
      optionsJobTitle: [
        {
          value: 1,
          label: 'Инженер'
        },
        {
          value: 2,
          label: 'Жолооч'
        },
        {
          value: 3,
          label: 'Нислэгийн Удирдагч'
        },
        {
          value: 4,
          label: 'АБХА'
        },
        {
          value: 5,
          label: 'Менежер'
        },
        {
          value: 6,
          label: 'Нягтлан бодогч'
        },
        {
          value: 7,
          label: 'Програмист'
        },
        {
          value: 8,
          label: 'Оператор'
        }
      ],
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
                message: 'Хадгалах хүсэлт амжилтгүй боллоо.',
                type: 'danger'
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

