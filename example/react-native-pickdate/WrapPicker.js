import {DatePickerAndroid, TimePickerAndroid} from 'react-native';

const DATE_TYPE = {
    DATE: 'date',
    TIME: 'time',
    DATETIME: 'datetime',
};

export class WrapAndroidDatePicker{
    static TYPE = DATE_TYPE;
   static async showPicker(type = WrapAndroidDatePicker.TYPE.DATE,confirmHandler,cancelHandler){
       let retTime,retDate;
       if(type === WrapAndroidDatePicker.TYPE.DATE){
           retDate = await WrapAndroidDatePicker._showDatePicker(cancelHandler);
           if(confirmHandler && retDate) confirmHandler(new Date(retDate));
       }
       else if (type === WrapAndroidDatePicker.TYPE.DATETIME){
           retDate = await WrapAndroidDatePicker._showDatePicker();
           retTime = await WrapAndroidDatePicker._showTimePicker();
           if(retDate && retTime && confirmHandler) confirmHandler(new Date(retDate+' '+retTime));
           else if(cancelHandler) cancelHandler();
       }else{
           retTime = await WrapAndroidDatePicker._showTimePicker(cancelHandler);
           retDate = '1970-01-01';
           if(confirmHandler && retTime) confirmHandler(new Date(retDate + ' ' + retTime));
       }
    }
    static async _showDatePicker(cancelHandler){
        let retDateStr;
        try {
            let {action, year, month, day} = await DatePickerAndroid.open({
                date: new Date()
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                // 这里开始可以处理用户选好的年月日三个参数：year, month (0-11), day
                console.log(year,month,day);
                month++;
                retDateStr = prettifyNum(year,month,day,'-');
            }else if(cancelHandler){
                cancelHandler();
            }
        } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
        }
        return retDateStr;
    }
    static async _showTimePicker(cancelHandler){
        let retDateStr = '';
        try {
            const {action, hour, minute} = await TimePickerAndroid.open({
                is24Hour: false, // 会显示为'2 PM'
            });
            if (action !== TimePickerAndroid.dismissedAction) {
                // 这里开始可以处理用户选好的时分两个参数：hour (0-23), minute (0-59)
                console.log(hour,minute);
                retDateStr = prettifyNum(hour,minute,':');
            }else if(cancelHandler){
                cancelHandler();
            }
        } catch ({code, message}) {
            console.warn('Cannot open time picker', message);
        }
        return retDateStr;
    }
}

function prettifyNum(){
    console.log(arguments);
    let len = arguments.length;
    let hypen = arguments[len - 1];
    let nums = [].slice.call(arguments,0,len-1);
    let str = '';
    for(let num of nums){
        if (typeof num === 'number' && num < 10) str += '0'+num+hypen;
        else if(typeof num === 'number' && num >= 10) str += num+hypen;
        else str += num.length >= 2 ? num + hypen : '0' + num + hypen;
    }
    str = str.substr(0,str.length - 1);
    console.log(str);
    return str;
}