import { combineReducers } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice';
import quotationsReducer from '../features/quotations/quotationsSlice';
import appReducer from '../features/app/appSlice';


const rootReducer = combineReducers({
    auth: authReducer,
    quotations: quotationsReducer,
    app: appReducer
})

export default rootReducer;