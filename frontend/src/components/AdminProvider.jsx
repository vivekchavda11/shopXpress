import Login from './Login'

const AdminProvider = ({children}) => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")

    if(!token) return <Login to="/login" />
    if(role !== "admin") return <h1 className='text-center mt-5 fw-bold'>You are not authorized to access this page..!</h1>
    // if(role !== "admin") return <h1 className='text-center mt-5 fw-bold'>You are not authorized to access this page..!</h1>
  return children;
}

export default AdminProvider
