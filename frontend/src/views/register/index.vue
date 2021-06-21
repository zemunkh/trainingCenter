<template>
  <div class="app-container">
    <h3>Бүртгэл</h3>
    <el-form ref="userInfo" :model="userInfo" label-width="120px">
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
          <el-form-item
            prop="firstname"
            label="Өөрийн нэр"
            :rules="rules.name"
          >
            <el-input v-model="userInfo.firstname" placeholder="Нэр" />
          </el-form-item>
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
          <el-form-item label="Шинжилгээ дуусах огноо">
            <el-date-picker v-model="userInfo.expiryDate" type="date" placeholder="Мэдээг оруулах" style="width: 100%;" />
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
      <h2>СПОРТЫН ТАНХИМ</h2>
      <el-row>
        <el-col :span="15">
          <el-checkbox-group v-model="userInfo.fields">
            <el-checkbox label="Спорт заал" />
            <el-checkbox label="Бассейн" />
            <el-checkbox label="Иога" />
            <el-checkbox label="Фитнесс" />
            <el-checkbox label="Туслах танхим" />
          </el-checkbox-group>
        </el-col>
        <el-col :span="5">
          <el-button :loading="loading" type="primary" style="width: 100%;" @click="onSubmit('userInfo')">Бүртгэх</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>

import { createCustomer } from '@/api/user'
// import letters from '@/assets/static/letters.json'
import departments from '@/assets/static/departments.json'
import jobTitles from '@/assets/static/jobTitles.json'
const today = new Date()

export default {
  data() {
    return {
      userInfo: {
        lastname: '',
        firstname: '',
        birthdate: new Date('January 1, 2002'),
        gender: 'Эрэгтэй',
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
          { pattern: /^[0-9 -_]{1,11}$/, message: 'Зөвхөн тоо байна!', trigger: ['blur', 'change'] }
        ],
        testedDate: [
          { required: true, message: 'Огноог оруулна уу!', trigger: 'blur' },
          { type: 'date', message: 'Зөвхөн огноо байх ёстой!', trigger: ['blur', 'change'] }
        ]
      },
      optionsDepartment: departments,
      optionsJobTitle: jobTitles,
      optionsGender: [
        {
          value: 'male',
          label: 'Эмэгтэй'
        },
        {
          value: 'female',
          label: 'Эрэгтэй'
        }
      ]
    }
  },
  methods: {
    onSubmit(userInfo) {
      this.$refs[userInfo].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$message('Хадгалж болно!')
          return new Promise((resolve, reject) => {
            createCustomer({
              firstname: this.userInfo.firstname.trim(),
              lastname: this.userInfo.lastname.trim(),
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

