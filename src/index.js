import {Platform} from 'react-native';
import {DATE_TYPE, WrapAndroidDatePicker, WrapIosDatePicker} from './WrapPicker';
import React from "react";

const IOS = Platform.OS === 'ios';

let pickDate = async function (confirmHandler,type,cancelHandler){
    if(IOS) WrapIosDatePicker.showPicker(type,confirmHandler,cancelHandler);
    else await WrapAndroidDatePicker.showPicker(type,confirmHandler,cancelHandler);
};
pickDate.TYPE = DATE_TYPE;

export default pickDate;