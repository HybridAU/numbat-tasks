import createStore from 'react-auth-kit/createStore';
import createRefresh from 'react-auth-kit/createRefresh';

const refresh = createRefresh({
  interval: 10,
  refreshApiCallback: async (param) => {
    const response = await fetch(
      '/api/token/refresh/',
      {
        headers: {
          Authorization: `Bearer ${param.authToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.ok) {
      const result = await response.json();
      return {
        isSuccess: true,
        newAuthToken: result.access,
      };
    }
    return {
      isSuccess: false,
      newAuthToken: '',
    };
  },
});

const store = createStore({
  authName: 'token',
  authType: 'localstorage',
  refresh,
});

export default store;
