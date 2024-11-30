import axios from 'axios';

const AxiosInstance = (contentType = 'application/json') => {
    const axiosInstance = axios.create({
        // baseURL: 'http://127.0.0.1:8686/'
        // baseURL: 'http://192.168.1.4:8686/'
        baseURL: 'http://192.168.1.6:8686/'

    });

    axiosInstance.interceptors.request.use(
        async (config) => {
            // const token = await AsyncStorage.getItem('token');
            config.headers = {
                'Authorization': `Bearer ${''}`,
                'Accept': 'application/json',
                'Content-Type': contentType
            }
            return config;
        },
        err => Promise.reject(err)
    );

    axiosInstance.interceptors.response.use(
        res => res.data,
        err => Promise.reject(err)
    );
    return axiosInstance;
};

export default AxiosInstance;