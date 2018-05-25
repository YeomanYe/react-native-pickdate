import {Platform} from 'react-native';
import {DATE_TYPE, WrapAndroidDatePicker, WrapIosDatePicker} from './WrapPicker';

const IOS = Platform.OS === 'ios';

let pickDate = async function (onConfirm,type,onCancel){
    let paramObj;
    if(!(onConfirm instanceof Function) && (onConfirm instanceof Object)){
        paramObj = onConfirm;
    }else{
        paramObj = {onConfirm,type,onCancel};
    }
    if(IOS) WrapIosDatePicker.showPicker(paramObj);
    else await WrapAndroidDatePicker.showPicker(paramObj);
};
pickDate.TYPE = DATE_TYPE;

export default pickDate;
