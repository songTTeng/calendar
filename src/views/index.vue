<!-- 日历 -->
<template>
  <div>
    <h2 style="text-align:center;margin:20px 0;">带阴历以及节气的日历</h2>
    <div class="main">
      <calendar-wrap :comparisonData="comparisonData" @selectDate="selectDate" />
    </div>
  </div>
</template>
<script>
import calendarWrap from "@/components/calendar"
export default {
  components: {
    calendarWrap
  },
  data () {
    return {
      comparisonData: []
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    selectDate (type, date) {
      // type区分是哪个事件 date是数据
      console.log(type, date)

    }
  }
}
</script>
<style lang='scss' scoped>
.main {
  width: 500px;
  margin: 0 auto;
  background: #ffffff;
  box-shadow: 0px 0px 6px rgba(157, 157, 157, 0.16);
  border-radius: 6px;
  padding: 6px 8px;
}
</style>