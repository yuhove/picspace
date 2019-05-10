<template>
  <div class="common-empty-container">
    <div class="common-empty-center">
      <div class="common-empty-center-box">
        <div class="common-empty-img">
          <img src="~/static/common/adress_nodata_icon@2x.png" alt="/">
        </div>
        <p class="common-empty-tip">暂无数据哦~</p>
      </div>
    </div>
    <router-link v-if="btnText" :to="btnLink" class="common-empty-add-btn">{{btnText}}</router-link>
  </div>
</template>

<script>
export default {
  props: ['btnText', 'btnLink']
}
</script>

<style>
  .common-empty-container {
    position: fixed;
    width: 7.5rem;
    height: 100%;
    background: #d7d7d7;
  }
  .common-empty-center {
    position: relative;
    width: 7.5rem;
    height: 100%;
  }
  .common-empty-tip {
    margin: .15rem 0 0.375rem;
    height: .18rem;
    line-height: .18rem;
    font-size: .18rem;
    color: #7f7f7f;
  }
  .common-empty-center-box {
    position: absolute;
    top: 0;
    bottom: 136px;
    left: 0;
    right: 0;
    margin: auto;
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .common-empty-add-btn {
    overflow: hidden;
    position: absolute;
    bottom: .66rem;
    z-index: 30;
    height: .375rem;
    width: 7.5rem;
    line-height: .375rem;
    text-align: center;
    font-size: .225rem;
    color: #fff;
    background: #f39801;
    cursor: pointer;
  }
  .common-empty-add-btn:link, .common-empty-add-btn:visited{
    text-decoration: none;  /*超链接无下划线*/
  }
</style>
