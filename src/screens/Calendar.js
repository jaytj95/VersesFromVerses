import {AppState, Image, Animated, findNodeHandle, StyleSheet, Text, View, StatusBar} from 'react-native'
import React, {Component} from 'react';
import {Icon} from 'react-native-elements';
import images from "../assets/images";
import {Calendar} from "react-native-calendars";
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

var randomInt = require('random-int');


let v4v_data = require('../assets/versesfromverses.json');
export default class CalendarPicker extends React.Component {
    static navigationOptions = {
        header: null,
    };

    componentWillMount() {
        let randomNum = randomInt(119)
        this.setState({imageUri: images[randomNum]})
    }

    constructor(props) {
        super(props);
        this.state = {
            appState: AppState.currentState,
            viewRef: undefined,
            displayBlur: true,
            contentFadeAnim: new Animated.Value(0),
        };
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
        Animated.timing(
            this.state.contentFadeAnim,
            {
                toValue: 1,
                duration: 5000,
            }).start();
    }

    imageLoaded() {
        this.setState({ viewRef: findNodeHandle(this.backgroundImage) });
    }

    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground!')
            this.forceUpdate();
        }
        this.setState({appState: nextAppState});
    }

    selectDay(day) {
        var date = new Date(day.timestamp+8.64e+7)
        this.props.navigation.navigate('DayView', {dateProp: date})
    }

    render() {
        let { contentFadeAnim } = this.state;

        const {goBack} = this.props.navigation;

        return (
            <View style={styles.MainContainer}>
                <StatusBar
                    hidden={true}
                />
                <Image
                    ref={(img) => { this.backgroundImage = img; }}
                    onLoadEnd={this.imageLoaded.bind(this)}
                    source={this.state.imageUri}
                    style={styles.image}>
                </Image>

                <View
                    style={styles.absolute2}
                    viewRef={this.state.viewRef}/>

                <View>
                    <View style={{marginTop: responsiveWidth(20), flex: 9, height: null, width: null,
                        justifyContent: 'center', alignItems: 'center'}}>
                        {this.state.displayBlur &&
                        <View
                            style={
                                {
                                    margin: 10,
                                    height: responsiveHeight(50),
                                    width: responsiveHeight(50),
                                }
                            }>
                            <Calendar
                                style={styles.calendar}
                                minDate={'2018-01-01'}
                                maxDate={'2018-12-31'}
                                disableMonthChange={true}
                                hideArrows={false}
                                onDayPress={(day) => {this.selectDay(day)}}
                                theme={{

                                    textDayFontSize: responsiveFontSize(2),
                                    textMonthFontSize: responsiveFontSize(2),
                                    textDayHeaderFontSize: responsiveFontSize(1.5)
                                }}
                            />
                        </View>
                        }
                    </View>
                    <View style={{flex: 1, alignItems: 'center'}}>

                        <Icon
                            name='arrow-left'
                            type='feather'
                            color='#fff'
                            onPress={() => goBack()}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    MainContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: null,
        height: null,
    },
    image: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        resizeMode: 'cover',
        width: null,
        height: null,
    },
    absolute: {
        position: "absolute",
        top: 0, left: 0, bottom: 0, right: 0,
    },
    absolute2: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        position: "absolute",
        top: 0, left: 0, bottom: 0, right: 0,
    },
});
module.exports = CalendarPicker;