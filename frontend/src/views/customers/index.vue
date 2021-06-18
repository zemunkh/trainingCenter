<template>
  <div class="app-container">
    <h2>Нийт үйлчлүүлэгчид</h2>
    <el-row>
      <el-col :span="24">
        <el-table
          v-loading="listLoading"
          :data="list"
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
          <el-table-column label="Овог" width="110" align="center">
            <template slot-scope="scope">
              {{ scope.row.lastname }}
            </template>
          </el-table-column>
          <el-table-column label="Нэр" width="110" align="center">
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
          <el-table-column label="Харъяа алба" width="110" align="center">
            <template slot-scope="scope">
              {{ scope.row.department }}
            </template>
          </el-table-column>
          <el-table-column label="Шинжилгээ хүчинтэй огноо" width="110" align="center">
            <template slot-scope="scope">
              {{ displayDate(scope.row.testedDate) }}
            </template>
          </el-table-column>
          <el-table-column label="Утасны дугаар" width="110" align="center">
            <template slot-scope="scope">
              {{ scope.row.phoneNumber }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import axios from 'axios'
import moment from 'moment'

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
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchCustomers()
  },
  methods: {
    fetchCustomers() {
      this.listLoading = true
      axios.get('/api/customers').then(
        response => {
          this.list = response.data.data
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
</style>

