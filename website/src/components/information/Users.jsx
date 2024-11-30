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
import payment from '../assets/img/icons/payment.svg';
import discount from '../assets/img/icons/discount.svg';
import error from '../assets/img/icons/error.svg';
import report from '../assets/img/icons/report.svg';
import dot from '../assets/img/icons/dot.svg';
import new_user from '../assets/img/icons/new_user.svg';
import partnership from '../assets/img/icons/partnership.svg';
import user_banned from '../assets/img/icons/user_banned.svg';
import more from '../assets/img/icons/more.svg';

import Swal from 'sweetalert2'

// Image
import avatar from '../assets/img/images/ex_avatar.png';

// Conponent
import React, { useEffect, useReducer, useRef, useState } from 'react'
import ApexCharts from 'apexcharts'
import { ReactSVG } from 'react-svg';
import { Navigate, useNavigate, useHref } from 'react-router-dom';
import AxiosInstance from '../helpers/AxiosInstance.js';


const Users = (prop) => {
    const { host } = prop;
    document.title = 'Informations - Users';
    const chartRef = useRef(null);

    const navigate = useNavigate();

    const changePage = (link) => {
        navigate(link);
    };

    {/** declare user storage */ }

    const initialState = {
        users: [],
        topUsers: [],
        bannedUsers: [],
        usersComment: [],
        blackUser: [],
        newUser: [],

        userPage: 1,
        topUsersPage: 1,
        bannedUsersPage: 1,
        usersCommentPage: 1,

        userTotalPage: 1,
        topUsersTotalPage: 1,
        bannedUsersTotalPage: 1,
        usersCommentTotalPage: 1,
    };

    const [data, dispatchData] = useReducer((state, action) => {
        switch (action.type) {
            case 'GET_USERS':
                return { ...state, users: action.payload };
            case 'GET_TOP_USERS':
                return { ...state, topUsers: action.payload };
            case 'GET_BANNED_USERS':
                return { ...state, bannedUsers: action.payload };
            case 'GET_USERS_COMMENT':
                return { ...state, usersComment: action.payload };
            case 'GET_BLACK_USER':
                return { ...state, blackUser: action.payload };
            case 'GET_NEW_USERS':
                return { ...state, newUser: action.payload };

            case 'SET_USERS_PAGE':
                return { ...state, userPage: action.payload };
            case 'SET_TOP_USERS_PAGE':
                return { ...state, topUsersPage: action.payload };
            case 'SET_BANNED_USERS_PAGE':
                return { ...state, bannedUsersPage: action.payload };
            case 'SET_USERS_COMMENT_PAGE':
                return { ...state, usersCommentPage: action.payload };

            case 'SET_USERS_TOTAL_PAGE':
                return { ...state, userTotalPage: action.payload };
            case 'SET_TOP_USERS_TOTAL_PAGE':
                return { ...state, topUsersTotalPage: action.payload };
            case 'SET_BANNED_USERS_TOTAL_PAGE':
                return { ...state, bannedUsersTotalPage: action.payload };
            case 'SET_USERS_COMMENT_TOTAL_PAGE':
                return { ...state, usersCommentTotalPage: action.payload };

            default:
                return state;
        }
    }, initialState)

    const statisticsInitialState = {
        userState: '',
        userGrowth: 0,
        userTime: 'Today',
        userNumber: 0,

        sellerState: '',
        sellerGrowth: 0,
        sellerTime: 'Today',
        sellerNumber: 0,

        bannedState: '',
        bannedGrowth: 0,
        bannedTime: 'Today',
        bannedNumber: 0,

        xaxis: [],
        userSeries: [],
        revenueSeries: [],
        bannedSeries: [],
        dataBoardTime: 'Today',
        dataMin: 0,
        dataMax: 0,

        recentOrders: [],

    }

    const [statistics, dispatchStatistics] = useReducer((state, action) => {
        switch (action.type) {
            case 'USER_STATE':
                return { ...state, userState: action.payload };
            case 'USER_GROWTH':
                return { ...state, userGrowth: action.payload };
            case 'USER_TIME':
                return { ...state, userTime: action.payload };
            case 'USER_NUMBER':
                return { ...state, userNumber: action.payload };

            case 'SELLER_STATE':
                return { ...state, sellerState: action.payload };
            case 'SELLER_GROWTH':
                return { ...state, sellerGrowth: action.payload };
            case 'SELLER_TIME':
                return { ...state, sellerTime: action.payload };
            case 'SELLER_NUMBER':
                return { ...state, sellerNumber: action.payload };

            case 'BANNED_STATE':
                return { ...state, bannedState: action.payload };
            case 'BANNED_GROWTH':
                return { ...state, bannedGrowth: action.payload };
            case 'BANNED_TIME':
                return { ...state, bannedTime: action.payload };
            case 'BANNED_NUMBER':
                return { ...state, bannedNumber: action.payload };

            case 'XAXIS':
                return { ...state, xaxis: action.payload };
            case 'USER_SERIES':
                return { ...state, userSeries: action.payload };
            case 'REVENUE_SERIES':
                return { ...state, revenueSeries: action.payload };
            case 'BANNED_SERIES':
                return { ...state, bannedSeries: action.payload };
            case 'DATA_BOARD_TIME':
                return { ...state, dataBoardTime: action.payload };

            case 'RECENT_ORDERS':
                return { ...state, recentOrders: action.payload };

            default:
                return state;

        }
    }, statisticsInitialState)
    {/** End of declare user storage */ }

    const calculateGrowthRate = (present, previous) => {
        if (previous != 0 && previous != present) {
            return Math.round(((present - previous) / previous) * 100);
        } else {
            if (previous == 0) {
                return 100;
            }
            else {
                return 0;
            }
        }
    }

    function changeFilter(event, id = 'new-user-card-title-span') {
        document.getElementById(id).innerText = event.target.innerText;
    }

    {/** Start of getting user statistics */ }

    async function getNewUsersStatistic() {
        if (statistics.userTime === 'Total') {
            const response = await AxiosInstance().get('/get-all-users.php');
            if (response.status) {
                const statistic = response.users.length;
                dispatchStatistics({ type: 'USER_STATE', payload: 'All of the users' });
                dispatchStatistics({ type: 'USER_GROWTH', payload: 100 });
                dispatchStatistics({ type: 'USER_NUMBER', payload: statistic });
            } else {
                dispatchStatistics({ type: 'USER_STATE', payload: 'No record' });
                dispatchStatistics({ type: 'USER_GROWTH', payload: 0 });
                dispatchStatistics({ type: 'USER_NUMBER', payload: 0 });
            }
            return;
        }
        const response = await AxiosInstance().get('/get-new-users-statistics.php');
        if (response.status) {
            const statistic = response.statistics;
            switch (statistics.userTime) {
                case 'Today':
                    const cal = calculateGrowthRate(statistic.TODAY, statistic.PRE_DAY);
                    dispatchStatistics({ type: 'USER_STATE', payload: cal < 0 ? 'Decrease' : 'Increase' });
                    dispatchStatistics({ type: 'USER_GROWTH', payload: cal });
                    dispatchStatistics({ type: 'USER_NUMBER', payload: statistic.TODAY });
                    break;
                case 'This Month':
                    const cal1 = calculateGrowthRate(statistic.THIS_MONTH, statistic.PRE_MONTH);
                    dispatchStatistics({ type: 'USER_STATE', payload: cal1 < 0 ? 'Decrease' : 'Increase' });
                    dispatchStatistics({ type: 'USER_GROWTH', payload: cal1 });
                    dispatchStatistics({ type: 'USER_NUMBER', payload: statistic.THIS_MONTH });
                    break;
                case 'This Year':
                    const cal2 = calculateGrowthRate(statistic.THIS_YEAR, statistic.PRE_YEAR);
                    dispatchStatistics({ type: 'USER_STATE', payload: cal2 < 0 ? 'Decrease' : 'Increase' });
                    dispatchStatistics({ type: 'USER_GROWTH', payload: cal2 });
                    dispatchStatistics({ type: 'USER_NUMBER', payload: statistic.THIS_YEAR });
                    break;
                case 'Total':
                    dispatchStatistics({ type: 'USER_STATE', payload: 'All of the users' });
                    dispatchStatistics({ type: 'USER_GROWTH', payload: 100 });
                    dispatchStatistics({ type: 'USER_NUMBER', payload: Object.values(statistic).reduce((a, b) => a + b, 0) });
                    break;

                default:
                    console.log("error response")
            }
        } else {
            console.log("error response")
            dispatchStatistics({ type: 'USER_STATE', payload: 'No record' });
            dispatchStatistics({ type: 'USER_GROWTH', payload: 0 });
            dispatchStatistics({ type: 'USER_NUMBER', payload: 0 });
        }

    }

    useEffect(() => {
        getNewUsersStatistic();
    }, [statistics.userTime])

    {/** End of getting user statistics */ }

    {/** Start of getting revenue statistics */ }

    async function getRevenueStatistic() {
        const response = await AxiosInstance().get('/get-partnership-revenue-statistics.php');
        if (response.status) {
            const statistic = response.revenue;
            switch (statistics.sellerTime) {
                case 'Today':
                    const cal = calculateGrowthRate(statistic.TODAY, statistic.PRE_DAY);
                    dispatchStatistics({ type: 'SELLER_STATE', payload: cal < 0 ? 'Decrease' : 'Increase' });
                    dispatchStatistics({ type: 'SELLER_GROWTH', payload: cal });
                    dispatchStatistics({ type: 'SELLER_NUMBER', payload: statistic.TODAY });
                    break;
                case 'This Month':
                    const cal1 = calculateGrowthRate(statistic.THIS_MONTH, statistic.PRE_MONTH);
                    dispatchStatistics({ type: 'SELLER_STATE', payload: cal1 < 0 ? 'Decrease' : 'Increase' });
                    dispatchStatistics({ type: 'SELLER_GROWTH', payload: cal1 });
                    dispatchStatistics({ type: 'SELLER_NUMBER', payload: statistic.THIS_MONTH });
                    break;
                case 'This Year':
                    const cal2 = calculateGrowthRate(statistic.THIS_YEAR, statistic.PRE_YEAR);
                    dispatchStatistics({ type: 'SELLER_STATE', payload: cal2 < 0 ? 'Decrease' : 'Increase' });
                    dispatchStatistics({ type: 'SELLER_GROWTH', payload: cal2 });
                    dispatchStatistics({ type: 'SELLER_NUMBER', payload: statistic.THIS_YEAR });
                    break;
            }
        } else {
            dispatchStatistics({ type: 'SELLER_STATE', payload: 'No record' });
            dispatchStatistics({ type: 'SELLER_GROWTH', payload: 0 });
            dispatchStatistics({ type: 'SELLER_NUMBER', payload: 0 });
        }
    }

    useEffect(() => {
        getRevenueStatistic();
    }, [statistics.sellerTime])

    {/** End of getting revenue statistics */ }

    {/** Start of getting banned statistics */ }

    async function getBannedStatistic() {

        if (statistics.bannedTime === 'Total') {
            const response = await AxiosInstance().get('/get-all-banned-users.php');
            console.log(response)
            if (response.status) {
                const statistic = response.data.length;
                dispatchStatistics({ type: 'BANNED_STATE', payload: 'All of the banned' });
                dispatchStatistics({ type: 'BANNED_GROWTH', payload: 0 });
                dispatchStatistics({ type: 'BANNED_NUMBER', payload: statistic });
            } else {
                dispatchStatistics({ type: 'BANNED_STATE', payload: 'No record' });
                dispatchStatistics({ type: 'BANNED_GROWTH', payload: 0 });
                dispatchStatistics({ type: 'BANNED_NUMBER', payload: 0 });
            }
            return;
        }
        const response = await AxiosInstance().get('/get-users-banned-statistics.php');

        if (response.status) {
            const statistic = response.banned;
            switch (statistics.bannedTime) {
                case 'Today':
                    const cal = calculateGrowthRate(statistic.TODAY, statistic.PRE_DAY);
                    dispatchStatistics({ type: 'BANNED_STATE', payload: cal < 0 ? 'Decrease' : 'Increase' });
                    dispatchStatistics({ type: 'BANNED_GROWTH', payload: cal });
                    dispatchStatistics({ type: 'BANNED_NUMBER', payload: statistic.TODAY });
                    break;
                case 'This Month':
                    const cal1 = calculateGrowthRate(statistic.THIS_MONTH, statistic.PRE_MONTH);
                    dispatchStatistics({ type: 'BANNED_STATE', payload: cal1 < 0 ? 'Decrease' : 'Increase' });
                    dispatchStatistics({ type: 'BANNED_GROWTH', payload: cal1 });
                    dispatchStatistics({ type: 'BANNED_NUMBER', payload: statistic.THIS_MONTH });
                    break;
                case 'This Year':
                    const cal2 = calculateGrowthRate(statistic.THIS_YEAR, statistic.PRE_YEAR);
                    dispatchStatistics({ type: 'BANNED_STATE', payload: cal2 < 0 ? 'Decrease' : 'Increase' });
                    dispatchStatistics({ type: 'BANNED_GROWTH', payload: cal2 });
                    dispatchStatistics({ type: 'BANNED_NUMBER', payload: statistic.THIS_YEAR });
                    break;
                case 'Total':
                    dispatchStatistics({ type: 'BANNED_STATE', payload: 'All of the banned' });
                    dispatchStatistics({ type: 'BANNED_GROWTH', payload: 0 });
                    dispatchStatistics({ type: 'BANNED_NUMBER', payload: Object.values(statistic).reduce((a, b) => a + b, 0) });
            }
        } else {
            dispatchStatistics({ type: 'BANNED_STATE', payload: 'No record' });
            dispatchStatistics({ type: 'BANNED_GROWTH', payload: 0 });
            dispatchStatistics({ type: 'BANNED_NUMBER', payload: 0 });
        }
    }

    useEffect(() => {
        getBannedStatistic();
    }, [statistics.bannedTime])

    {/** End of getting banned statistics */ }

    {/** Get user's list */ }

    const loadUsers = async () => {
        try {
            const response = await AxiosInstance().get('/get-all-users.php');
            // only take 5 users
            const length = response.users.length;
            // const list = response.users.slice(length - 5, page * 5);
            let list = response.users.slice(data.userPage * 5 - 5, data.userPage * 5);
            dispatchData({ type: 'GET_USERS', payload: list });
            dispatchData({ type: 'SET_USERS_TOTAL_PAGE', payload: (Math.ceil(length / 5)) });
        } catch (error) {
            console.log("Fail to get users because of: " + error);
        }
    }

    useEffect(() => {

        loadUsers();
    }, [data.userPage]);

    {/** End of get user's list */ }

    {/** Get top user's list */ }

    const loadTopUsers = async () => {
        try {
            const response = await AxiosInstance().get('/get-top-users.php');
            const length = response.users.length;
            let list = response.users.slice(data.topUsersPage * 5 - 5, data.topUsersPage * 5);
            dispatchData({ type: 'GET_TOP_USERS', payload: list });
            dispatchData({ type: 'SET_TOP_USERS_TOTAL_PAGE', payload: (Math.ceil(length / 5)) });
        } catch (error) {
            console.log("Fail to get top users because of: " + error);
        }
    }

    useEffect(() => {
        loadTopUsers();
    }, [data.topUsersPage]);


    {/** End of get top user's list */ }

    {/** Get Banned user's list */ }

    const loadBannedUser = async () => {
        const response = await AxiosInstance().get('/get-banned-users.php');
        const length = response.users.length;
        let list = response.users.slice(data.bannedUsersPage * 5 - 5, data.bannedUsersPage * 5);
        dispatchData({ type: 'GET_BANNED_USERS', payload: list });
        dispatchData({ type: 'SET_BANNED_USERS_TOTAL_PAGE', payload: (Math.ceil(length / 5)) });
    }

    useEffect(() => {
        loadBannedUser();
    }, [data.bannedUsersPage])

    {/** Start of reply users */ }
    const replyUserReports = async (reportID, userName, adminID, targetID) => {
        Swal.fire({
            title: `What do you want to send to ${userName}`,
            text: "After sending message the target report user will be banned ",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Send',
            input: "textarea",
            inputPlaceholder: "Type your message here...",
            inputAttributes: {
                "aria-label": "Type your message here"
            },
            showLoaderOnConfirm: true,
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return "Sorry your input was invalid!";
                }
            },
            preConfirm: async (resp) => {
                try {
                    const body = {
                        id: reportID,
                        replyBy: adminID,
                        reply: resp
                    }
                    await AxiosInstance().post('/post-report-reply.php', body);
                    await AxiosInstance().post('/post-update-user-status.php', { id: targetID, status: 'Banned' });
                    await AxiosInstance().post('/post-update-report-status.php', { targetID: targetID, status: 'Done' });
                    loadReports();
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        text: `Request failed: ${error}`
                    })
                }
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'success',
                    text: `Your message has been send to ${userName} and ${targetID} has been banned!`
                })
            }
        })
    }

    const repjectUserReports = async (reportID, userName, adminID, targetID) => {
        Swal.fire({
            title: `What do you want to send to ${userName}`,
            text: "After sending message the report status will be set to Done ",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Send',
            input: "textarea",
            inputPlaceholder: "Type your message here...",
            inputAttributes: {
                "aria-label": "Type your message here"
            },
            showLoaderOnConfirm: true,
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return "Sorry your input was invalid!";
                }
            },
            preConfirm: async (resp) => {
                try {
                    const body = {
                        id: reportID,
                        replyBy: adminID,
                        reply: resp
                    }
                    await AxiosInstance().post('/post-report-reply.php', body);
                    await AxiosInstance().post('/post-update-report-status.php', { targetID: targetID, status: 'Done' });
                    loadReports();
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        text: `Request failed: ${error}`
                    })
                }
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'success',
                    text: `Your message has been send to ${userName}!`
                })
            }
        })
    }
    {/** End of reply users */ }

    {/** Start of banning users */ }

    const updateStatusUser = async (name, adminID, status, targetID) => {
        Swal.fire({
            title: `Do you want to update user ${name}'s status to ${status}?`,
            text: "Press confirm button to continue",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            showLoaderOnConfirm: true,
            preConfirm: async (res) => {
                try {
                    if (res) {
                        const body = {
                            id: targetID,
                            status: status
                        }
                        const response = await AxiosInstance().post('/post-update-user-status.php', body);
                        if (!response.status) {
                            throw new Error(response.message);
                        }
                        loadBannedUser();
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        text: `Request failed: ${error}`
                    })
                }
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'success',
                    text: `User ${name}'s status has been updated to ${status}!`
                })
            }
        });
    }

    {/** End of banning users */ }

    {/** End of banned user's list */ }

    {/** Get new users */ }

    const loadNewUsers = async () => {
        const response = await AxiosInstance().get('/get-new-users.php');
        dispatchData({ type: 'GET_NEW_USERS', payload: response.users })
    }

    useEffect(() => {
        loadNewUsers();
    }, [])

    {/** End get new users */ }

    {/** Start of get black users */ }

    const loadReports = async () => {
        const response = await AxiosInstance().get('/get-report-users.php');
        dispatchData({ type: 'GET_BLACK_USER', payload: response });
    }

    useEffect(() => {
        loadReports();
    }, [])

    {/** End get black users */ }

    {/** Start of getting orders by status */ }

    const getOrdersByStatus = async (status) => {
        try {
            const response = await AxiosInstance().post('/get-all-orders-by-status.php', { status });
            if (response.status) {
                dispatchStatistics({ type: 'RECENT_ORDERS', payload: response.data });
            } else {
            }
        } catch (error) {
            console.log(error)
        }
    }

    {/** End of getting orders by status */ }

    {/** Start of getting data for data board */ }

    const getBoardData = async () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const timeLine = statistics.dataBoardTime;
        let timePoints = [];
        switch (statistics.dataBoardTime) {
            case 'Today':
                timePoints = Array.from({ length: today.getHours() + 1 }, (_, i) => `${i}:00`);
                break;
            case 'This Month':
                timePoints = Array.from({ length: today.getDate() + 1 }, (_, i) => `${year}-${month + 1}-${i + 1}`);
                break;
            case 'This Year':
                timePoints = Array.from({ length: month + 1 }, (_, i) => `${year}-${i + 1}-1`);
                break;
        }
        const body = {
            timeLine: timeLine,
            timePoints
        }
        const response = await AxiosInstance().post('/get-users-databoard-statistics.php', body);
        const result = await response.data;
        dispatchStatistics({ type: 'DATA_MIN', payload: result.min });
        dispatchStatistics({ type: 'DATA_MAX', payload: result.max });
        dispatchStatistics({ type: 'USER_SERIES', payload: result.output.users });
        dispatchStatistics({ type: 'REVENUE_SERIES', payload: result.output.revenues });
        dispatchStatistics({ type: 'BANNED_SERIES', payload: result.output.banneds });
        dispatchStatistics({ type: 'X_AXIS', payload: timePoints });

        ApexCharts.exec('dashboard', 'updateOptions', {
            series: [{
                name: 'New Users',
                data: result.output.users,
            }, {
                name: 'Partnership',
                data: result.output.revenues
            }, {
                name: 'Banned',
                data: result.output.banneds
            }],
        });
    }

    {/** End of getting data for data board */ }


    {/** Data board */ }
    useEffect(() => {
        getOrdersByStatus('Waiting');
        let chart;
        if (chartRef.current) {
            chart = new ApexCharts(document.getElementById("reportsChart"), {
                series: [{
                    name: 'New Users',
                    data: statistics.userSeries,
                }, {
                    name: 'Partnership',
                    data: statistics.revenueSeries
                }, {
                    name: 'Banned',
                    data: statistics.bannedSeries
                }],
                chart: {
                    id: 'dashboard',
                    height: 350,
                    type: 'area',
                    toolbar: {
                        show: false
                    },
                },
                markers: {
                    size: 4
                },
                colors: ['#4154f1', '#2eca6a', '#ff771d'],
                fill: {
                    type: "gradient",
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.3,
                        opacityTo: 0.4,
                        stops: [statistics.dataMin, statistics.dataMax, statistics.dataMax + 10]
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth',
                    width: 2
                },
                xaxis: {
                    categories: statistics.xaxis,
                },
            });
            chart.render();
        }
        return () => {
            if (chart) {
                chart.destroy();
            }
        };
    }, []);

    useEffect(() => {
        getBoardData()

    }, [statistics.dataBoardTime]);
    {/** End data board */ }

    function changeDotColor(status) {
        switch (status) {
            case 'Waiting':
                return '#a39a00';
            case 'Done':
                return '#0d80ff';
            case 'Delivering':
                return 'bg-warning';
            case 'Delivered':
                return '#ff7f00';
            case 'Cancelled':
            case 'Denied':
                return '#dc3545';
            default:
                return '#dc3545';
        }
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
                                <a className='active'>
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
                                <a onClick={() => changePage('/informations/notifications')}>
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
                        <a className="nav-link collapsed" href="users-profile.html">
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
                    <h1>Users Dashboard</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a>Informations</a></li>
                            <li className="breadcrumb-item active">Users</li>
                        </ol>
                    </nav>
                </div>
                {/* <!-- End Page Title --> */}

                {/* <!-- ======= Section ======= --> */}
                <section className="section dashboard">
                    <div className="row">


                        {/* <!-- Left side columns --> */}
                        <div className="col-lg-8">
                            <div className="row">

                                {/* <!-- New User Card --> */}
                                <div className="col-xxl-4 col-md-6">
                                    <div className="card info-card left-card">

                                        <div className="filter">
                                            <a className="icon" data-bs-toggle="dropdown">
                                                <ReactSVG
                                                    src={more}
                                                />
                                            </a>
                                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                                <li className="dropdown-header text-start">
                                                    <h6>Filter</h6>
                                                </li>

                                                <li><a className="dropdown-item" onClick={(event) => {
                                                    changeFilter(event, 'new-user-card-title-span')
                                                    dispatchStatistics({ type: 'USER_TIME', payload: 'Today' })
                                                }}>Today</a></li>
                                                <li><a className="dropdown-item" onClick={(event) => {
                                                    changeFilter(event, 'new-user-card-title-span')
                                                    dispatchStatistics({ type: 'USER_TIME', payload: 'This Month' })
                                                }}>This Month</a></li>
                                                <li><a className="dropdown-item" onClick={(event) => {
                                                    changeFilter(event, 'new-user-card-title-span')
                                                    dispatchStatistics({ type: 'USER_TIME', payload: 'This Year' })
                                                }}>This Year</a></li>
                                                <li><a className="dropdown-item" onClick={(event) => {
                                                    changeFilter(event, 'new-user-card-title-span')
                                                    dispatchStatistics({ type: 'USER_TIME', payload: 'Total' })
                                                }}>Total</a></li>
                                            </ul>
                                        </div>

                                        <div className="card-body">
                                            <h5 className="card-title">New Users | <span id='new-user-card-title-span'>Today</span></h5>

                                            <div className="d-flex align-items-center">
                                                <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                                    <ReactSVG
                                                        src={new_user}
                                                        className='left-icon'
                                                    />
                                                </div>
                                                <div className="ps-3">
                                                    <h6>{statistics.userNumber}</h6>
                                                    <span className={`small pt-1 fw-bold ${statistics.userGrowth < 0 ? 'text-danger' : 'text-success'}`}>{statistics.userGrowth}%</span>
                                                    <span className="text-muted small pt-2 ps-1">{statistics.userState}</span>

                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                {/* <!-- End New User Card --> */}


                                {/* <!-- Partnership Card --> */}
                                <div className="col-xxl-4 col-md-6">
                                    <div className="card info-card middle-card">

                                        <div className="filter">
                                            <a className="icon" data-bs-toggle="dropdown">
                                                <ReactSVG
                                                    src={more}
                                                />
                                            </a>
                                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                                <li className="dropdown-header text-start">
                                                    <h6>Filter</h6>
                                                </li>

                                                <li><a className="dropdown-item"
                                                    onClick={(event) => {
                                                        changeFilter(event, 'partnership-card-title-span')
                                                        dispatchStatistics({ type: 'SELLER_TIME', payload: 'Today' })
                                                    }}
                                                >Today</a></li>
                                                <li><a className="dropdown-item"
                                                    onClick={(event) => {
                                                        changeFilter(event, 'partnership-card-title-span')
                                                        dispatchStatistics({ type: 'SELLER_TIME', payload: 'This Month' })
                                                    }}
                                                >This Month</a></li>
                                                <li><a className="dropdown-item"
                                                    onClick={(event) => {
                                                        changeFilter(event, 'partnership-card-title-span')
                                                        dispatchStatistics({ type: 'SELLER_TIME', payload: 'This Year' })
                                                    }}
                                                >Year</a></li>
                                            </ul>
                                        </div>

                                        <div className="card-body">
                                            <h5 className="card-title">Partnership | <span id='partnership-card-title-span'>Today</span></h5>

                                            <div className="d-flex align-items-center">
                                                <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                                    <ReactSVG
                                                        src={partnership}
                                                        className='middle-icon'
                                                    />
                                                </div>
                                                <div className="ps-3">
                                                    <h6>${statistics.sellerNumber}</h6>
                                                    <span className={`text-success small pt-1 fw-bold ${statistics.sellerGrowth < 0 ? 'text-danger' : 'text-success'}`}>{statistics.sellerGrowth}%</span>
                                                    <span className="text-muted small pt-2 ps-1">{statistics.sellerState}</span>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                {/* <!-- End Partnership Card --> */}


                                {/* <!-- Users Banned Card --> */}
                                <div className="col-xxl-4 col-xl-12">

                                    <div className="card info-card right-card">

                                        <div className="filter">
                                            <a className="icon" data-bs-toggle="dropdown">
                                                <ReactSVG
                                                    src={more}
                                                />
                                            </a>
                                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                                <li className="dropdown-header text-start">
                                                    <h6>Filter</h6>
                                                </li>

                                                <li><a className="dropdown-item"
                                                    onClick={(event) => {
                                                        changeFilter(event, 'banned-card-title-span')
                                                        dispatchStatistics({ type: 'BANNED_TIME', payload: 'Today' })
                                                    }}
                                                >Today</a></li>
                                                <li><a className="dropdown-item"
                                                    onClick={(event) => {
                                                        changeFilter(event, 'banned-card-title-span')
                                                        dispatchStatistics({ type: 'BANNED_TIME', payload: 'This Month' })
                                                    }}
                                                >This Month</a></li>
                                                <li><a className="dropdown-item"
                                                    onClick={(event) => {
                                                        changeFilter(event, 'banned-card-title-span')
                                                        dispatchStatistics({ type: 'BANNED_TIME', payload: 'This Year' })
                                                    }}
                                                >This Year</a></li>
                                                <li><a className="dropdown-item"
                                                    onClick={(event) => {
                                                        changeFilter(event, 'banned-card-title-span')
                                                        dispatchStatistics({ type: 'BANNED_TIME', payload: 'Total' })
                                                    }}
                                                >Total</a>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="card-body">
                                            <h5 className="card-title">Banned | <span id='banned-card-title-span'>Today</span></h5>

                                            <div className="d-flex align-items-center">
                                                <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                                    <ReactSVG
                                                        src={user_banned}
                                                        className='right-icon'
                                                    />
                                                </div>
                                                <div className="ps-3">
                                                    <h6>{statistics.bannedNumber}</h6>
                                                    <span className="text-danger small pt-1 fw-bold">{statistics.bannedGrowth}%</span> <span className="text-muted small pt-2 ps-1">{statistics.bannedState}</span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                                {/* <!-- End Users Banned Card --> */}


                                {/* <!-- Reports --> */}
                                <div className="col-12">
                                    <div className="card">

                                        <div className="filter">
                                            <a className="icon" data-bs-toggle="dropdown">
                                                <ReactSVG
                                                    src={more}
                                                />
                                            </a>
                                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                                <li className="dropdown-header text-start">
                                                    <h6>Filter</h6>
                                                </li>

                                                <li><a className="dropdown-item" onClick={(event) => {
                                                    changeFilter(event, 'reports-card-title-span')
                                                    dispatchStatistics({ type: 'DATA_BOARD_TIME', payload: 'Today' })
                                                }}>Today</a></li>
                                                <li><a className="dropdown-item" onClick={(event) => {
                                                    changeFilter(event, 'reports-card-title-span')
                                                    dispatchStatistics({ type: 'DATA_BOARD_TIME', payload: 'This Month' })
                                                }}>This Month</a></li>
                                                <li><a className="dropdown-item" onClick={(event) => {
                                                    changeFilter(event, 'reports-card-title-span')
                                                    dispatchStatistics({ type: 'DATA_BOARD_TIME', payload: 'This Year' })
                                                }}>This Year</a></li>
                                            </ul>
                                        </div>

                                        <div className="card-body">
                                            <h5 className="card-title">Reports / <span id='reports-card-title-span'>Today</span></h5>

                                            {/* <!-- Line Chart --> */}
                                            <div id="reportsChart" ref={chartRef}></div>

                                            {/* <!-- End Line Chart --> */}

                                        </div>

                                    </div>
                                </div>
                                {/* <!-- End Reports --> */}

                                {/* <!-- Tab Bar --> */}
                                <div className="col-12">

                                    <div className="card">
                                        <div className="card-body pt-3">

                                            {/* <!-- Bordered Tabs --> */}
                                            <ul className="nav nav-tabs nav-tabs-bordered">

                                                <li className="nav-item">
                                                    {/** The button will re render item if it getting press at another tab */}
                                                    <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#list-users-overview" onMouseDown={(e) => {
                                                        if (!e.target.classList.contains('active')) {
                                                            loadUsers();
                                                        }
                                                    }}>List</button>
                                                </li>

                                                <li className="nav-item">
                                                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#users-leaderboard" onMouseDown={(e) => {
                                                        if (e.target.classList.contains('active')) {
                                                            loadTopUsers()
                                                        }
                                                    }} >Leader Board</button>
                                                </li>

                                                <li className="nav-item">
                                                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#user-comments" onMouseDown={(e) => {
                                                        if (e.target.classList.contains('active')) {
                                                        }
                                                    }} >Comments</button>
                                                </li>

                                                <li className="nav-item">
                                                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#banned-users" onMouseDown={(e) => {
                                                        if (e.target.classList.contains('active')) {
                                                            loadBannedUser();
                                                        }
                                                    }} >Banned</button>
                                                </li>

                                            </ul>
                                            <div className="tab-content pt-2">

                                                <div className="tab-pane fade show active profile-overview" id="list-users-overview">

                                                    <div className="tab-title search nav">
                                                        <h5 className="card-title">Users List</h5>
                                                        <div className="datatable-search">
                                                            <input className="datatable-input" placeholder="Search..." type="search" title="Search within table" />
                                                        </div>

                                                        <nav aria-label="Page navigation example">
                                                            <ul className="pagination">
                                                                <li className="page-item">
                                                                    <a className="page-link" aria-label="Previous" style={{ cursor: 'pointer' }} onClick={() => {
                                                                        dispatchData({ type: 'SET_USERS_PAGE', payload: 1 })
                                                                    }}>
                                                                        <span aria-hidden="true">«</span>
                                                                    </a>
                                                                </li>
                                                                {
                                                                    Array.from({ length: data.userTotalPage }, (_, index) => {
                                                                        if (data.userTotalPage > 10) {
                                                                            if ((index >= data.userPage - 3 && index <= data.userPage + 1) || // 2 pages before and after current page
                                                                                index >= data.userTotalPage - 2) { // last 2 pages
                                                                                return (
                                                                                    <li className={`page-item ${data.userPage === index + 1 ? 'active' : ''}`} key={index + 1} style={{ cursor: 'pointer' }}>
                                                                                        <a className="page-link" onClick={() => {
                                                                                            dispatchData({ type: 'SET_USERS_PAGE', payload: index + 1 });
                                                                                            console.log(data.userPage)
                                                                                            console.log("index", index)
                                                                                        }
                                                                                        }>{index + 1}</a>
                                                                                    </li>
                                                                                );
                                                                            }
                                                                        } else {
                                                                            return (
                                                                                <li className={`page-item ${data.userPage === index + 1 ? 'active' : ''}`} key={index + 1} style={{ cursor: 'pointer' }}>
                                                                                    <a className="page-link" onClick={() =>
                                                                                        dispatchData({ type: 'SET_USERS_PAGE', payload: index + 1 })
                                                                                    }>{index + 1}</a>
                                                                                </li>
                                                                            );
                                                                        }
                                                                    })
                                                                }
                                                                <li className="page-item">
                                                                    <a className="page-link" aria-label="Next" style={{ cursor: 'pointer' }} onClick={() => { dispatchData({ type: 'SET_USERS_PAGE', payload: data.userTotalPage }) }}>
                                                                        <span aria-hidden="true">»</span>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </nav>
                                                    </div>

                                                    <table className="table table-borderless"
                                                    >
                                                        <thead>
                                                            <tr>
                                                                <th scope="col" style={{ textAlign: 'center' }}>Avatar</th>
                                                                <th scope="col">Name</th>
                                                                <th scope="col">Email</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {data.users.map((item, index) => (
                                                                <tr key={item.Id}>
                                                                    <th scope="row" style={{ textAlign: 'center' }}>
                                                                        <a><img src={item.Image ? `http://${host}/uploads/${item.Image}.jpg` : avatar} alt="" className="avatar" /></a>
                                                                    </th>
                                                                    <td>{item.Name}</td>
                                                                    <td className="fw-bold">{item.Email}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                {/* <!-- End List Users Overview Tab --> */}

                                                <div className="tab-pane fade profile-edit pt-3" id="users-leaderboard">

                                                    {/* <!-- Users LeaderBoard table --> */}
                                                    <div className="tab-title search nav">
                                                        <h5 className="card-title">Leader Board</h5>
                                                        <div className="datatable-search">
                                                            <input className="datatable-input" placeholder="Search..." type="search" title="Search within table" />
                                                        </div>

                                                        <nav aria-label="Page navigation example">
                                                            <ul className="pagination">
                                                                <li className="page-item">
                                                                    <a className="page-link" aria-label="Previous" style={{ cursor: 'pointer' }} onClick={() => {
                                                                        if (data.topUsersPage !== 1) {
                                                                            dispatchData({ type: 'SET_TOP_USERS_PAGE', payload: 1 });
                                                                        }
                                                                    }}>
                                                                        <span aria-hidden="true">«</span>
                                                                    </a>
                                                                </li>

                                                                {
                                                                    Array.from({ length: data.topUsersTotalPage }, (_, index) => {
                                                                        if (data.topUsersTotalPage > 10) {
                                                                            if ((index >= data.topUsersPage - 3 && index <= data.topUsersPage + 1) || // 2 pages before and after current page
                                                                                index >= data.topUsersTotalPage - 2) { // last 2 pages
                                                                                return (
                                                                                    <li className={`page-item ${data.topUsersPage === index + 1 ? 'active' : ''}`} key={index + 1} style={{ cursor: 'pointer' }}>
                                                                                        <a className="page-link" onClick={() => dispatchData({ type: 'SET_TOP_USERS_PAGE', payload: index + 1 })}>{index + 1}</a>
                                                                                    </li>
                                                                                );
                                                                            }
                                                                        } else {
                                                                            return (
                                                                                <li className={`page-item ${data.userPage === index + 1 ? 'active' : ''}`} key={index + 1} style={{ cursor: 'pointer' }}>
                                                                                    <a className="page-link" onClick={() => dispatchData({ type: 'SET_TOP_USERS_PAGE', payload: index + 1 })}>{index + 1}</a>
                                                                                </li>
                                                                            );
                                                                        }
                                                                    })
                                                                }

                                                                <li className="page-item">
                                                                    <a className="page-link" aria-label="Next" style={{ cursor: 'pointer' }} onClick={() => {
                                                                        if (data.topUsersPage !== data.topUsersTotalPage) {
                                                                            dispatchData({ type: 'SET_TOP_USERS_PAGE', payload: data.topUsersTotalPage });
                                                                        }
                                                                    }}>
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
                                                                <th scope="col" style={{ textAlign: 'center' }}>Avatar</th>
                                                                <th scope="col">Name</th>
                                                                <th scope="col">Email</th>
                                                                <th scope="col">Rank</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {data.topUsers.map((item, index) => (
                                                                <tr key={index}>
                                                                    <th scope="row" style={{ textAlign: 'center' }}>
                                                                        <a><img src={item.Image ? `http://${host}/uploads/${item.Image}.jpg` : avatar} alt="" className="avatar" /></a>
                                                                    </th>
                                                                    <td>{item.Name}</td>
                                                                    <td>{item.Email}</td>
                                                                    <td className="fw-bold">{item.Rank}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                    {/* <!-- Users LeaderBoard table --> */}

                                                </div>

                                                <div className="tab-pane fade pt-3" id="user-comments">

                                                    {/* <!-- Comment Table --> */}
                                                    <div className="tab-title search nav">
                                                        <div className="datatable-search">
                                                            <input className="datatable-input" placeholder="Search..." type="search" title="Search within table" />
                                                        </div>

                                                        <nav aria-label="Page navigation example">
                                                            <ul className="pagination">
                                                                <li className="page-item">
                                                                    <a className="page-link" aria-label="Previous">
                                                                        <span aria-hidden="true">«</span>
                                                                    </a>
                                                                </li>
                                                                <li className="page-item active"><a className="page-link">1</a></li>
                                                                <li className="page-item"><a className="page-link">2</a></li>
                                                                <li className="page-item"><a className="page-link">3</a></li>
                                                                <li className="page-item"><a className="page-link">4</a></li>
                                                                <li className="page-item"><a className="page-link">5</a></li>
                                                                <li className="page-item"><a className="page-link">6</a></li>
                                                                <li className="page-item"><a className="page-link">7</a></li>
                                                                <li className="page-item">
                                                                    <a className="page-link" aria-label="Next">
                                                                        <span aria-hidden="true">»</span>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </nav>
                                                    </div>
                                                    {/* <!-- End Comment Table --> */}

                                                    <h5 className="card-title">Nothing</h5>

                                                </div>

                                                <div className="tab-pane fade pt-3" id="banned-users">

                                                    {/* <!-- Users Banned List table --> */}
                                                    <div className="tab-title search nav">
                                                        <h5 className="card-title">Banned Users</h5>
                                                        <div className="datatable-search">
                                                            <input className="datatable-input" placeholder="Search..." type="search" title="Search within table" />
                                                        </div>

                                                        <nav aria-label="Page navigation example">
                                                            <ul className="pagination">
                                                                <li className="page-item">
                                                                    <a className="page-link" style={{ cursor: 'pointer' }} aria-label="Previous" onClick={() => {
                                                                        if (data.bannedUsersPage !== 1) {
                                                                            dispatchData({ type: 'SET_BANNED_USERS_PAGE', payload: 1 })
                                                                        }
                                                                    }}>
                                                                        <span aria-hidden="true">«</span>
                                                                    </a>
                                                                </li>

                                                                {
                                                                    Array.from({ length: data.bannedUsersTotalPage }, (_, index) => {
                                                                        if (data.userTotalPage > 10) {
                                                                            if ((index >= data.bannedUsersPage - 2 && index <= data.bannedUsersPage + 1) || // 2 pages before and after current page
                                                                                index >= data.bannedUsersTotalPage - 3) { // last 2 pages
                                                                                return (
                                                                                    <li className={`page-item ${data.bannedUsersPage === index + 1 ? 'active' : ''}`} key={index + 1} style={{ cursor: 'pointer' }}>
                                                                                        <a className="page-link" onClick={() => dispatchData({ type: 'SET_BANNED_USERS_PAGE', payload: index + 1 })}>{index + 1}</a>
                                                                                    </li>
                                                                                );
                                                                            }
                                                                        } else {
                                                                            return (
                                                                                <li className={`page-item ${data.bannedUsersPage === index + 1 ? 'active' : ''}`} key={index + 1} style={{ cursor: 'pointer' }}>
                                                                                    <a className="page-link" onClick={() => dispatchData({ type: 'SET_BANNED_USERS_PAGE', payload: index + 1 })}>{index + 1}</a>
                                                                                </li>
                                                                            );
                                                                        }
                                                                    })
                                                                }
                                                                <li className="page-item">
                                                                    <a className="page-link" style={{ cursor: 'pointer' }} aria-label="Next" onClick={() => {
                                                                        if (data.bannedUsersPage !== 1) {
                                                                            dispatchData({ type: 'SET_BANNED_USERS_PAGE', payload: data.bannedUsersPage })
                                                                        }
                                                                    }}>
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
                                                                <th scope="col" style={{ textAlign: 'center' }}>Avatar</th>
                                                                <th scope="col">Name</th>
                                                                <th scope="col">Get Banned Since</th>
                                                                <th scope="col">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>

                                                            {data.bannedUsers.map((item, index) => (
                                                                <tr key={index}>
                                                                    <th scope="row" style={{ textAlign: 'center' }}>
                                                                        <a><img src={item.avatar || avatar} alt="" className="avatar" /></a>
                                                                    </th>
                                                                    <td>{item.Name}</td>
                                                                    <td>{item.UpdateAt}</td>
                                                                    <td>
                                                                        <button type="button" className="btn btn-danger btn-sm" onClick={() => updateStatusUser(item.Name, "ADM7ANKA7YA7SVSNL5B6", "Active", item.Id)}>Enable User</button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>

                                                    </table>
                                                    {/* <!-- Users Banned List table --> */}

                                                </div>

                                            </div>
                                            {/* <!-- End Bordered Tabs --> */}

                                        </div>
                                    </div>

                                </div>
                                {/* <!-- End Tab Bar --> */}


                                {/* <!-- Recent New Users --> */}
                                <div className="col-12">
                                    <div className="card recent-sales overflow-auto">


                                        <div className="card-body">
                                            <h5 className="card-title">Recent New Users <span>| Today</span></h5>

                                            <table className="table table-borderless"
                                                style={{ textAlign: 'start' }}
                                            >
                                                <thead>
                                                    <tr>
                                                        <th scope="col" style={{ textAlign: 'center' }}>Avatar</th>
                                                        <th scope="col">Name</th>
                                                        <th scope="col">Email</th>
                                                        <th scope="col">Create At</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.newUser.map((item, index) => (
                                                        <tr key={index}>
                                                            <th scope="row" style={{ textAlign: 'center' }}>
                                                                <a><img src={item.avatar || avatar} alt="" className="avatar" /></a>
                                                            </th>
                                                            <td>{item.Name}</td>
                                                            <td className="fw-bold">{item.Email}</td>
                                                            <td><a className="text-primary fw-bold">{item.CreateAt}</a></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                        </div>

                                    </div>
                                </div>
                                {/* <!-- End Recent New Users --> */}


                                {/* <!-- Black Users List --> */}
                                <div className="col-12">
                                    <div className="card top-selling overflow-auto">

                                        <div className="card-body pb-0">
                                            <h5 className="card-title">Black Users List</h5>

                                            <table className="table table-borderless"
                                                style={{ textAlign: 'start' }}
                                            >
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Reported's Name</th>
                                                        <th scope="col" style={{ width: '50%' }}>Excuse</th>
                                                        <th scope="col">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.blackUser ? (
                                                        data.blackUser.map((item, index) => (
                                                            <tr key={index}>
                                                                <td><a className="text-primary fw-bold">{item.TargetName}</a></td>
                                                                <td >{item.Title}</td>
                                                                <td className="fw-bold black-user-buttons-group">
                                                                    <button type="button" className="btn btn-danger btn-sm"
                                                                        onClick={() => replyUserReports(item.Id, item.UserName, "ADM7ANKA7YA7SVSNL5B6", item.TargetID)}>Banned</button>
                                                                    <button onClick={() => repjectUserReports(item.Id, item.UserName, "ADM7ANKA7YA7SVSNL5B6", item.TargetID)} 
                                                                    type="button" className="btn btn-outline-warning btn-sm" >Deleted</button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="3">No black users found.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>

                                        </div>

                                    </div>
                                </div>
                                {/* <!-- End Black Users List --> */}

                            </div>
                        </div>
                        {/* <!-- End Left side columns --> */}


                        {/* <!-- Right side columns --> */}
                        <div className="col-lg-4">


                            {/* <!-- Recent Activity --> */}
                            <div className="card">
                                <div className="filter">
                                    <a className="icon" data-bs-toggle="dropdown">
                                        <ReactSVG
                                            src={more}
                                        />
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                        <li className="dropdown-header text-start">
                                            <h6>Filter</h6>
                                        </li>

                                        <li><a className="dropdown-item" onClick={(event) => {
                                            changeFilter(event, 'recent-activity-order-card-title-span', 'Waiting')
                                            getOrdersByStatus('Waiting')
                                        }}>Waiting</a></li>
                                        <li><a className="dropdown-item" onClick={(event) => {
                                            changeFilter(event, 'recent-activity-order-card-title-span', 'In Process')
                                            getOrdersByStatus('In Process')
                                        }}>In Process</a></li>
                                        <li><a className="dropdown-item" onClick={(event) => {
                                            changeFilter(event, 'recent-activity-order-card-title-span', 'Approve')
                                            getOrdersByStatus('Approve')
                                        }}>Approve</a></li>
                                        <li><a className="dropdown-item" onClick={(event) => {
                                            changeFilter(event, 'recent-activity-order-card-title-span', 'Denied')
                                            getOrdersByStatus('Denied')
                                        }}>Denied</a></li>
                                        <li><a className="dropdown-item" onClick={(event) => {
                                            changeFilter(event, 'recent-activity-order-card-title-span', 'Made')
                                            getOrdersByStatus('Made')
                                        }}>Made</a></li>
                                        <li><a className="dropdown-item" onClick={(event) => {
                                            changeFilter(event, 'recent-activity-order-card-title-span', 'In Delivery')
                                            getOrdersByStatus('In Delivery')
                                        }}>In Delivery</a></li>
                                        <li><a className="dropdown-item" onClick={(event) => {
                                            changeFilter(event, 'recent-activity-order-card-title-span', 'Done')
                                            getOrdersByStatus('Done')
                                        }}>Done</a></li>
                                    </ul>
                                </div>

                                <div className="card-body">
                                    <h5 className="card-title">Recent Activity Orders | <span id='recent-activity-order-card-title-span'>Waiting</span></h5>

                                    <div className="activity">

                                        {
                                            statistics.recentOrders.length !== 0 ?
                                                statistics.recentOrders.map((order, index) => {

                                                    return (
                                                        <div className="activity-item d-flex" key={index}>
                                                            <div className="activite-label" style={{
                                                                '--dot-background': changeDotColor(order.Status)
                                                            }}>{order.Status}</div>
                                                            <div className="activity-content">
                                                                {order.OrderItems}
                                                            </div>
                                                        </div>
                                                    )
                                                }) :
                                                <div className="activity-item d-flex">
                                                    <div className="activite-label">No record</div>
                                                </div>

                                        }
                                        {/* <!-- End activity item--> */}
                                    </div>

                                </div>
                            </div>
                            {/* <!-- End Recent Activity --> */}


                        </div>
                        {/* <!-- End Right side columns --> */}

                    </div>
                </section>
                {/* <!-- End Secion --> */}

            </main>
            {/* <!-- End Main --> */}
        </div >
    )
}

export default Users