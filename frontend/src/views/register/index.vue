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
            <el-input v-model="userInfo.phoneNumber" placeholder="99119911" />
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
          <el-button :disabled="!isValid" type="primary" @click="onSubmit('userInfo')" style="width: 100%;">Бүртгэх</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>

import Schema from 'async-validator'
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
          { min: 6, message: 'Хэт богино байна!', trigger: ['blur', 'change'] },
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
          this.$message('Хадгалж болно!')
          // this.isValid = true
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

