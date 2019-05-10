<template>
  <div class="community-container">

  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },

  created: function () {
    this.$router.push(decodeURIComponent(this.$route.query.path))
  },
  methods: {

  },
}
</script>

<style>
  .community-container {
    margin: 0 auto;
    width: 7.5rem;
  }
  .community-header {
    width: 7.5rem;
  }
  .community-header-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    padding: 0 .15rem;
    height: .525rem;
    background: #c5aa72;
    color: #fff;
  }
  .community-header-back-btn, .community-header-text, .community-header-manage {
    overflow: hidden;
    display: flex;
    align-items: center;
    height: .525rem;
    font-size: .18rem;
  }
  .community-header-back-btn {
    height: .255rem;
    width: .1425rem;
    cursor: pointer;
  }
  .community-info-items, .community-info-item {
    overflow: hidden;
    width: 7.5rem;
  }
  .community-info-item {
    padding: 0 .15rem;
    border-bottom: .075rem solid #ccc;
  }
  .community-info-item-top {
    overflow: hidden;
    display: flex;
    align-items: center;
    height: .66rem;
    cursor: pointer;
  }
  .community-info-item-head {
    overflow: hidden;
    width: .42rem;
    height: .42rem;
    border-radius: 50%;
  }
  .community-info-item-head img {
    width: 100%;
    height: 100%;
  }
  .community-info-item-person {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: .42rem;
    margin-left: .15rem;
  }
  .community-info-item-name {
    font-size: .165rem;
    font-weight: 600;
    color: #333;
  }
  .community-info-item-time {
    font-size: .12rem;
    color: #a8a8a8;
  }
  .community-info-item-center {
    overflow: hidden;
    min-height: 4.17rem;
    cursor: pointer;
  }
  .community-info-item-cover {
    overflow: hidden;
    height: 3.63rem;
    border-radius: .045rem;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }
  .community-info-item-title {
    overflow: hidden;
    height: .45rem;
    line-height: .45rem;
    font-size: .15rem;
    color: #0d0d0d;
    font-weight: 600;
  }
  .community-info-item-tip {
    overflow: hidden;
    min-height: .135rem;
    line-height: .135rem;
    font-size: .135rem;
    color: #a0a0a0;
  }
  .community-info-item-bottom {
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: .15rem;
    height: .6rem;
    border-top: 1px solid #ccc;
  }
  .community-info-item-label {
    padding: .03rem .045rem;
    font-size: .12rem;
    color: #ccb37b;
    border: 1px solid #ccb37b;
    border-radius: .0425rem;
    cursor: pointer;
  }
  .community-info-item-other {
    display: flex;
    align-items: center;
  }
  .community-info-item-good {
    display: flex;
    align-items: center;
    height: .18rem;
    font-size: .135rem;
    color: #929292;
  }
  .community-info-item-good img {
    height: 100%;
    width: auto;
    margin-right: .06rem;
    font-size: .12rem;
    cursor: pointer;
  }
  .community-info-item-share img {
    margin-top: .0225rem;
    margin-left: .165rem;
    height: .18rem;
    width: auto;
    cursor: pointer;
  }
  .community-footer-sup-height {
    overflow: hidden;
    height: .99rem;
  }
</style>
