import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import Dashboards from './components/dashboards/Dashboards';
import Users from './components/information/Users'
import Restaurants from './components/information/Restaurants'
import Foods from './components/information/Foods'
import Notification from './components/information/Notification'
import HistoryFiles from './components/information/HistoryFiles'
import Discount from './components/incomes/Discount'
import ReportUsers from './components/alarm/ReportUsers';
import ReportFoods from './components/alarm/ReportFoods';
import ReportRestaurants from './components/alarm/ReportRestaurants'
import ReportApp from './components/alarm/ReportApp';
import Login from './components/account/Login';
import Orders from './components/incomes/Orders';
import { useState } from 'react';
import ForgotPass from './components/account/ForgotPass';
import Staffs from './components/employees/Staff';


function App() {
  const host = 'http://192.168.1.6:8686';
  const getIdFromLocalStorage = () => {
    const id = localStorage.getItem('id')
    if (id) return JSON.parse(id)
    return null
  }

  const setIdToLocalStorage = (id) => {
    setID(id);  // Set the Id in the state first
    localStorage.setItem('id', JSON.stringify(id));
  }

  const [id, setID] = useState(getIdFromLocalStorage())

  const ProtectedLayout = () => {
    if (!id) {
      return <Navigate to="/login/signin" />;
    }
    return (<Outlet />);
  }

  const UnprotectedLayout = () => {
    if (id) {
      return <Navigate to="/" />;
    }
    return (<Outlet />);
  }
  return (
    <Router>
      <Routes>
        <Route element={<UnprotectedLayout />} >
          <Route path="/login/signin" element={<Login setID={setIdToLocalStorage} />} />
          <Route path="/login/forgot-password" element={<ForgotPass/>} />
        </Route>
        <Route element={<ProtectedLayout />} >
          <Route path="/" element={<Dashboards host={host} adminID={id} />} />
          <Route path="/informations/users" element={<Users host={host} adminID={id} />} />
          <Route path="/informations/restaurants" element={<Restaurants host={host} adminID={id} />} />
          <Route path="/informations/foods" element={<Foods host={host} adminID={id} />} />
          <Route path="/informations/notifications" element={<Notification host={host} adminID={id} />} />
          <Route path="/informations/history-files" element={<HistoryFiles host={host} adminID={id} />} />
          <Route path="/incomes/discount" element={<Discount host={host} adminID={id} />} />
          <Route path="/incomes/orders" element={<Orders host={host} adminID={id} />} />
          <Route path="/reports/report-users" element={<ReportUsers host={host} adminID={id} />} />
          <Route path="/reports/report-foods" element={<ReportFoods host={host} adminID={id} />} />
          <Route path="/reports/report-restaurants" element={<ReportRestaurants host={host} adminID={id} />} />
          <Route path="/reports/report-errors" element={<ReportApp host={host} adminID={id} />} />
          <Route path="/informations/staffs" element={<Staffs host={host} adminID={id} setID={setIdToLocalStorage} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
