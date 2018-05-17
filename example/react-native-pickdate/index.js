import {Platform} from 'react-native';
import {WrapAndroidDatePicker,DATE_TYPE} from './WrapPicker';
const ios = Platform.OS === 'ios' ? true : false;

let pickDate = async function (confirmHandler,type,cancelHandler){
    if(ios) ;
    else await WrapAndroidDatePicker.showPicker(type,confirmHandler,cancelHandler);
};
pickDate.TYPE = DATE_TYPE;

export default pickDate;