// @flow
import { Dimensions, StyleSheet } from 'react-native'
import { color } from '../../theme'

const SECTION_HEADER_HEIGHT = 40
const SECTIONS_LEFT_OFFSET = 49

const leftMargin = 50 - 1

export default function styleConstructor (
  theme = {},
  calendarHeight
) {
  let style = {
    container: {
      flex: 1,
      backgroundColor: '#F0F4FF',
      ...theme.container
    },
    contentStyle: {
      height: calendarHeight + 10
    },
    header: {
      paddingHorizontal: 5,
      marginBottom: 28,
      // flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      ...theme.header
    },
    headerText: {
      fontSize: 16,
      marginBottom: 25,
      ...theme.headerText
    },
    arrow: {
      width: 28,
      height: 28,
      resizeMode: 'contain'
    },
    event: {
      position: 'absolute',
      backgroundColor: '#F0F4FF',
      opacity: 0.8,
      borderColor: '#DDE5FD',
      borderWidth: 1,
      borderRadius: 5,
      // paddingLeft: 4,
      minHeight: 25,
      flex: 1,
      paddingTop: 5,
      paddingBottom: 0,
      flexDirection: 'column',
      alignItems: 'flex-start',
      overflow: 'hidden',
      ...theme.event
    },
    eventDisabled: {
      backgroundColor: '#7a7a7a',
      opacity: 0.75,
      borderColor: '#7a7a7a',
      ...theme.eventDisabled
    },
    eventTitle: {
      color: '#fff',
      fontWeight: '600',
      minHeight: 15,
      ...theme.eventTitle
    },
    eventSummary: {
      color: '#615B73',
      fontSize: 12,
      flexWrap: 'wrap',
      ...theme.eventSummary
    },
    eventTimes: {
      marginTop: 3,
      fontSize: 10,
      fontWeight: 'bold',
      color: '#615B73',
      flexWrap: 'wrap',
      ...theme.eventTimes
    },
    emptyCell: {
      opacity: 0.01,
      backgroundColor: 'rgb(0,0,0)',
      position: 'absolute',
      ...theme.emptyCell
    },
    line: {
      height: 1,
      position: 'absolute',
      left: leftMargin,
      backgroundColor: 'rgb(255,255,255)',
      ...theme.line
    },
    lineHalf: {
      // height: 1,
      position: 'absolute',
      left: leftMargin,
      borderWidth: 1,
      borderColor: '#fff',
      opacity: 0.5,
      ...theme.lineDashed
    },
    lineQuarter: {
      position: 'absolute',
      left: leftMargin,
      borderWidth: 1,
      borderColor: '#fff',
      borderStyle: 'dashed',
      opacity: 0.5,
      borderRadius: 1, // fix, so 'dashed' would apply
      ...theme.lineDashed
    },
    lineNow: {
      height: 1,
      position: 'absolute',
      left: leftMargin,
      backgroundColor: 'red',
      ...theme.lineNow
    },
    verticalLine: {
      width: 1,
      height: calendarHeight,
      position: 'absolute',
      backgroundColor: 'rgb(0,216,14)',
      ...theme.verticalLine
    },
    timeLabel: {
      position: 'absolute',
      left: 10,
      textAlign: 'right',
      color: 'rgb(255,255,255)',
      fontSize: 13,
      fontFamily: 'Helvetica Neue',
      fontWeight: '500',
      ...theme.timeLabel
    },
    weekDatesContainer: {
      alignItems: 'center',
      justifyContent: 'space-between',
      width: Dimensions.get('screen').width,
      left: 2,
      ...theme.weekDatesContainer
    },
    singleWeekContainer: {
      flexDirection: 'row',
      ...theme.singleWeekContainer
    },
    weekDate: {
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 18,
      height: 56,
      marginLeft: 2,
      marginRight: 2,
      paddingTop: 8,
      paddingBottom: 8,
      width: (Dimensions.get('screen').width - (2 * 28) - 32) / 7, // (screenWidth - 2 arrows width - magicNumber(probably weekDates margins) / days in week)
      color: color.secondary,
      ...theme.weekDate
    },
    weekDateNumber: {
      fontSize: 13,
      ...theme.weekDateNumber
    },
    weekDateSymbol: {
      fontSize: 13,
      ...theme.weekDateSymbol
    },
    weekDateNumberActive: {
      fontWeight: 'bold',
      ...theme.weekDateNumberActive
    },
    weekDateSymbolActive: {
      fontWeight: 'bold',
      ...theme.weekDateSymbolActive
    },
    weekdayActive: {
      borderWidth: 1,
      borderRadius: 6,
      fontWeight: 'bold',
      ...theme.weekdayActive
    },
    sectionsContainer: {
      position: 'absolute',
      zIndex: 2,
      flexDirection: 'row',
      left: SECTIONS_LEFT_OFFSET,
      ...theme.sectionsContainer
    },
    sectionTab: {
      backgroundColor: '#F0F4FF',
      borderRightWidth: 1,
      borderRightColor: 'black',
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      height: SECTION_HEADER_HEIGHT,
      ...theme.sectionTab
    },
    sectionLabel: {
      ...theme.sectionLabel
    }
  }
  return StyleSheet.create(style)
}
