import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import About from "./components/About";
import Contact from "./components/Contact";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Product from "./pages/Product";
import ProductDetails from "./pages/ProductDetails";
import Login from "./components/Login";
import Register from "./components/Register";
import Cart from "./components/Cart";
import UserProvider from "./components/UserProvider";

//Admin Components
import AdminLayout from "./admin/components/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import ProductList from "./admin/pages/Products/ProductList";
import AddProduct from "./admin/pages/Products/AddProduct";
import OrderList from "./admin/pages/Orders/OrderList";
import UserList from "./admin/pages/Users/UserList";
import AdminProvider from "./components/AdminProvider";
import CategoryList from "./admin/pages/Categories/CategoryList";
import OrderHistory from "./components/OrderHistory";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index path="/" element={<Home />}></Route>
            <Route path="/about" element={<About />}></Route>
            <Route path="/contact" element={<Contact />}></Route>
            <Route
              path="/cart"
              element={
                <UserProvider>
                  <Cart />
                </UserProvider>
              }
            ></Route>
            <Route path="/products" element={<Product />}></Route>
            <Route path="/products/:id" element={<ProductDetails />}></Route>
            <Route path="/orders" element={<UserProvider>
                  <OrderHistory />
                </UserProvider>} />
            <Route path="/register" element={<Register />}></Route>
            <Route path="/login" element={<Login />} />
          </Route>



          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminProvider>
                <AdminLayout />
              </AdminProvider>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/add" element={<AddProduct />} />
            {/* <Route path="products/edit/:id" element={<EditProduct />} /> */}
            <Route path="categories" element={<CategoryList />}></Route>
            <Route path="orders" element={<OrderList />} />
            <Route path="users" element={<UserList />} />
          </Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
// import React from 'react'
// import Payment from './Payment'
// import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";

// const App = () => {
//   return (
//     <div>
//       <Payment />
      
//     </div>
//   )
// }

// export default App
