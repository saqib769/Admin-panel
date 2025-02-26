import logo from './logo.svg';
import './App.css';
import SignUp from './component/SignUp';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './component/Login';
import Profile from './component/Profile';
import ProductForm from './component/ProductForm';
import { ToastContainer } from 'react-toastify';
import Category from './component/Category';
import SubCategory from './component/SubCategory';
import Categorylist from './component/Categorylist';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Default route redirects to /signup */}
          <Route path="/" element={<Navigate to="/signup" />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/productform" element={<ProductForm />} />
          <Route path="/category" element={<Category />} />
          <Route path="/categorylist" element={<Categorylist />} />
          <Route path="/subcategory" element={<SubCategory />} />
         
         
        </Routes>
      </BrowserRouter>

      <ToastContainer />
    </>
  );
}

export default App;
