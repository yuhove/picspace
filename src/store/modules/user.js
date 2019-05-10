import {setStore,getStore} from '@/config/mUtils';
const state = {
  adminInfo: {
    avator:'http://img.52z.com/upload/news/image/20180528/20180528111619_71841.jpg',
    userName:'',
    isok:false,
    manage:[],
  },
  adminToken:getStore('login_token'),
}

const mutations = {
  saveAdminpic(state, adminInfo){
    state.adminInfo = adminInfo;
  },
  saveAdmintoken(state, adminInfo){
    state.admin_token=adminInfo;
  },
}
const actions = {
  getAdmintoken({ commit }, view) {
    commit('saveAdmintoken', view);
  },
  getAdminData({ commit }, view){
     commit('saveAdminpic',view);
  },
}

export default {
  namespaced: true,
	state,
	actions,
	mutations,
}
