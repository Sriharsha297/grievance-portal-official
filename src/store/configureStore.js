import { createStore , combineReducers } from 'redux';
import User from "../reducers/User";

export default () => {
    const store = createStore(
        combineReducers({
            User:User
        })
    );
    return store;
}