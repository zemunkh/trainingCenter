<template>
  <div class="app-container">
    <!-- <span>{{ is_admin ? 'Admin' : 'Өөр хүн бно' }}</span> -->
    <el-row>
      <el-col :span="24">
        <el-button
          size="mini"
          type="success"
          icon="el-icon-plus"
          @click="isVisibleNew = true"
        >Шинэ Админ
        </el-button>
      </el-col>
    </el-row>
    <br>

    <el-row>
      <el-col :span="24">
        <el-table
          v-loading="listLoading"
          :data="list"
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
          <el-table-column label="Хэрэглэгч" width="150" align="center">
            <template slot-scope="scope">
              {{ scope.row.username }}
            </template>
          </el-table-column>
          <el-table-column label="Нууц үг" width="250" align="center">
            <template slot-scope="scope">
              {{ scope.row.user_pass }}
            </template>
          </el-table-column>
          <el-table-column label="Админ эсэх" width="150" align="center">
            <template slot-scope="scope">
              {{ scope.row.is_admin == 1 ? "Тийм" : "Үгүй" }}
            </template>
          </el-table-column>
          <el-table-column label="Нууц үг солих" width="180" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-edit"
                @click="showChangePassword(scope.$index, scope.row)"
              >Нууц үг солих
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="Устгах" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.is_admin !== 1">
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="selectUser(scope.$index, scope.row)"
                >Устгах
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-dialog title="Админ нэмэх" :visible.sync="isVisibleNew" width="40%">
      <el-form ref="newForm" :model="newForm" :rules="rules" label-width="120px">
        <el-row>
          <el-col>
            <el-form-item
              prop="username"
              label="Хэрэглэгч"
            >
              <el-input v-model="newForm.username" name="username" placeholder="Нэр" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item
              prop="password"
              label="Нууц үг"
            >
              <el-input
                v-model="newForm.password"
                placeholder="Нууц үг"
                type="password"
                name="password"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-button
              size="mini"
              :loading="loading"
              type="primary"
              style="width: 100%;"
              @click="onSubmitAdmin('newForm')"
            >Нэмэх
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <el-dialog title="Нууц үг солих" :visible.sync="isVisibleChange" width="40%">
      <el-form ref="passForm" :model="passForm" label-width="120px">
        <el-row>
          <el-col>
            <el-form-item
              prop="password"
              label="Нууц үг"
            >
              <el-input
                v-model="passForm.password"
                placeholder="Нууц үг"
                type="password"
                name="password"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-button
              size="mini"
              :loading="loading"
              type="primary"
              style="width: 100%;"
              @click="confirm('passForm')"
            >Батлах
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <el-dialog title="Та зөвшөөрч байна уу?" :visible.sync="isVisibleDelete" width="30%">
      <el-row>
        <el-col :span="12" align="right">
          <el-button
            type="info"
            style="width: 50%;"
            @click="isVisibleDelete = false"
          >Үгүй
          </el-button>
        </el-col>
        <el-col :span="12" align="right">
          <el-button
            :loading="loading"
            type="primary"
            style="width: 50%;"
            @click="deleteUser()"
          >Тийм
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>

import axios from 'axios'
import { createAdmin, updateAdminPassword, deleteAdmin } from '@/api/admin'
import { mapGetters } from 'vuex'

export default {
  name: 'Admin',
  data() {
    return {
      newForm: {
        username: '',
        password: ''
      },
      passForm: {
        password: ''
      },
      list: null,
      listLoading: false,
      loading: false,
      isVisibleNew: false,
      isVisibleChange: false,
      isVisibleDelete: false,
      rules: {
        username: [
          { required: true, message: 'Админ нэр оруулна уу!', trigger: 'blur' },
          { min: 2, max: 12, message: 'Хэт богино байна!', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: 'Нууц үг оруулна уу!', trigger: 'blur' },
          { min: 2, max: 12, message: 'Хэт богино байна!', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'is_admin'
    ])
  },
  created() {
    this.fetchUsers()
  },
  methods: {
    onSubmitAdmin(userInfo) {
      console.log('Admin button clicked')
      this.$refs[userInfo].validate((valid) => {
        if (valid) {
          this.loading = true
          return new Promise((resolve, reject) => {
            createAdmin({
              username: this.newForm.username,
              password: this.newForm.password
            }).then(response => {
              console.log(response)
              this.loading = false
              this.isVisibleNew = false
              this.$message({
                message: 'Амжилттай нэмэгдлээ.',
                type: 'success'
              })
              this.fetchUsers()
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
          console.log('Validation fail')
          this.$message('Буруу эсвэл дутуу мэдээлэл оруулсан байна!')
          return false
        }
      })
    },
    fetchUsers() {
      this.listLoading = true
      axios.get('/admin/users').then(
        response => {
          this.list = response.data.users
          this.listLoading = false
        }).catch(error => {
        console.log('Error: ', error)
        this.listLoading = false
      })
    },
    showChangePassword(index, row) {
      this.isVisibleChange = true
      this.selectedUsername = row.username
    },
    confirm(passInfo) {
      console.log('Password: ', this.passForm.password)
      this.$refs[passInfo].validate((valid) => {
        if (valid) {
          this.loading = true
          return new Promise((resolve, reject) => {
            updateAdminPassword({
              username: this.selectedUsername,
              password: this.passForm.password
            }).then(response => {
              console.log(response)
              this.loading = false
              this.isVisibleChange = false
              this.selectedUsername = ''
              this.$message({
                message: 'Амжилттай өөрчлөгдлөө.',
                type: 'success'
              })
              this.fetchUsers()
              resolve()
            }).catch(error => {
              console.log(error)
              this.loading = false
              this.$message({
                message: 'Хадгалах хүсэлт амжилтгүй боллоо. \n',
                type: 'warning'
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
    selectUser(index, row) {
      this.$alert('Та зөвшөөрч байна уу?', 'Зөвшөөрөл', {
        confirmButtonText: 'Тийм',
        callback: action => {
          if (action === 'confirm') {
            this.deleteUser(row.username)
          }
        }
      })
    },
    deleteUser(username) {
      this.loading = true
      if (username !== 'admin') {
        return new Promise((resolve, reject) => {
          deleteAdmin({
            username: username
          }).then(response => {
            console.log(response)
            this.loading = false
            this.$message({
              message: 'Амжилттай устгагдлаа.',
              type: 'success'
            })
            this.isVisibleDelete = false
            this.fetchUsers()
            resolve()
          }).catch(error => {
            console.log(error)
            this.isVisibleDelete = false
            this.loading = false
            this.$message({
              message: 'Устгах хүсэлт амжилтгүй боллоо.',
              type: 'warning'
            })
          })
        })
      } else {
        this.isVisibleDelete = false
        this.loading = false
        this.$message({
          message: 'Админыг устгаж чадахгүй!',
          type: 'warning'
        })
        return null
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
