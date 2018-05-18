import {DatePickerAndroid, TimePickerAndroid} from 'react-native';
import CustomDatePickerIOS from "./CustomDatePickerIOS";
import React,{Component} from "react";
import RootSiblings from "react-native-root-siblings";

export const DATE_TYPE = {
    DATE: 'date',
    TIME: 'time',
    DATETIME: 'datetime',
};
export class WrapIosDatePicker extends Component {

    static _datePicker;

    /**
     * 生成回调函数
     * @param callback
     * @returns {Function}
     * @private
     */
    static _genDatePickerCallback(callback){
        return async function(val){
            let uClose = false;
            if(callback){uClose = await callback(val);}
            if(!uClose)WrapIosDatePicker._hideDatePicker();
        }
    }

    /**
     * 生成datepicker
     * @param type
     * @param success
     * @param cancel
     * @returns {*}
     * @private
     */
    static _genDatePicker(type,success, cancel){
        let suc = WrapIosDatePicker._genDatePickerCallback(success),
            can = WrapIosDatePicker._genDatePickerCallback(cancel);
        let title;
        switch (type){
            case DATE_TYPE.TIME:title = '选择时间';break;
            case DATE_TYPE.DATETIME:
            case DATE_TYPE.DATE:title = '选择日期';break;
        }
        return (
            <CustomDatePickerIOS
                isVisible={true}
                type={type}
                titleText={title}
                onConfirm={suc}
                cancelText='取消'
                confirmText='确定'
                onCancel={can}/>)
    }

    /**
     * 显示IOS的date picker
     * @param type
     * @param confirmHandler
     * @param cancelHandler
     * @returns {*}
     */
    static showPicker(type = DATE_TYPE.DATE,confirmHandler,cancelHandler){
        let dateComp = WrapIosDatePicker._genDatePicker(type,confirmHandler, cancelHandler);
        if (!WrapIosDatePicker._datePicker) WrapIosDatePicker._datePicker = new RootSiblings(dateComp);
        else WrapIosDatePicker._datePicker.update(dateComp);
        return WrapIosDatePicker._datePicker;
    }

    /**
     * 隐藏datepicker
     * @returns {*}
     * @private
     */
    static _hideDatePicker() {
        if (WrapIosDatePicker._datePicker)
            return WrapIosDatePicker._datePicker.update(<CustomDatePickerIOS isVisible={false}/>);
    }

}

export class WrapAndroidDatePicker{
   static async showPicker(type = DATE_TYPE.DATE,confirmHandler,cancelHandler){
       let retTime,retDate;
       if(type === DATE_TYPE.DATE){
           retDate = await WrapAndroidDatePicker._showDatePicker(cancelHandler);
           if(confirmHandler && retDate) confirmHandler(new Date(retDate));
       }
       else if (type === DATE_TYPE.DATETIME){
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