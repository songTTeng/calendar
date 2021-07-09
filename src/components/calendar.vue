<template>
  <div class="calendar-wrap">
    <div class="choose_year">
      <div class="icon" @click="chooseYears(-1)">
        <i class="el-icon-d-arrow-left"></i>
      </div>
      <div class="icon" @click="chooseMonth(-1)">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div class="date">{{ year }}年{{ month.toString().padStart(2, '0') }}月</div>
      <div class="icon" @click="chooseMonth(1)">
        <i class="el-icon-arrow-right"></i>
      </div>
      <div class="icon" @click="chooseYears(1)">
        <i class="el-icon-d-arrow-right"></i>
      </div>
    </div>
    <div class="lunar-detail-date">
      {{ lunarDetail.lunarYear.substring(0,2) }}-【
      {{ lunarDetail.zodiac }}】年
      {{ lunarDetail.dateStr.substring(0,2) }}{{ lunarDetail.dateStr.substring(2,lunarDetail.dateStr.length) }}
    </div>
    <div class="days_area">
      <div class="day week" v-for="week in weeks" :key="week">{{ week }}</div>
      <div
        class="relativeDay"
        :class="(item.gregorian && item.gregorian === today) ? 'day choose_day' : item.gregorian ? 'day' : 'noDay'"
        @click="chooseThisDay(item)"
        v-for="(item, index) in days"
        :key="index"
      >
        <p>{{ item.gregorian }}</p>
        <span class="lunarSpan" style="color:#f00;" v-if="item.solarTerm">{{ item.solarTerm }}</span>
        <span class="lunarSpan" v-else>{{ item.lunar }}</span>
         <!-- 如果需要在页面上展示自定的数据 在这里-->
        <!-- <template v-for="(x,y) in comparisonData">
          <div class="absoluteDiv" :key="y" v-if="item.comparisonDate === x.comparisonDate"></div>
        </template> -->
      </div>
    </div>
  </div>
</template>

