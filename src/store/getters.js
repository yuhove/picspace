const getters = {
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    adminToken: state => state.user.adminToken,
    adminInfo: state => state.user.adminInfo,
  }
  export default getters
  