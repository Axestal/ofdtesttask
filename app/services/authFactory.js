authFactory.$inject = ['API_POINT', '$rootScope', '$http', '$httpParamSerializerJQLike'];

/**
 * Фабрика авторизации/регистрации пользователя
 * @param API_POINT - хост API приложения
 * @param $rootScope
 * @param $http
 * @param $httpParamSerializerJQLike
 * @returns
 */
function authFactory(API_POINT, $rootScope, $http, $httpParamSerializerJQLike) {
    const AUTH_CHANGE_EVENT_NAME = 'user.auth.change'; //событие изменения авторизации пользователя
    let __isLogged = false; //состояние авторизации, гость - false, авторизованный пользователь - true
    let __token = null; //токен авторизованного пользователя
    let __username = null;

    return {
        AUTH_CHANGE_EVENT_NAME: AUTH_CHANGE_EVENT_NAME,
        isLogged: isLogged,
        getToken: getToken,
        getUsername: getUsername,
        prepareUserData: prepareUserData,
        validateUserData: validateUserData,
        registerUser: registerUser,
        authUser: authUser,
        logout: logout
    };

    function isLogged() {
        return __isLogged;
    }

    function getToken() {
        return __token;
    }

    function getUsername() {
        return __username;
    }

    /**
     * Регистрация пользователя
     * @param userData - результат метода prepareUserData
     * @returns Promise
     */
    function registerUser(userData) {
        let url = API_POINT + '/api/register/';

        return $http({
            method: 'POST',
            url: url,
            data: $httpParamSerializerJQLike(userData),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (response) {
            let result = response.data;
            if (result.success === true) {
                __username = userData.username;
                __token = result.token;
                __isLogged = true;
                $rootScope.$broadcast(AUTH_CHANGE_EVENT_NAME);
                return __username;
            } else {
                throw new AuthApiError(result.message);
            }
        }).catch(function (error) {
            if (error instanceof AuthApiError) {
                throw error;
            }
            throw new AuthApiError("Failed to register user");
        });
    }

    /**
     * Авторизация пользователя
     * @param userData - результат метода prepareUserData
     * @returns Promise
     */
    function authUser(userData) {
        let url = API_POINT + '/api/login/';

        return $http({
            method: 'POST',
            url: url,
            data: $httpParamSerializerJQLike(userData),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (response) {
            let result = response.data;
            if (result.success === true) {
                __username = userData.username;
                __token = result.token;
                __isLogged = true;
                $rootScope.$broadcast(AUTH_CHANGE_EVENT_NAME);
                return __username;
            } else {
                throw new AuthApiError(result.message);
            }
        }).catch(function (error) {
            if (error instanceof AuthApiError) {
                throw error;
            }
            throw new AuthApiError("Failed to auth user");
        });

    }

    /**
     * Выход из учетной записи
     */
    function logout() {
        __username = null;
        __token = null;
        __isLogged = false;
        $rootScope.$broadcast(AUTH_CHANGE_EVENT_NAME);
    }

    /**
     * Форматирование данных форм ввода
     * @param username - логи пользователя
     * @param password - пароль
     * @returns {{password: string, username: string}}
     * P.S. Лучше создать класс пользователя User и поместить форматирование в конструктор
     */
    function prepareUserData(username, password) {
        username = String(username).trim();
        password = String(password);

        return {
            username: username,
            password: password
        }
    }

    /**
     * Валидация данных пользователя
     * @param data - результат функции prepareUserData
     * @returns {{valid: boolean, errors: []}}
     */
    function validateUserData(data) {
        let errors = [];
        let username = data.username;
        let password = data.password;

        if (username.length <= 3) {
            errors.push("Username should be more than 3 characters");
        }

        if (password.length <= 3) {
            errors.push("Username should be more than 3 symbols");
        }

        return {
            valid: errors.length === 0,
            errors: errors
        }
    }

}