<script>
import { getLunar } from 'chinese-lunar-calendar' // 处理成阴历的方法 st
export default {
  name: 'Calendar',
  props: {
    currentDate: {
      type: String,
      default: ''
    },
    // 需要比对的数据
    comparisonData: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      year: 0,
      month: 0,
      today: 0,
      days: [],
      weeks: ['一', '二', '三', '四', '五', '六', '日']
    }
  },
  computed: {
    selectDate () {
      return `${this.year}-${this.month.toString().padStart(2, '0')}-${
        this.today
      }`
    },
    lunarDetail () {
      // 如果是初始化this.year this.month this.today 为0的时候默认赋值 不然会报错
      // 接受格式 getLunar(2021,7,6)
      // 输出结构
      // { dateStr: "五月廿七"  //农历中文
      //   isLeap: false   //是否闰月
      //   lunarDate: 27   //农历日期
      //   lunarMonth: 5  //农历月份
      //   lunarYear: "辛丑年"  //农历年份，年以正月初一开始
      //   solarTerm: null  //节气，null代表没有
      //   zodiac: "牛"  //生肖，生肖以正月初一开始
      //   }
      return getLunar(
        this.year == 0 ? new Date().getFullYear() : this.year,
        this.month == 0 ? new Date().getMonth() + 1 : this.month,
        this.today == 0 ? new Date().getDate() : this.today
      )
    }
  },
  mounted () {
    const now = new Date()
    this.year = now.getFullYear()
    this.month = now.getMonth() + 1
    this.today = now.getDate()
    this.getDays()
  },
  methods: {
    getDays () { // 获取当前月份所有公历日期及其农历日期
      this.days = []
      const day = new Date()
      day.setFullYear(this.year, this.month - 1, 1) // 此处较之前调整，获取当月第一天
      const month = new Date()
      month.setFullYear(this.year, this.month, 0) // 此处较之前调整，获取当月
      for (let i = 1; i < day.getDay(); i++) { // 当月第一天距离所在周周一的空白占位
        // gregorian 天数 lunar阴历时间 solarTerm气节 year年 month月 day日 comparisonDate需要比对的数据(需要自定义)
        this.days.push({ gregorian: '', lunar: '', solarTerm: '', year: '', month: '', day: '', comparisonDate: '' })
      }
      for (let i = 1; i <= month.getDate(); i++) { // 获取当月天数填充日历
        const lunar = getLunar(this.year, this.month, i) ? getLunar(this.year, this.month, i).dateStr.substring(getLunar(this.year, this.month, i).dateStr.length - 2) : ''
        const solarTerm = getLunar(this.year, this.month, i) ? getLunar(this.year, this.month, i).solarTerm : ''
        const comparisonDate = this.year + '-' + (this.month > 9 ? this.month : '0' + this.month) + '-' + (i > 9 ? i : '0' + i)
        this.days.push({
          gregorian: i,
          lunar: lunar,
          solarTerm: solarTerm,
          year: this.year,
          month: this.month > 9 ? this.month : '0' + this.month,
          day: i > 9 ? i : '0' + i,
          comparisonDate: comparisonDate
        })
      }
    },
    chooseYears (state) { // 改变年份
      this.year += state
      this.today = 1
      this.getDays()
      this.$emit('selectDate', 'year', this.selectDate)
    },
    chooseMonth (state) { // 改变月份
      this.month += state
      this.today = 1
      if (this.month < 1) {
        this.month = 12
        this.chooseYears(-1)
      } else if (this.month > 12) {
        this.month = 1
        this.chooseYears(1)
      } else {
        this.getDays()
      }
      this.$emit('selectDate', 'month', this.selectDate)
    },
    chooseThisDay (item) { // 选择某天，主要是考虑可以当时间选择器用
      if (item.gregorian > 0) {
        this.today = item.gregorian
        this.$emit('selectDate', 'day', item.comparisonDate)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.calendar-wrap {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .choose_year {
    display: flex;
    .icon {
      width: 10%;
      height: 32px;
      line-height: 32px;
      text-align: center;
    }
    .date {
      width: 60%;
      text-align: center;
      height: 32px;
      line-height: 32px;
      font-size: 14px;
    }
  }
  .lunar-detail-date {
    text-align: center;
    color: #ff6800;
    font-size: 12px;
  }
  .days_area {
    display: flex;
    flex-wrap: wrap;
    .day {
      width: 14.28%;
      line-height: 27px;
      text-align: center;
      cursor: pointer;
      color: #666;
      margin-bottom: 5px;
      &:hover {
        background-color: #3794ff;
        color: #fff;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
      }
      p {
        margin: 0;
        font-size: 13px;
        line-height: 20px;
        font-weight: 600;
      }
      span {
        font-size: 12px;
      }
    }
    .noDay{
      width: 14.28%;
      line-height: 27px;
      text-align: center;
      cursor: pointer;
      color: #666;
      margin-bottom: 5px;
    }
    .relativeDay{
      position: relative;
      .absoluteDiv{
        position: absolute;
        top: 3px;
        right: 3px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #ff6800;
      }
    }
    .week {
      background-color: #fff;
      color: #19233c;
      font-weight: bold;
      font-size: 13px;
      height: 34px;
      line-height: 34px;
      margin: 0;
    }
    .choose_day {
      border: 1px solid #3794ff;
      color: #3794ff;
      font-weight: bold;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
      span {
        color: #3794ff;
      }
      p {
        color: #3794ff;
      }
      &:hover{
        span {
          color: #fff;
        }
        p {
          color: #fff;
        }
      }
    }
  }
  .bottom-btn {
    text-align: right;
    span {
      padding: 4px 8px;
      margin-right: 5px;
      cursor: pointer;
      border: 1px solid #999;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
      &:hover {
        color: #3794ff;
        border: 1px solid #3794ff;
      }
    }
  }
}
</style>
