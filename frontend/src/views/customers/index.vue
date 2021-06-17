<template>
  <div class="app-container">
    <h2>СПОРТЫН ТАНХИМ</h2>
    <el-row>
      <el-col :span="20">
        <el-input v-model="firstname" placeholder="Нэрээр хайх" style="width:100%;" />
      </el-col>
      <el-col :span="4">
        <el-button :loading="loading" type="primary" style="width:100%; margin-bottom:30px;" @click.native.prevent="handleSearch">Нэвтрэх</el-button>
      </el-col>
    </el-row>
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

    <el-dialog title="Хайлтын үр дүн" :visible.sync="isVisible">
      <p>{{ result }}</p>
      <!-- <el-table :data="result">
        <el-table-column property="date" label="Date" width="150"></el-table-column>
        <el-table-column property="name" label="Name" width="200"></el-table-column>
        <el-table-column property="address" label="Address"></el-table-column>
      </el-table> -->
    </el-dialog>
  </div>
</template>

<script>

// import { fetchCustomersList } from '@/api/user'
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
      loading: false,
      firstname: '',
      result: null,
      listLoading: true,
      isVisible: false
    }
  },
  created() {
    this.fetchCustomers()
  },
  methods: {
    fetchCustomers() {
      console.log('Fetching.......')
      this.listLoading = true
      axios.get('http://localhost:3000/api/customers').then(
        response => {
          this.list = response.data.data
          this.listLoading = false
          console.log('List: ', response.data.data)
        }).catch(error => {
        console.log('Error: ', error)
        this.listLoading = false
      })
      // fetchCustomersList(response => {
      //   this.list = response.data
      //   this.listLoading = false
      //   console.log('List: ', response.data)
      // }).catch(error => {
      //   console.log('Error: ', error)
      //   this.listLoading = false
      // })
      // Fetch  all the customers to show on table
    },
    handleSearch(e) {
      e.preventDefault()
      if (this.firstname.length > 0) {
        this.loading = true
        axios.get('/imcaa', {
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': '*'
          },
          params: {
            firstname: this.firstname,
            code: 'pass_code'
          }
        }).then(
          response => {
            this.isVisible = true
            this.result = response.data
            console.log('Result: ', response.data)
            this.loading = false
          }).catch(error => {
          console.log('Error: ', error)
        this.$message({
          message: 'Алдаатай хүсэлт',
          type: 'warning'
        })
          this.loading = false
        })
      } else {
        this.$message({
          message: 'Хэт богино байна',
          type: 'warning'
        })
      }
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

