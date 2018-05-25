# react-native-pickdate
A simple way to pick date through native date-picker and time-picker inside a modal.

## usage
```html
import pickDate from 'react-native-pickdate';

 <TouchableOpacity
    onPress={()=>pickDate(confirmHandler,pickDate.TYPE.TIME)}>
    <View style={styles.button}>
        <Text>选择日期</Text>
    </View>
</TouchableOpacity>
```

## screenshot

![Android](screenshot/pickdate-android.png)
![ios](screenshot/pickdate-ios.png)

## Install
`npm install --save react-native-pickdate` or `yarn add react-native-pickdate`.

## Available options
|     Name    |  Type  |           Default           |                      Description                       |
|-------------|--------|-----------------------------|--------------------------------------------------------|
| cancelText  | string | 'Cancel'                    | The text on the cancel button on iOS                   |
| confirmText | string | 'Confirm'                   | The text on the confirm button on iOS                  |
| titleText   | string | 'Pick a date'/'Pick a time' | The title text on iOS                                  |
| onConfirm   | func   |                             | confirm handler                                        |
| onCancel    | func   |                             | cancel handler                                         |
| is24Hour    | bool   | true                        | If false, the picker shows an AM/PM chooser on Android |
| date        | Date   | new Date()                  | default show date                                      |
| type        | string | pickDate.TYPE.DATE          | date / time /datetime                                  |

## Thanks
[react-native-root-siblings](https://github.com/magicismight/react-native-root-siblings)

[react-native-modal-datetime-picker](https://github.com/mmazzarolo/react-native-modal-datetime-picker)
