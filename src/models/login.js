export default {
  namespace: 'login',
  state: {
    admin: false,
    userId: undefined,
    username: undefined,
  },
  subscriptions: {
    setup({ dispatch, history }) {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      // yield call(...); // 调用异步逻辑
      // yield put({ type: 'save', payload: response }); // 触发reducers的save方法
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
