/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import pickDate from './react-native-pickdate';

type Props = {};
export default class App extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            curSel: '未选择'
        };
    }

    createUpdate(type){
        let formatStr;
        switch (type){
            case 'date':formatStr = 'YYYY-MM-dd';break;
            case 'time':formatStr = 'hh:mm';break;
            case 'datetime':formatStr = 'YYYY-MM-dd hh:mm';break;
        }
        let self = this;
        return (date)=>{
            let curSel = format(date,formatStr);
            self.setState({curSel});
        }
    }

    render() {
        let {curSel} = this.state;
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={()=>pickDate(this.createUpdate('date'))}>
                    <View style={styles.button}>
                        <Text>选择日期</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={()=>pickDate(this.createUpdate('time'),pickDate.TYPE.TIME)}>
                    <View style={styles.button}>
                        <Text>选择时间</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={()=>pickDate(this.createUpdate('datetime'),pickDate.TYPE.DATETIME)}>
                    <View style={styles.button}>
                        <Text>选择日期和时间</Text>
                    </View>
                </TouchableOpacity>
                <Text style={styles.text}>{curSel}</Text>
            </View>
        );
    }
}

function format(date, formatStr) {
    let str = formatStr;
    let Week = ['日', '一', '二', '三', '四', '五', '六'];

    str = str.replace(/yyyy|YYYY/, date.getFullYear());
    str = str.replace(/yy|YY/, (date.getYear() % 100) > 9 ? (date.getYear() % 100).toString() : '0' + (date.getYear() % 100));
    let month = date.getMonth() + 1;
    str = str.replace(/MM/, month > 9 ? month.toString() : '0' + month);
    str = str.replace(/M/g, month);

    str = str.replace(/w|W/g, Week[date.getDay()]);

    str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate());
    str = str.replace(/d|D/g, date.getDate());

    str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
    str = str.replace(/h|H/g, date.getHours());
    str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes());
    str = str.replace(/m/g, date.getMinutes());

    str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds());
    str = str.replace(/s|S/g, date.getSeconds());
    return str;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    button:{
        borderRadius:5,
        marginTop:15,
        padding:10,
        borderWidth:1,
        borderColor:'black',
        backgroundColor:'white',
    },
    text:{
        marginTop:15
    }
});
