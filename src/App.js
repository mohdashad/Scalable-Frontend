import React from 'react';
import { BrowserRouter as Router, Routes, Route,useLocation  } from 'react-router-dom';
import Navbar from './components/Navbar';
import BookList from './components/Books/BookList';
import BookDetail from './components/Books/BookDetail';
import AddBook from './components/Books/AddBook';
import FAQ from './components/FAQ';
import UserLandingPage from './components/Auth/UserLandingPage';
import Register from './components/Auth/Register';
import ChangePassword from './components/Auth/ChangePassword';
import Login from './components/Auth/Login';
import ForgotPassword  from './components/Auth/ForgotPassword';
import Home from './components/Home';
import PrivateRoute from './components/Auth/PrivateRoute';
import BookExchange from './components/Exchanges/BookExchange';
import UserProfile from './components/Auth/UserProfile';
import Request from './components/Request/Request';
import Transaction from './components/Transaction/Transaction';



function App() {
  return (
    <Router>
      <Content />
    </Router>
  );
}

function Content() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {!isLoginPage && <Navbar />}
      <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/FAQ" element={<FAQ />} />
          <Route element={<PrivateRoute />}>  
           
            <Route path="/profile" element={<UserProfile />} />        
            <Route path="/dashboard" element={<UserLandingPage />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/add-book" element={<AddBook />} />
            <Route path="/exchanges" element={<BookExchange />} />
            <Route path="/changePassword" element={<ChangePassword />} />
            <Route path="/request" element={<Request />} />
            <Route path="/transaction/:transactionId" element={<Transaction />} />
                
                            
        </Route>
      </Routes>
    </>
  );
}

export default App;
