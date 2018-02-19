import {
    Share, AppState, Image, Animated, findNodeHandle, StyleSheet, Text, View, StatusBar,
    TouchableOpacity
} from 'react-native'
import React, {Component} from 'react';
import {Icon} from 'react-native-elements';
import images from "../assets/images";
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import Mailer from 'react-native-mail';
var randomInt = require('random-int');



let v4v_data = require('../assets/versesfromverses.json');
export default class DayView extends React.Component {
    static navigationOptions = {
        header: null,
    };

    componentWillMount() {
        let weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', ];

        var months = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        var now = new Date();
        if (this.state.dateProp !== undefined) {
            now = this.state.dateProp;
        }

        let start = new Date(now.getFullYear(), 0, 0);
        let diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        let oneDay = 1000 * 60 * 60 * 24;
        let yearDay = Math.floor(diff / oneDay);

        let weekday = weekdays[now.getDay()];
        let month = months[now.getMonth()];
        let monthDay = now.getDate();
        let year = now.getFullYear();
        let dateFormat = weekday + ', ' + month + ' ' + monthDay + ', ' + year

        let randomNum = randomInt(119)
        var path = '../assets/imgs/' + randomNum + '.jpg';
        this.setState({fullDate: dateFormat, yearDay: yearDay, info: v4v_data[yearDay-1], imageUri: images[randomNum]})
    }

    gotoCalendar() {
        this.props.navigation.navigate('Calendar')
    }

    handleEmail = () => {
        Mailer.mail({
            subject: 'Verses From Verses: Feedback',
            recipients: [''],
        }, (error, event) => {
            console.log(error, event)
        });
    }

    handleShare = () => {
        let message = this.state.info.poem
        Share.share({
            message: "\"" + message + "\"" + "\n\n" + this.state.info.verse + "\n" + this.state.info.versetext,
            title: 'Verses from Verses: ' + this.state.fullDate
        }, {
            // Android only:
            dialogTitle: 'Share today\'s verse and poem',
        })
    }
    constructor(props) {
        super(props);

        var dateProp = undefined
        if (props.navigation.state.params !== undefined) {
           dateProp = props.navigation.state.params.dateProp
        }
        this.state = {
            appState: AppState.currentState,
            viewRef: undefined,
            displayBlur: true,
            dateProp: dateProp,
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
                duration: 2500,
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

    render() {
        let { contentFadeAnim } = this.state;
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
                    <View style={{marginTop: 20, flex: 9, height: null, width: null,
                        justifyContent: 'center', alignItems: 'center'}}>
                        {this.state.displayBlur &&
                            <Animated.View
                                style={
                                    {
                                        opacity: contentFadeAnim,
                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                        padding: 40,
                                        margin: 10,
                                    }
                                }>
                                <Text style={styles.TodaysDate}>Today is {this.state.fullDate}</Text>
                                <Text style={styles.Poem}>{this.state.info.poem}</Text>
                            </Animated.View>
                        }
                        <Text style={styles.VerseRef}>{this.state.info.verse}</Text>
                        <Text style={styles.Verse}>{this.state.info.versetext}</Text>
                    </View>
                    <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row', marginLeft: responsiveFontSize(2), marginRight: responsiveFontSize(2)}}>

                        <TouchableOpacity
                            onPress={this.handleEmail.bind(this)}>
                            <Icon
                                name='mail'
                                type='entypo'
                                size={responsiveFontSize(3)}
                                color='#fff'
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.gotoCalendar.bind(this)}>
                            <Icon
                                name='calendar'
                                type='font-awesome'
                                size={responsiveFontSize(3)}
                                color='#fff'
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.handleShare.bind(this)}>
                            <Icon
                                name='share'
                                type='entypo'
                                size={responsiveFontSize(3)}
                                color='#fff'
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    TodaysDate: {
        textAlign: 'center',
        color: '#adadad',
        fontSize: responsiveFontSize(2),
    },
    VerseRef: {
        color: '#fff',
        fontSize: responsiveFontSize(2),
        marginTop: 50,
    },
    Verse: {
        color: '#bfbfbf',
        fontSize: responsiveFontSize(1.5),
        marginLeft: responsiveWidth(5),
        marginRight: responsiveWidth(5),
        textAlign: 'center',
    },
    Poem: {
        marginTop: 15,
        textAlign: 'center',
        color: '#fff',
        fontSize: responsiveFontSize(2.1),
    },
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
module.exports = DayView;