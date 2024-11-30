// Style
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/style.css';
import '../assets/js/main.js'

// SVG
import logo from '../assets/img/images/logo.svg';
import menu from '../assets/img/icons/menu.svg';
import search from '../assets/img/icons/search.svg';
import notify from '../assets/img/icons/notify.svg';
import chat_box from '../assets/img/icons/chat_box.svg'
import dashboard from '../assets/img/icons/dashboard.svg';
import infor from '../assets/img/icons/infor.svg';
import income from '../assets/img/icons/income.svg';
import dropdown from '../assets/img/icons/dropdown.svg';
import danger from '../assets/img/icons/danger.svg';
import employee from '../assets/img/icons/employee.svg';
import users from '../assets/img/icons/users.svg';
import send_notify from '../assets/img/icons/send_notify.svg';
import restaurant from '../assets/img/icons/restaurant.svg';
import food from '../assets/img/icons/food.svg';
import history from '../assets/img/icons/history.svg';
import discount from '../assets/img/icons/discount.svg';
import error from '../assets/img/icons/error.svg';
import report from '../assets/img/icons/report.svg';
import dot from '../assets/img/icons/dot.svg';
// Image
import avatar from '../assets/img/images/ex_avatar.png';

// Conponent
import React, { useEffect, useReducer, useRef } from 'react'
import { Navigate, useNavigate, useHref, Form } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import Swal from 'sweetalert2'

import AxiosInstance from '../helpers/AxiosInstance.js';


