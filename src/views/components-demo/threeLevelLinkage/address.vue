<template>
  <el-row class="address-container">
      <el-select clearable class="filter-item" style="width: 120px" v-model="selectInfo.provice.name" placeholder="省">
        <el-option v-for="item in select.provice" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-select clearable class="filter-item" style="width: 120px" v-model="selectInfo.city.name" placeholder="市">
        <el-option v-for="item in select.city" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-select clearable class="filter-item" style="width: 120px" v-model="selectInfo.town.name" placeholder="县、区">
        <el-option v-for="item in select.town" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
  </el-row>
</template>

<script>
  import addressData from './address.json'

  export default {
    props: [
      'data'
    ],
    data() {
      return {
        select: {
          provice: [],
          city: [],
          town: []
        },
        selectInfo: {
          provice: {
            id: '',
            name: ''
          },
          city: {
            id: '',
            name: ''
          },
          town: {
            id: '',
            name: ''
          }
        },
        addressData
      }
    },
    created() {
      this.index()
    },
    watch: {
      'selectInfo.provice.name'(newval, oldval) {
        this.selectInfo.city = { id: '', name: '' }
        this.select.city = []
        this.selectInfo.town = { id: '', name: '' }
        this.select.town = []

        this.$emit('addressHello', false)
        if (newval === '') {
          this.selectInfo.provice.id = ''
          return
        } else {
          this.addressData.forEach((value, index) => {
            if (value.name === newval) {
              this.selectInfo.provice = {
                id: value.id,
                name: value.name
              }
              this.select.city = []
              if (!value.child || value.child.length === 0) {
                this.$emit('addressHello', this.selectInfo)
                return
              }
              value.child.forEach((value, index) => {
                this.select.city.push(value.name)
              })
              return
            }
          })
        }
      },
      'selectInfo.city.name'(newval, oldval) {
        this.selectInfo.town = {
          id: '',
          name: ''
        }
        this.select.town = []

        this.$emit('addressHello', false)
        if (newval === '') {
          this.selectInfo.city.id = ''
          return
        } else {
          this.addressData.forEach((value, index) => {
            if (value.name === this.selectInfo.provice.name) {
              this.select.town = []
              value.child.forEach((value, index) => {
                if (value.name === newval) {
                  this.selectInfo.city = {
                    id: value.id,
                    name: value.name
                  }
                  if (!value.child || value.child.length === 0) {
                    this.$emit('addressHello', this.selectInfo)
                    return
                  }
                  value.child.forEach((value, index) => {
                    this.select.town.push(value.name)
                  })
                  return
                }
              })
            }
          })
        }
      },
      'selectInfo.town.name'(newval, oldval) {
        if (newval === '') {
          this.selectInfo.town.id = ''
          this.$emit('addressHello', false)
          return
        } else {
          this.addressData.forEach((value, index) => {
            if (value.name === this.selectInfo.provice.name) {
              value.child.forEach((value, index) => {
                if (value.name === this.selectInfo.city.name) {
                  value.child.forEach((value, index) => {
                    if (value.name === newval) {
                      this.selectInfo.town = {
                        id: value.id,
                        name: value.name
                      }
                    }
                  })
                }
              })
            }
          })
          this.$emit('addressHello', this.selectInfo)
        }
      }
    },
    methods: {
      index() {
        if (this.data && this.data !== '') {
          console.log(this.data)
        }
        this.addressData.forEach((value, index) => {
          this.select.provice.push(value.name)
        })
      }
    },
    changeProvice(data) {
      console.log(data)
    }
  }
</script>
<style scoped>
  .address-container>div{
    margin-right: 5px;
    width: 30.5%;
    float: left;
  }
</style>
