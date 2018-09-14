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
            let {year,month,day} = await WrapAndroidDatePicker._showDatePicker(date);
            if (year && onConfirm) onConfirm(new Date(year,month - 1,day));
            else if (onCancel) onCancel();
        }
        else if (type === DATE_TYPE.DATETIME) {
            let {year,month,day} = await WrapAndroidDatePicker._showDatePicker(date);
            if (!year){
                if(onCancel) onCancel();
                return;
            }
            let {hour,minute} = await WrapAndroidDatePicker._showTimePicker(date, is24Hour);
            if (hour && onConfirm) onConfirm(new Date(year,month - 1,day,hour,minute));
            else if (onCancel) onCancel();
        } else {
            let {hour,minute} = await WrapAndroidDatePicker._showTimePicker(date, is24Hour);
            if (hour && onConfirm) onConfirm(new Date(1970,1,1,hour,minute));
            else if (onCancel) onCancel();
        }
    }
    static async _showDatePicker(date) {
        let retDateObj = {};
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
                retDateObj = {year, month, day};
            }
        } catch ({
            code,
            message
        }) {
            console.warn('Cannot open date picker', message);
        }
        return retDateObj;
    }
    static async _showTimePicker(date, is24Hour = true) {
        let retDateObj = {};
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
                retDateObj = {hour,minute};
            }
        } catch ({
            code,
            message
        }) {
            console.warn('Cannot open time picker', message);
        }
        return retDateObj;
    }
}
