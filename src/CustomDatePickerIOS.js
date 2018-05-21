import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {DatePickerIOS, Modal, StyleSheet, Text, TouchableHighlight, View} from 'react-native';

export default class CustomDatePickerIOS extends Component {
    static propTypes = {
        cancelText: PropTypes.string,
        confirmText: PropTypes.string,
        date: PropTypes.instanceOf(Date),
        type: PropTypes.oneOf(['date', 'time', 'datetime']),
        onConfirm: PropTypes.func,
        onCancel: PropTypes.func,
        titleText: PropTypes.string,
        isVisible:PropTypes.bool,
        titleStyle: PropTypes.any,
        confirmTextStyle: PropTypes.any,
        cancelTextStyle: PropTypes.any,
    };

    static defaultProps = {
        cancelText: 'Cancel',
        confirmText: 'Confirm',
        date: new Date(),
        type: 'date',
        titleText: 'Select a date',
        isVisible: false,
    };

    state = {
        date: this.props.date,
        isVisible:false,
        userIsInteractingWithPicker: false,
    };

    componentWillReceiveProps(nextProps) {
        let {isVisible} = nextProps;
        if (isVisible === undefined) {
            this.setState({isVisible});
        }
    }

    _handleCancel = () => {
        let {onCancel} = this.props;
        if(onCancel)onCancel();
    };

    _handleConfirm = () => {
        let {onConfirm} = this.props;
        if(onConfirm)onConfirm(this.state.date);
    };


    _handleDateChange = date => {
        this.setState({
            date,
            userIsInteractingWithPicker: false,
        });
    };

    _handleUserTouchInit = () => {
        this.setState({
            userIsInteractingWithPicker: true,
        });
        return false;
    };

    render() {
        const {
            type,
            titleText,
            confirmText,
            cancelText,
            titleStyle,
            confirmTextStyle,
            cancelTextStyle,
            isVisible,
            ...otherProps
        } = this.props;

        const titleContainer = (
            <View style={styles.titleContainer}>
                <Text style={[styles.title, titleStyle]}>{titleText}</Text>
            </View>
        );
        const confirmButton = <Text style={[styles.confirmText, confirmTextStyle]}>{confirmText}</Text>;

        const cancelButton = <Text style={[styles.cancelText, cancelTextStyle]}>{cancelText}</Text>;
        return (
            <Modal transparent={true} visible={isVisible}>
                <View style={[styles.datepickerContainer]}>
                    {titleContainer}
                    <View onStartShouldSetResponderCapture={this._handleUserTouchInit}>
                        <DatePickerIOS
                            date={this.state.date}
                            mode={type}
                            onDateChange={this._handleDateChange}
                            {...otherProps}
                        />
                    </View>
                    <TouchableHighlight
                        style={styles.confirmButton}
                        underlayColor='#ebebeb'
                        onPress={this._handleConfirm}
                        disabled={this.state.userIsInteractingWithPicker}
                    >
                        {confirmButton}
                    </TouchableHighlight>
                </View>

                <TouchableHighlight
                    style={styles.cancelButton}
                    underlayColor='#ebebeb'
                    onPress={this._handleCancel}>
                    {cancelButton}
                </TouchableHighlight>
            </Modal>
        );
    }
}

const BORDER_RADIUS = 13;
const BACKGROUND_COLOR = 'white';
const BORDER_COLOR = '#d5d5d5';
const TITLE_FONT_SIZE = 13;
const TITLE_COLOR = '#8f8f8f';
const BUTTON_FONT_WEIGHT = 'normal';
const BUTTON_FONT_COLOR = '#007ff9';
const BUTTON_FONT_SIZE = 20;

var styles =  StyleSheet.create({
    contentContainer: {
        justifyContent: 'flex-end',
        margin: 10,
    },
    datepickerContainer: {
        backgroundColor: BACKGROUND_COLOR,
        borderRadius: BORDER_RADIUS,
        marginBottom: 8,
        overflow: 'hidden',
    },
    titleContainer: {
        borderBottomColor: BORDER_COLOR,
        borderBottomWidth: StyleSheet.hairlineWidth,
        padding: 14,
        backgroundColor: 'transparent',
    },
    title: {
        textAlign: 'center',
        color: TITLE_COLOR,
        fontSize: TITLE_FONT_SIZE,
    },
    confirmButton: {
        borderColor: BORDER_COLOR,
        borderTopWidth: StyleSheet.hairlineWidth,
        backgroundColor: 'transparent',
        height: 57,
        justifyContent: 'center',
    },
    confirmText: {
        textAlign: 'center',
        color: BUTTON_FONT_COLOR,
        fontSize: BUTTON_FONT_SIZE,
        fontWeight: BUTTON_FONT_WEIGHT,
        backgroundColor: 'transparent',
    },
    cancelButton: {
        backgroundColor: BACKGROUND_COLOR,
        borderRadius: BORDER_RADIUS,
        height: 57,
        justifyContent: 'center',
    },
    cancelText: {
        padding: 10,
        textAlign: 'center',
        color: BUTTON_FONT_COLOR,
        fontSize: BUTTON_FONT_SIZE,
        fontWeight: '600',
        backgroundColor: 'transparent',
    },
});
