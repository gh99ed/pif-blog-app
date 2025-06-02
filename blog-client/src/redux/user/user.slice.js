import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isLoggedIn: false,
    user: {},
    token: '', 
  };
  
  export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      setUser: (state, action) => {
        const { user, token } = action.payload;
        state.isLoggedIn = true;
        state.user = user;
        state.token = token; 
      },
      removeUser: (state) => {
        state.isLoggedIn = false;
        state.user = {};
        state.token = '';
      },
      
    },
  });
  

export const { setUser, removeUser } = userSlice.actions
export default userSlice.reducer