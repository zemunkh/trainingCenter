<template>
  <div class="app-container">
    <h3>Админ панел</h3>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'Admin',
  data() {
    return {
      adminInfo: {
        username: '',
        password: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'is_admin'
    ])
  },
  methods: {
    getUsers() {
      console.log('Getting user!')
    }
  }
}
</script>
