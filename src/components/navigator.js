import { StackNavigator } from 'react-navigation';
import DayView from "../screens/DayView";
import CalendarPicker from "../screens/Calendar";

export const RouteNavigator = StackNavigator({
    DayView: {screen: DayView},
    Calendar: {screen: CalendarPicker},

});