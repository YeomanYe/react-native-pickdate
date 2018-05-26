import {
    DatePickerAndroid,
    TimePickerAndroid
} from 'react-native';
import CustomDatePickerIOS from "./CustomDatePickerIOS";
import React, {
    Component
} from "react";
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
    static _genDatePickerCallback(callback) {
        return async function(val) {
            if (callback) await callback(val);
            WrapIosDatePicker._hideDatePicker();
        }
    }

    /**
     * 生成datepicker
     * @param type
     * @param onConfirm
     * @param onCancel
     * @returns {*}
     * @private
     */
    static _genDatePicker(paramObj) {
        paramObj.onConfirm = WrapIosDatePicker._genDatePickerCallback(paramObj.onConfirm);
        paramObj.onCancel = WrapIosDatePicker._genDatePickerCallback(paramObj.onCancel);
        paramObj.isVisible = true; //show
        if (!paramObj.titleText)
            switch (type) {
                case DATE_TYPE.TIME:
                    paramObj.titleText = 'Pick a date';
                    break;
                case DATE_TYPE.DATETIME:
                case DATE_TYPE.DATE:
                    paramObj.titleText = 'Pick a time';
                    break;
            }
        return (
            <CustomDatePickerIOS {...paramObj}/>)
    }

    /**
     * 显示IOS的date picker
     * @returns {*}
     * @param paramObj
     */
    static showPicker(paramObj) {
        let dateComp = WrapIosDatePicker._genDatePicker(paramObj);
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

export class WrapAndroidDatePicker {
    static async showPicker({
        type,
        onConfirm,
        onCancel,
        date,
        is24Hour
    }) {
        type = type || DATE_TYPE.DATE;
        let retTime, retDate;
        if (type === DATE_TYPE.DATE) {
            retDate = await WrapAndroidDatePicker._showDatePicker(date);
            if (retDate) {
                if (onConfirm) onConfirm(new Date(retDate));
            } else {
                if (onCancel) onCancel();
            }
        }
        else if (type === DATE_TYPE.DATETIME) {
            retDate = await WrapAndroidDatePicker._showDatePicker(date);
            if (!retDate) {
                if (onCancel) onCancel();
                return;
            }
            retTime = await WrapAndroidDatePicker._showTimePicker(date, is24Hour);
            if (retTime) {
                if (onConfirm) onConfirm(new Date(retDate + ' ' + retTime));
            } else {
                if (onCancel) onCancel();
            }
        } else {
            retTime = await WrapAndroidDatePicker._showTimePicker(date, is24Hour);
            retDate = '1970-01-01';
            if (retTime) {
                if (onConfirm) onConfirm(new Date(retDate + ' ' + retTime));
            } else {
                if (onCancel) onCancel();
            }
        }
    }
    static async _showDatePicker(date) {
        let retDateStr;
        console.log(date);
        try {
            let {
                action,
                year,
                month,
                day
            } = await DatePickerAndroid.open({
                date: date || new Date()
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                // 这里开始可以处理用户选好的年月日三个参数：year, month (0-11), day
                console.log(year, month, day);
                month++;
                retDateStr = prettifyNum(year, month, day, '-');
            }
        } catch ({
            code,
            message
        }) {
            console.warn('Cannot open date picker', message);
        }
        return retDateStr;
    }
    static async _showTimePicker(date, is24Hour = true) {
        let retDateStr = '';
        date = date || new Date();
        try {
            const {
                action,
                hour,
                minute
            } = await TimePickerAndroid.open({
                is24Hour: is24Hour,
                hour: date.getHours(),
                minute: date.getMinutes()
            });
            if (action !== TimePickerAndroid.dismissedAction) {
                // 这里开始可以处理用户选好的时分两个参数：hour (0-23), minute (0-59)
                console.log(hour, minute);
                retDateStr = prettifyNum(hour, minute, ':');
            }
        } catch ({
            code,
            message
        }) {
            console.warn('Cannot open time picker', message);
        }
        return retDateStr;
    }
}

function prettifyNum() {
    console.log(arguments);
    let len = arguments.length;
    let hypen = arguments[len - 1];
    let nums = [].slice.call(arguments, 0, len - 1);
    let str = '';
    for (let num of nums) {
        if (typeof num === 'number' && num < 10) str += '0' + num + hypen;
        else if (typeof num === 'number' && num >= 10) str += num + hypen;
        else str += num.length >= 2 ? num + hypen : '0' + num + hypen;
    }
    str = str.substr(0, str.length - 1);
    // console.log(str);
    return str;
}