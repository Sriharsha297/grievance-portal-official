export const login = ({fullName,email,districtName,zoneName,phoneNumber,role,token}) => ({
    type: 'USER_LOGIN',
    fullName,
    email,
    // districtName,
    // zoneName,
    phoneNumber,
    role,
    token,
})
export const logout = () => ({
    type: 'USER_LOGOUT'
})