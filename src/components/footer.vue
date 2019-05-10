<template>
  <div class="public-footer-container">
    <div class="public-footer-page-btn-box">
      <div v-show="!showArr[0]" class="public-footer-page-index-btn public-footer-page-btn" @click="handleClickHome">
        <div class="public-footer-page-btn-img-box">
          <img class="public-footer-page-btn-img" src="../../static/index/home_tab__icon1@2x.png" alt="/">
        </div>
        <p class="public-footer-page-text">首页</p>
      </div>
      <div v-show="showArr[0]" class="public-footer-page-index-btn public-footer-page-btn">
        <div class="public-footer-page-btn-img-box">
          <img class="public-footer-page-btn-img" src="../../static/index/home_tab__icon1-1@2x.png" alt="/">
        </div>
        <p class="public-footer-page-text public-footer-active-title">首页</p>
      </div>
      <div v-show="!showArr[1]" class="public-footer-page-personal-btn public-footer-page-btn" @click="handleClickCommunity">
        <div class="public-footer-page-btn-img-box">
          <img class="public-footer-page-btn-img" src="../../static/index/home_tab__icon4@2x.png" alt="/">
        </div>
        <p class="public-footer-page-text">社区</p>
      </div>
      <div v-show="showArr[1]" class="public-footer-page-personal-btn public-footer-page-btn">
        <div class="public-footer-page-btn-img-box">
          <img class="public-footer-page-btn-img" src="../../static/index/home_tab__icon4-2@2x.png" alt="/">
        </div>
        <p class="public-footer-page-text public-footer-active-title">社区</p>
      </div>
      <div v-show="!showArr[2]" class="public-footer-page-personal-btn public-footer-page-btn" @click="handleClickPersonal">
        <div class="public-footer-page-btn-img-box">
          <img class="public-footer-page-btn-img" src="../../static/index/home_tab__icon2@2x.png" alt="/">
        </div>
        <p class="public-footer-page-text">个人中心</p>
      </div>
      <div v-show="showArr[2]" class="public-footer-page-personal-btn public-footer-page-btn">
        <div class="public-footer-page-btn-img-box">
          <img class="public-footer-page-btn-img" src="../../static/index/home_tab__icon2-2@2x.png" alt="/">
        </div>
        <p class="public-footer-page-text public-footer-active-title">个人中心</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['userId'],

  data () {
    return {
      showArr: [true, false, false]
    }
  },

  methods: {
    handleClickHome () {
      if (this.$route.query.label && this.$route.query.value) {
        this.$router.push({
          path: '/home',
          query: {
            label: this.$route.query.label,
            value: this.$route.query.value
          }
        });
      } else {
        this.$router.push({ path: '/home' });
      }
    },
    handleClickPersonal () {
      if (this.$route.query.label && this.$route.query.value) {
        this.$router.push({
          path: '/personal',
          query: {
            label: this.$route.query.label,
            value: this.$route.query.value
          }
        });
      } else {
        this.$router.push({ path: '/personal' });
      }
    },
    handleClickCommunity () {
      if (this.$route.query.label && this.$route.query.value) {
        this.$router.push({
          path: '/community',
          query: {
            label: this.$route.query.label,
            value: this.$route.query.value
          }
        });
      } else {
        this.$router.push({ path: '/community' });
      }
    }
  },
  mounted () {
    if (this.$route.path.indexOf('home') !== -1) {
      this.showArr = [true, false, false];
    } else if (this.$route.path.indexOf('personal') !== -1) {
      this.showArr = [false, false, true];
    } else {
      this.showArr = [false, true, false];
    }
  }
}
</script>

<style>
  .public-footer-container {
    position: fixed;
    z-index: 20;
    bottom: 0;
    height: .99rem;
    width: 7.5rem;
    background: #fff;
    box-shadow: 0px -0.0375rem 0.045rem #d9d6d6;
  }
  .public-footer-page-btn-box {
    display: flex;
    justify-content: space-between;
  }
  .public-footer-page-btn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 1.75rem;
    height: .99rem;
    font-size: 0.2025rem;
    font-weight: 600;
    font-family: PingFangSC Regular;
    color: #666;
    cursor: pointer;
  }
  .public-footer-page-btn-img-box {
    width: .525rem;
    height: .495rem;
  }
  .public-footer-page-btn-img {
    height: 100%;
  }
  .public-footer-page-text {
    margin-top: .09rem;
    height: .21rem;
    line-height: .21rem;
  }
  .public-customer-service-btn {
    position: absolute;
    z-index: 1;
    top: -0.2625rem;
    left: 0;
    right: 0;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: .84rem;
    font-size: .2025rem;
    font-weight: 600;
    font-family: PingFangSC Regular;
    color: #666;
  }
  .public-footer-active-title {
    color: #f29804;
  }
</style>
