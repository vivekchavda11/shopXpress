import Login from './Login'

const UserProvider = ({children}) => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")

    if(!token) return <Login to="/login" />
    if(role !== "user") return <h1 className='text-center mt-5 fw-bold'>You are not authorized to access this page..!</h1>
  return children;
}

export default UserProvider
