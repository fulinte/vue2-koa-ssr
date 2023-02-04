class AxiosUtils {
    constructor(methodMessage) {
        // 提示信息处理方法
        this.Message = methodMessage;
    }

    defaultAbnormalSituationHandling(response) {
        var { msg, command, explanation } = response;

        switch (command) {
            case 'need-login':
            case 'warning_access_authorization':
                localStorage.clear();
                sessionStorage.clear();
                this.Message('warning', msg);
                break;
            case 'request_cancel':
                console.log(response);
                break;
            default:
                this.Message('error', msg);
                break;
        }

        // console.log('Axios-defaultAbnormalSituationHandling');
        // console.log(response);
    }
}

export default AxiosUtils;
