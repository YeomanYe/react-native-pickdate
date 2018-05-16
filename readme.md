# react-native-pickdate
react native pick date

## usage
```html
import pickDate from './react-native-pickdate';

 <TouchableOpacity
    onPress={()=>pickDate(confirmHandler,pickDate.TYPE.TIME)}>
    <View style={styles.button}>
        <Text>选择日期</Text>
    </View>
</TouchableOpacity>
```