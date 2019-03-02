const fullName = localStorage.getItem('fullName');
const email = localStorage.getItem('email');
//const districtName = localStorage.getItem('districtName');
//const zonename = localStorage.getItem('zoneName');
const phoneNumber = localStorage.getItem('phoneNumber');
const role = localStorage.getItem('role');
const token = localStorage.getItem('token');

const DefaultuserState = {
    fullName: !!fullName ? fullName : '',
    email: !!email ? email : '',
    //districtName: !!districtName ? districtName : '',
    //zoneName: !!zonename ? zonename : '',
    phoneNumber: !!phoneNumber ? phoneNumber : '',
    role: !!role ? role :'',
    token: !!token ? token:'',
}

export default (state = { DefaultuserState }, action) => {
    switch (action.type) {
        case 'USER_LOGIN':
            return {
                ...state,
                fullName: action.fullName,
                email: action.email,
                //districtName: action.districtName,
                //zoneName: action.zoneName,
                phoneNumber: action.phoneNumber,
                role: action.role,
                token:action.role,
            }
        case 'USER_LOGOUT':
            return {
                ...state,
                fullName : '',
                email : '',
                //districtName : '',
                //zoneName: '',
                phoneNumber : '',
                role:'',
                token:'',
            }
        default:
            return state;
    }
}