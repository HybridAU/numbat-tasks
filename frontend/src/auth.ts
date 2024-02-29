import createStore from 'react-auth-kit/createStore';
import createRefresh from 'react-auth-kit/createRefresh';

// TODO figure out refresh token works, this looks like it should work, but it doesnt.
const refreshToken = createRefresh({
  interval: 10,
  refreshApiCallback: async (param) => {
    const response = await fetch(
      '/api/token/refresh/',
      {
        headers: {
          Authorization: `Bearer ${param.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: param.refreshToken }),
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
  refresh: refreshToken,
});

export default store;