const Notification = (prop) => {
    const { adminID, host } = prop;
    document.title = 'Informations - Foods';
    const chartRef = useRef(null);
    const navigate = useNavigate();

    const changePage = (link) => {
        navigate(link);
    };

    const initialState = {
        notifyList: [],
        notifyListPage: 1,
        notifyListTotalPage: 1,
        notifyListSearch: '',

        notifyRestaurantList: [],
        notifyRestaurantListPage: 1,
        notifyRestaurantListTotalPage: 1,
        notifyRestaurantListSearch: '',

        notifyReceive: [],
        notifyRestaurantReceive: []
    }

    const [data, dispatchData] = useReducer((state, action) => {
        switch (action.type) {
            case 'NOTIFY_LIST':
                return { ...state, notifyList: action.payload }
            case 'SET_NOTIFY_LIST_PAGE':
                return { ...state, notifyListPage: action.payload }
            case 'SET_NOTIFY_LIST_TOTAL_PAGE':
                return { ...state, notifyListTotalPage: action.payload }
            case 'SET_NOTIFY_LIST_SEARCH':
                return { ...state, notifyListSearch: action.payload }

            case 'NOTIFY_RESTAURANT_LIST':
                return { ...state, notifyRestaurantList: action.payload }
            case 'SET_NOTIFY_RESTAURANT_LIST_PAGE':
                return { ...state, notifyRestaurantListPage: action.payload }
            case 'SET_NOTIFY_RESTAURANT_LIST_TOTAL_PAGE':
                return { ...state, notifyRestaurantListTotalPage: action.payload }
            case 'SET_NOTIFY_RESTAURANT_LIST_SEARCH':
                return { ...state, notifyRestaurantListSearch: action.payload }


            case 'NOTIFY_RECEIVE':
                return { ...state, notifyReceive: action.payload }
            case 'NOTIFY_RESTAURANT_RECEIVE':
                return { ...state, notifyRestaurantReceive: action.payload }
            default:
                return { ...state };
        }
    }, initialState)

    const validateForm = () => {
        // document.querySelector('form').addEventListener('submit', (event) => {
        //     event.preventDefault(); // Prevent form submission

        //     let title = document.getElementById('notification-title');
        //     let content = document.getElementById('notification-content');
        //     let select = document.querySelector('.form-select');

        //     // Validate title
        //     if (title.value.length < 10 || title.value.length > 50) {
        //         title.setCustomValidity('Title must be between 10 and 50 characters.');
        //     } else {
        //         title.setCustomValidity('');
        //     }

        //     // Validate content
        //     if (content.value.length < 10 || content.value.length > 300) {
        //         content.setCustomValidity('Content must be between 10 and 300 characters.');
        //     } else {
        //         content.setCustomValidity('');
        //     }

        //     // Validate select
        //     if (select.selectedOptions.length === 0) {
        //         select.setCustomValidity('You must select at least one option.');
        //     } else {
        //         select.setCustomValidity('');
        //     }

        //     // If the form is valid, you can submit it
        //     if (event.target.checkValidity()) {
        //         console.log("130")
        //     }
        // });
    }

    const getNotification = async () => {
        const response = await AxiosInstance().get('/get-all-notifications.php');
        const totalPage = Math.ceil(response.data.length / 10);
        const perPage = response.data.slice((data.notifyListPage) * 10 - 10, data.notifyListPage * 10);
        if (response.status) {
            dispatchData({ type: 'NOTIFY_LIST', payload: perPage })
            dispatchData({ type: 'SET_NOTIFY_LIST_TOTAL_PAGE', payload: totalPage })
        } else {
            dispatchData({ type: 'NOTIFY_LIST', payload: [] })
            dispatchData({ type: 'SET_NOTIFY_LIST_TOTAL_PAGE', payload: 1 })
        }
    }

    useEffect(() => {
        getNotification();
    }, [data.notifyListPage]);

    const getRestaurantNotification = async () => {
        const response = await AxiosInstance().get('/get-all-restaurant-notifications.php');
        const totalPage = Math.ceil(response.data.length / 10);
        const perPage = response.data.slice((data.notifyRestaurantListPage) * 10 - 10, data.notifyRestaurantListPage * 10);
        if (response.status) {
            dispatchData({ type: 'NOTIFY_RESTAURANT_LIST', payload: perPage })
            dispatchData({ type: 'SET_NOTIFY_RESTAURANT_LIST_TOTAL_PAGE', payload: totalPage })
        } else {
            dispatchData({ type: 'NOTIFY_RESTAURANT_LIST', payload: [] })
            dispatchData({ type: 'SET_NOTIFY_RESTAURANT_LIST_TOTAL_PAGE', payload: 1 })
        }
    }

    useEffect(() => {
        getRestaurantNotification();
    }, [data.notifyRestaurantListPage]);


    const getUserID = async () => {
        const response = await AxiosInstance().get('/get-all-users.php');
        if (response.status) {
            console.log("users", response.users)
            dispatchData({ type: 'NOTIFY_RECEIVE', payload: response.users })
        } else {
            dispatchData({ type: 'NOTIFY_RECEIVE', payload: [] })
        }
    }

    const getRestaurantID = async () => {
        const response = await AxiosInstance().get('/get-all-restaurants.php');
        const cal = Math.ceil(response.data.length / 10);
        if (response.status) {
            console.log(response.data)
            dispatchData({ type: 'NOTIFY_RESTAURANT_RECEIVE', payload: response.data })
            dispatchData({ type: 'SET_NOTIFY_RESTAURANT_LIST_TOTAL_PAGE', payload: cal })
        } else {
            dispatchData({ type: 'NOTIFY_RESTAURANT_RECEIVE', payload: [] })
            dispatchData({ type: 'SET_NOTIFY_RESTAURANT_LIST_TOTAL_PAGE', payload: 1 })
        }
    }

    useEffect(() => {
        getUserID();
        getRestaurantID();
    }, []);

    // console.log("notifyRestaurantReceive", data.notifyRestaurantReceive);
    // console.log("notifyReceive", data.notifyReceive);

    /*
        $adminID = $data->id;
    $title = $data->title;
    $content = $data->content;
    $userID = json_decode($data->userID);
    $gift = $data->gift;
    $amount = count($userID);
    $code = generateCode();
    $repeat = true; 
    */

    const createUsersNotification = async (adminID, title, content, gift,userID ) => {
        const response = await AxiosInstance().post('/post-create-users-notification.php', {
            id: adminID,
            title: title,
            content: content,
            gift,
            userID
        });
        // console.log(response.statusText);
        // console.log(response);
        if (response.status) {
            getNotification();
            Swal.fire({
                title: 'Success',
                // text: 'Account successfully created',
                icon: 'success',
                confirmButtonText: 'OK'
            })
        } else {

            Swal.fire({
                title: 'Failed',
                // text: 'Account creation failed',
                icon: 'error',
                confirmButtonText: 'OK'
            })
        }
    }

    const handleSendUserNotifi = async (event) => {
        event.preventDefault();
                                                                
        let title = document.getElementById('user-notification-title').value;
        let content = document.getElementById('user-notification-content').value;
        let select = document.querySelector('#form-select-userID').selectedOptions;
        let gift = document.getElementById('user-addGift').checked;
        let userID = new Array();
        for (const item of select) {
            if (item.value !== "Open this select menu") {
                userID.push(item.value);
            }
        }
        // // userID 0 = Open this select menu
        // userID.splice(0, 1);
        console.log(userID)
        createUsersNotification(adminID, title, content, gift, userID);
    }

    const createRestaurantsNotification = async (adminID, title, content, restaurantIDs ) => {
        const response = await AxiosInstance().post('/post-create-restaurants-notification.php', {
            id: adminID,
            title: title,
            content: content,
            restaurantIDs
        });
        console.log(response.statusText);
        console.log(response);
        if (response.status) {
            getRestaurantNotification();
            Swal.fire({
                title: 'Success',
                // text: 'Account successfully created',
                icon: 'success',
                confirmButtonText: 'OK'
            })
        } else {

            Swal.fire({
                title: 'Failed',
                // text: 'Account creation failed',
                icon: 'error',
                confirmButtonText: 'OK'
            })
        }
    }

    const handleSendRestaurantNotifi = async (event) => {
        event.preventDefault();
                                                                
        let title = document.getElementById('restaurant-notification-title').value;
        let content = document.getElementById('restaurant-notification-content').value;
        let select = document.querySelector('#form-select-restaurantID').selectedOptions;

        let restaurantIDs = new Array();
        for (const item of select) {
            if (item.value !== "Open this select menu") {
                restaurantIDs.push(item.value);
            }
        }
        // // restaurantIDs 0 = Open this select menu
        // restaurantIDs.splice(0, 1);
        console.log("restaurantIDs ",restaurantIDs);
        createRestaurantsNotification(adminID, title, content, restaurantIDs);
    }

    return (
        <div className=''>

            {/* <!-- ======= Header ======= --> */}
            <header id="header" className="header fixed-top d-flex align-items-center">

                <div className="d-flex align-items-center justify-content-between">
                    <img src={logo} alt="" />
                    <a className="logo d-flex align-items-center">
                        <span className="d-none d-lg-block orange">Orangic</span>
                    </a>
                    <img src={menu} alt="" className='toggle-sidebar-btn' />
                </div>
                {/* <!-- End Logo --> */}

                <div className="search-bar">
                    <form className="search-form d-flex align-items-center" method="POST" action="#">
                        <input type="text" name="query" placeholder="Search" title="Enter search keyword" />
                        <button type="submit" title="Search"><img src={search} /></button>
                    </form>
                </div>
                {/* <!-- End Search Bar --> */}

                <nav className="header-nav ms-auto">
                    <ul className="d-flex align-items-center">

                        <li className="nav-item d-block d-lg-none">
                            <a className="nav-link nav-icon search-bar-toggle ">
                                <i className="bi bi-search"></i>
                            </a>
                        </li>
                        {/* <!-- End Search Icon--> */}

                        <li className="nav-item dropdown">

                            <a className="nav-link nav-icon" data-bs-toggle="dropdown">
                                <img src={notify} alt='Error notify icon' />
                                <span className="badge bg-primary badge-number">4</span>
                            </a>
                            {/* <!-- End Notification Icon --> */}

                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
                                <li className="dropdown-header">
                                    You have 4 new notifications
                                    <a><span className="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li className="notification-item">
                                    <i className="bi bi-exclamation-circle text-warning"></i>
                                    <div>
                                        <h4>Lorem Ipsum</h4>
                                        <p>Quae dolorem earum veritatis oditseno</p>
                                        <p>30 min. ago</p>
                                    </div>
                                </li>

                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li className="notification-item">
                                    <i className="bi bi-x-circle text-danger"></i>
                                    <div>
                                        <h4>Atque rerum nesciunt</h4>
                                        <p>Quae dolorem earum veritatis oditseno</p>
                                        <p>1 hr. ago</p>
                                    </div>
                                </li>

                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li className="notification-item">
                                    <i className="bi bi-check-circle text-success"></i>
                                    <div>
                                        <h4>Sit rerum fuga</h4>
                                        <p>Quae dolorem earum veritatis oditseno</p>
                                        <p>2 hrs. ago</p>
                                    </div>
                                </li>

                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li className="notification-item">
                                    <i className="bi bi-info-circle text-primary"></i>
                                    <div>
                                        <h4>Dicta reprehenderit</h4>
                                        <p>Quae dolorem earum veritatis oditseno</p>
                                        <p>4 hrs. ago</p>
                                    </div>
                                </li>

                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li className="dropdown-footer">
                                    <a>Show all notifications</a>
                                </li>

                            </ul>
                            {/* <!-- End Notification Dropdown Items --> */}

                        </li>
                        {/* <!-- End Notification Nav --> */}

                        <li className="nav-item dropdown">

                            <a className="nav-link nav-icon" data-bs-toggle="dropdown">
                                <img src={chat_box} alt='Error notify icon' />
                                <span className="badge bg-success badge-number">3</span>
                            </a>
                            {/* <!-- End Messages Icon --> */}

                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
                                <li className="dropdown-header">
                                    You have 3 new messages
                                    <a><span className="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li className="message-item">
                                    <a>
                                        <img src="assets/img/messages-1.jpg" alt="" className="rounded-circle" />
                                        <div>
                                            <h4>Maria Hudson</h4>
                                            <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                                            <p>4 hrs. ago</p>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li className="message-item">
                                    <a>
                                        <img src="assets/img/messages-2.jpg" alt="" className="rounded-circle" />
                                        <div>
                                            <h4>Anna Nelson</h4>
                                            <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                                            <p>6 hrs. ago</p>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li className="message-item">
                                    <a>
                                        <img src="assets/img/messages-3.jpg" alt="" className="rounded-circle" />
                                        <div>
                                            <h4>David Muldon</h4>
                                            <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                                            <p>8 hrs. ago</p>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li className="dropdown-footer">
                                    <a>Show all messages</a>
                                </li>

                            </ul>
                            {/* <!-- End Messages Dropdown Items --> */}

                        </li>
                        {/* <!-- End Messages Nav --> */}

                        <li className="nav-item dropdown pe-3">

                            <a className="nav-link nav-profile d-flex align-items-center pe-0" data-bs-toggle="dropdown">
                                <img src={avatar} alt="Error Profile" className="rounded-circle" />
                                <span className="d-none d-md-block dropdown-toggle ps-2">Alex</span>
                            </a>
                            {/* <!-- End Profile Iamge Icon --> */}

                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                                <li className="dropdown-header">
                                    <h6>Kevin Anderson</h6>
                                    <span>Web Designer</span>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li>
                                    <a className="dropdown-item d-flex align-items-center" href="users-profile.html">
                                        <i className="bi bi-person"></i>
                                        <span>My Profile</span>
                                    </a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li>
                                    <a className="dropdown-item d-flex align-items-center" href="users-profile.html">
                                        <i className="bi bi-gear"></i>
                                        <span>Account Settings</span>
                                    </a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li>
                                    <a className="dropdown-item d-flex align-items-center" href="pages-faq.html">
                                        <i className="bi bi-question-circle"></i>
                                        <span>Need Help?</span>
                                    </a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li>
                                    <a className="dropdown-item d-flex align-items-center">
                                        <i className="bi bi-box-arrow-right"></i>
                                        <span>Sign Out</span>
                                    </a>
                                </li>

                            </ul>
                            {/* <!-- End Profile Dropdown Items --> */}
                        </li>
                        {/* <!-- End Profile Nav --> */}

                    </ul>
                </nav>
                {/* <!-- End Icons Navigation --> */}

            </header>
            {/* <!-- End Header --> */}


            {/* <!-- ======= Sidebar ======= --> */}
            <aside id="sidebar" className="sidebar">

                <ul className="sidebar-nav" id="sidebar-nav">

                    <li className="nav-item">
                        <a className="nav-link collapsed" onClick={() => changePage('/')}>
                            <ReactSVG
                                src={dashboard}
                                className='nav-link-icon'
                            />
                            <span>Dashboard</span>
                        </a>
                    </li>
                    {/* <!-- End Dashboard Nav --> */}

                    <li className="nav-heading">Applications</li>

                    <li className="nav-item">
                        <a className="nav-link" data-bs-target="#components-nav" data-bs-toggle="collapse" aria-expanded="true">
                            <ReactSVG
                                src={infor}
                                className='nav-link-icon'
                            />
                            <span>Informations</span>
                            <ReactSVG
                                src={dropdown}
                                className='nav-link-icon ms-auto'
                            />
                        </a>
                        <ul id="components-nav" className="nav-content collapse show" data-bs-parent="#sidebar-nav">
                            <li>
                                <a onClick={() => changePage('/informations/users')}>
                                    <ReactSVG
                                        src={dot}
                                        className='nav-link-subicon dot'
                                    />
                                    <ReactSVG
                                        src={users}
                                        className='nav-link-subicon'
                                    />
                                    <span>Users</span>
                                </a>
                            </li>
                            <li>
                                <a onClick={() => changePage('/informations/notifications')} className='active'>
                                    <ReactSVG
                                        src={dot}
                                        className='nav-link-subicon dot'
                                    />
                                    <ReactSVG
                                        src={send_notify}
                                        className='nav-link-subicon'
                                    />
                                    <span>Notification</span>
                                </a>
                            </li>
                            <li>
                                <a onClick={() => changePage('/informations/restaurants')}>
                                    <ReactSVG
                                        src={dot}
                                        className='nav-link-subicon dot'
                                    />
                                    <ReactSVG
                                        src={restaurant}
                                        className='nav-link-subicon'
                                    />
                                    <span>Restaurants</span>
                                </a>
                            </li>
                            <li>
                                <a onClick={() => changePage('/informations/foods')}>
                                    <ReactSVG
                                        src={dot}
                                        className='nav-link-subicon dot'
                                    />
                                    <ReactSVG
                                        src={food}
                                        className='nav-link-subicon'
                                    />
                                    <span>Foods</span>
                                </a>
                            </li>
                            <li>
                                <a onClick={() => changePage('/informations/history-files')}>
                                    <ReactSVG
                                        src={dot}
                                        className='nav-link-subicon dot'
                                    />
                                    <ReactSVG
                                        src={history}
                                        className='nav-link-subicon'
                                    />
                                    <span>History Files</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    {/* <!-- End Information Nav --> */}

                    <li className="nav-item">
                        <a className="nav-link collapsed" data-bs-target="#forms-nav" data-bs-toggle="collapse">
                            <ReactSVG
                                src={income}
                                className='nav-link-icon'
                            />
                            <span>Income</span>
                            <ReactSVG
                                src={dropdown}
                                className='nav-link-icon ms-auto'
                            />
                        </a>
                        <ul id="forms-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                            <li>
                                <a onClick={() => changePage('/incomes/discount')}>
                                    <ReactSVG
                                        src={dot}
                                        className='nav-link-subicon dot'
                                    />
                                    <ReactSVG
                                        src={discount}
                                        className='nav-link-subicon'
                                    />
                                    <span>Discounts</span>
                                </a>
                            </li>
                            <li>
                                <a onClick={() => changePage('/incomes/orders')}>
                                    <ReactSVG
                                        src={dot}
                                        className='nav-link-subicon dot'
                                    />
                                    <ReactSVG
                                        src={discount}
                                        className='nav-link-subicon'
                                    />
                                    <span>Orders</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    {/* <!-- End Income Nav --> */}

                    <li className="nav-item">
                        <a className="nav-link collapsed" data-bs-target="#tables-nav" data-bs-toggle="collapse">
                            <ReactSVG
                                src={danger}
                                className='nav-link-icon'
                            />
                            <span>Errors</span>
                            <ReactSVG
                                src={dropdown}
                                className='nav-link-icon ms-auto'
                            />
                        </a>
                        <ul id="tables-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                            <li>
                                <a onClick={() => changePage('/reports/report-errors')}>
                                    <ReactSVG
                                        src={dot}
                                        className='nav-link-subicon dot'
                                    />
                                    <ReactSVG
                                        src={error}
                                        className='nav-link-subicon'
                                    />
                                    <span>Report Errors</span>
                                </a>
                            </li>
                            <li>
                                <a onClick={() => changePage('/reports/report-restaurants')}>
                                    <ReactSVG
                                        src={dot}
                                        className='nav-link-subicon dot'
                                    />
                                    <ReactSVG
                                        src={report}
                                        className='nav-link-subicon'
                                    />
                                    <span>Report Restaurants</span>
                                </a>
                            </li>
                            <li>
                                <a onClick={() => changePage('/reports/report-foods')}>
                                    <ReactSVG
                                        src={dot}
                                        className='nav-link-subicon dot'
                                    />
                                    <ReactSVG
                                        src={report}
                                        className='nav-link-subicon'
                                    />
                                    <span>Report Foods</span>
                                </a>
                            </li>
                            <li>
                                <a onClick={() => changePage('/reports/report-users')}>
                                    <ReactSVG
                                        src={dot}
                                        className='nav-link-subicon dot'
                                    />
                                    <ReactSVG
                                        src={report}
                                        className='nav-link-subicon'
                                    />
                                    <span>Report Users</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    {/* <!-- End Errors Nav --> */}

                    <li className="nav-heading">Pages</li>

                    <li className="nav-item">
                        <a className="nav-link collapsed" onClick={() => changePage('/informations/staffs')}>
                            <ReactSVG
                                src={employee}
                                className='nav-link-icon'
                            />
                            <span>Employees</span>
                        </a>
                    </li>
                    {/* <!-- End Empployee Page Nav --> */}

                </ul>

            </aside>
            {/* <!-- End Sidebar--> */}

            <main id="main" className="main">

                {/* <!-- ======= Main ======= --> */}
                <div className="pagetitle">
                    <h1>Send Notifications</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a>Informations</a></li>
                            <li className="breadcrumb-item active">Notifications</li>
                        </ol>
                    </nav>
                </div>
                {/* <!-- End Page Title --> */}

                {/* <!-- ======= Section ======= --> */}
                <section className="section dashboard">
                    <div className="row">


                        {/* <!-- Left side columns --> */}
                        <div className="col-lg-12">
                            <div className="row">

                                {/* <!-- Tab Bar --> */}
                                <div className="col-12">

                                    <div className="card">
                                        <div className="card-body pt-3">

                                            {/* <!-- Bordered Tabs --> */}
                                            <ul className="nav nav-tabs nav-tabs-bordered">

                                                <li className="nav-item">
                                                    <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#profile-overview">Users Notification List</button>
                                                </li>

                                                <li className="nav-item">
                                                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#profile-change-password">Restaurant Notification List</button>
                                                </li>

                                                <li className="nav-item">
                                                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#profile-edit">Send users Notification</button>
                                                </li>

                                                <li className="nav-item">
                                                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#profile-settings">Send Restaurants Notification</button>
                                                </li>


                                            </ul>
                                            <div className="tab-content pt-2">

                                                {/* <!-- Foods List Table --> */}

                                                <div className="tab-pane fade show active profile-overview" id="profile-overview">
                                                    <div className="tab-title search nav">
                                                        <h5 className="card-title">Notification List</h5>
                                                        <div className="datatable-search" style={{ flex: 1, display: 'flex', borderWidth: 0 }}>
                                                            <input className="datatable-input" placeholder="Search..." type="search" title="Search within table" style={{ width: '50%', margin: 10, borderRadius: 2, borderWidth: 0.5, padding: 3 }} />
                                                        </div>

                                                        <nav aria-label="Page navigation example">
                                                            <ul className="pagination">
                                                                <li className="page-item">
                                                                    <a className="page-link" aria-label="Previous" style={{ cursor: 'pointer' }} onClick={() => {
                                                                        dispatchData({ type: 'NOTIFY_LIST', payload: 1 })
                                                                    }}>
                                                                        <span aria-hidden="true">«</span>
                                                                    </a>
                                                                </li>
                                                                {
                                                                    Array.from({ length: data.notifyListTotalPage }, (_, index) => {
                                                                        return (
                                                                            <li key={index} className={`page-item ${data.notifyListPage === index + 1 ? 'active' : ''}`}><a className="page-link" style={{ cursor: 'pointer' }} onClick={() => {
                                                                                dispatchData({ type: 'SET_NOTIFY_LIST_PAGE', payload: index + 1 })
                                                                            }}>{index + 1}</a></li>
                                                                        )
                                                                    })
                                                                }
                                                                <li className="page-item">
                                                                    <a className="page-link" aria-label="Next" style={{ cursor: 'pointer' }} onClick={() => { dispatchData({ type: 'NOTIFY_LIST', payload: data.notifyList }) }}>
                                                                        <span aria-hidden="true">»</span>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </nav>
                                                    </div>

                                                    <table className="table table-borderless"
                                                        style={{ textAlign: 'start' }}
                                                    >
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">Creator</th>
                                                                <th scope="col">Title</th>
                                                                <th scope="col">Content</th>
                                                                <th scope="col">To</th>
                                                                <th scope="col">Stauts</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                data.notifyList.map((item, index) => {
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td>{item.Name || "Hệ thống"}</td>
                                                                            <td>{item.Title}</td>
                                                                            <td style={{ minWidth: 500, maxWidth: 700 }}>{item.Content}</td>
                                                                            <td>{item.UserName}</td>
                                                                            <td>{item.IsRead}</td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>

                                                </div>
                                                {/* <!-- End Foods List Table --> */}

                                                <div className="tab-pane fade pt-3" id="profile-change-password">

                                                    {/* <!-- Banned Table --> */}
                                                    <div className="tab-title search nav">
                                                        <h5 className="card-title">Restaurants Notifications</h5>
                                                        <div className="datatable-search" style={{ flex: 1, display: 'flex', borderWidth: 0 }}>
                                                            <input className="datatable-input" placeholder="Search..." type="search" title="Search within table" style={{ width: '50%', margin: 10, borderRadius: 2, borderWidth: 0.5, padding: 3 }} />
                                                        </div>

                                                        <nav aria-label="Page navigation example">
                                                            <ul className="pagination">
                                                                <li className="page-item">
                                                                    <a className="page-link" aria-label="Previous" style={{ cursor: 'pointer' }} onClick={() => {
                                                                        dispatchData({ type: 'SET_NOTIFY_RESTAURANT_LIST_PAGE', payload: 1 })
                                                                    }}>
                                                                        <span aria-hidden="true">«</span>
                                                                    </a>
                                                                </li>
                                                                {
                                                                    Array.from({ length: data.notifyRestaurantListTotalPage }, (_, index) => {
                                                                        return (
                                                                            <li key={index} className={`page-item ${data.banFoodPage === index + 1 ? 'active' : ''}`}><a className="page-link" style={{ cursor: 'pointer' }} onClick={() => {
                                                                                dispatchData({ type: 'SET_NOTIFY_RESTAURANT_LIST_PAGE', payload: index + 1 })
                                                                            }}>{index + 1}</a></li>
                                                                        )
                                                                    })
                                                                }
                                                                <li className="page-item">
                                                                    <a className="page-link" aria-label="Next" style={{ cursor: 'pointer' }} onClick={() => { dispatchData({ type: 'SET_NOTIFY_RESTAURANT_LIST_PAGE', payload: data.notifyRestaurantListTotalPage }) }}>
                                                                        <span aria-hidden="true">»</span>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </nav>
                                                    </div>

                                                    <table className="table table-borderless"
                                                        style={{ textAlign: 'start' }}
                                                    >
                                                        <thead>
                                                            <tr>
                                                                <>
                                                                    <th scope="col">Creator</th>
                                                                    <th scope="col">Title</th>
                                                                    <th scope="col">Content</th>
                                                                    <th scope="col">To</th>
                                                                    <th scope="col">Stauts</th>
                                                                </>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                data.notifyRestaurantList.length > 0 ?
                                                                    data.notifyRestaurantList.map((item, index) => {
                                                                        return (
                                                                            <tr key={index}>
                                                                                <td>{item.Name || "Hệ thống"}</td>
                                                                                <td>{item.Title}</td>
                                                                                <td style={{ minWidth: 500, maxWidth: 700 }}>{item.Content}</td>
                                                                                <td>{item.ResName}</td>
                                                                                <td>{item.IsRead}</td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                    : <tr>
                                                                        <td colSpan={5}>No data</td>
                                                                    </tr>
                                                            }
                                                        </tbody>
                                                    </table>
                                                    {/* <!-- End Banned Table --> */}

                                                </div>

                                                <div className="tab-pane fade profile-edit pt-3" id="profile-edit">

                                                    {/* <!-- Leader Board Table --> */}
                                                    <form className='need-validation'>
                                                        <div className="mb-3" style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <div style={{ justifyContent: 'space-between', display: 'flex' }}>
                                                                <label htmlFor="user-notification-title" className="form-label">Title</label>
                                                                <div>
                                                                    <input type="checkbox" id="user-addGift" name="add gift" style={{ marginRight: 5 }} />
                                                                    <label for="user-addGift" style={{ cursor: 'pointer' }}> Add Gift</label>
                                                                </div>
                                                            </div>
                                                            <input type="text" className="form-control" id="user-notification-title" maxLength={50} minLength={10} />
                                                            <div className="invalid-feedback">Please check this input context.</div>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="user-notification-content" className="form-label">Content</label>
                                                            <textarea className="form-control" id="user-notification-content" rows="3" maxLength={300} minLength={10} ></textarea>
                                                            <div className="invalid-feedback">Please check if this input context is correct ? .</div>
                                                        </div>

                                                        {/* <div className="mb-3">
                                                            <button type="button" className="btn btn-primary">Submit</button>
                                                            </div> */}

                                                        <div className="mb-3">
                                                            <div style={{ justifyContent: 'space-between', display: 'flex' }}>
                                                                <label htmlFor="exampleInputPassword1" className="form-label">To</label>
                                                                <div>
                                                                    <input type="checkbox" id="user-selectAll" name="select all" style={{ marginRight: 5 }} onClick={() => {
                                                                        document.getElementById('user-selectAll').addEventListener('change', function () {
                                                                            let selects = document.querySelectorAll('#form-select-userID');
                                                                            for (const select of selects) {
                                                                                for (const option of select.options) {
                                                                                    option.selected = this.checked;
                                                                                }
                                                                            }
                                                                        });
                                                                    }} />
                                                                    <label for="user-selectAll" style={{ cursor: 'pointer' }}> Check All</label>
                                                                </div>
                                                            </div>
                                                            <select multiple className="form-select" id="form-select-userID" aria-label="Default select example" style={{ height: 200 }}>
                                                                <option selected style={{ display: 'none' }}>Open this select menu</option>
                                                                {
                                                                    data.notifyReceive.map((item, index) => {
                                                                        return (
                                                                            <option key={index} value={item.Id}>{`${item.Id} * ${item.Name}`}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </select>
                                                        </div><div className="mb-3 text-end">
                                                            <button type="submit" className="btn btn-primary" onClick={(event) => {
                                                                handleSendUserNotifi(event);
                                                            }}>Submit</button>
                                                        </div>
                                                    </form>
                                                    {/* <!-- End Leader Board Table --> */}

                                                </div>

                                                <div className="tab-pane fade pt-3" id="profile-settings">

                                                    <form className='need-validation'>
                                                        <div className="mb-3" style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <label htmlFor="restaurant-notification-title" className="form-label">Title</label>
                                                            <input type="text" className="form-control" id="restaurant-notification-title" maxLength={50} minLength={10} />
                                                            <div className="invalid-feedback">Please check this input context.</div>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="restaurant-notification-content" className="form-label">Content</label>
                                                            <textarea className="form-control" id="restaurant-notification-content" rows="3" maxLength={300} minLength={10} ></textarea>
                                                            <div className="invalid-feedback">Please check if this input context is correct ? .</div>
                                                        </div>

                                                        {/* <div className="mb-3">
                                                            <button type="button" className="btn btn-primary">Submit</button>
                                                            </div> */}

                                                        <div className="mb-3">
                                                            <div style={{ justifyContent: 'space-between', display: 'flex' }}>
                                                                <label htmlFor="exampleInputPassword1" className="form-label">To</label>
                                                                <div>
                                                                    <input type="checkbox" id="restaurant-selectAll" name="select all" style={{ marginRight: 5 }} onClick={() => {
                                                                        document.getElementById('restaurant-selectAll').addEventListener('change', function () {
                                                                            let selects = document.querySelectorAll('#form-select-restaurantID');
                                                                            for (const select of selects) {
                                                                                for (const option of select.options) {
                                                                                    option.selected = this.checked;
                                                                                }
                                                                            }
                                                                        });
                                                                    }} />
                                                                    <label for="restaurant-selectAll" style={{ cursor: 'pointer' }}> Check All</label>
                                                                </div>
                                                            </div>
                                                            <select multiple className="form-select" id="form-select-restaurantID" aria-label="Default select example" style={{ height: 200 }}>
                                                                <option selected style={{ display: 'none' }}>Open this select menu</option>
                                                                {
                                                                    data?.notifyRestaurantReceive?.map((item, index) => {
                                                                        return (
                                                                            <option key={index} value={item.Id}>{`${item.Id} * ${item.Name}`}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </select>
                                                        </div><div className="mb-3 text-end">
                                                            <button type="submit" className="btn btn-primary" onClick={(event) => {
                                                                // validateForm();
                                                                // event.preventDefault();
                                                                handleSendRestaurantNotifi(event);
                                                                console.log('send restaurant');
                                                            }}>Submit</button>
                                                        </div>
                                                    </form>

                                                    {/* <!-- End Comments Table --> */}

                                                </div>



                                            </div>
                                            {/* <!-- End Bordered Tabs --> */}

                                        </div>
                                    </div>

                                </div>
                                {/* <!-- End Tab Bar --> */}

                            </div>
                        </div>
                        {/* <!-- End Left side columns --> */}


                    </div>
                </section>
                {/* <!-- End Secion --> */}
            </main>
            {/* <!-- End Main --> */}
        </div>
    )
}

export default Notification