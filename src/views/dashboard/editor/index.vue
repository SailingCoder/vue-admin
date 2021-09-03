<template>
  <div class="dashboard-editor-container">
    <div class="clearfix">
      <div class="info-container">
        <span class="display_name">后台管理中心</span>
        <span style="font-size:20px;padding-top:20px;display:inline-block;">欢迎您登录</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'dashboard-editor',
    components: {},
    data() {
      return {
      }
    },
    computed: {
      ...mapGetters([
        'name',
        'avatar',
        'roles'
      ])
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .emptyGif {
    display: block;
    width: 45%;
    margin: 0 auto;
  }

  .dashboard-editor-container {
    background-color: #ffffff;
    min-height: 100vh;
    margin-top: -50px;
    padding: 100px 60px 0px;
  .pan-info-roles {
    font-size: 12px;
    font-weight: 700;
    color: #333;
    display: block;
  }
  .info-container {
    position: relative;
    margin-left: 190px;
    height: 150px;
    line-height: 200px;
  .display_name {
    font-size: 40px;
    line-height: 48px;
    color: #212121;
    position: absolute;
    top: 25px;
  }
  }
  }
</style>
