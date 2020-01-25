# Customizable React Native Event Calendar
Customizable React Native event calendar based on joshjhargreaves' solution (https://github.com/joshjhargreaves/react-native-event-calendar)

Added features:
* interacting with empty cells
* can separate DayView with columns (sections)
* can display interactive week picker above the calendar
* more styling options
* rewritten with typescript

Code is garbage so try not to look into it too much. May or may not improve it in the future - most likely the second

## Demo
![Booking for rooms](demo.gif)

## Current API (needs an update)
Property | Type | Description
------------ | ------------- | -------------
onRef | PropTypes.function | Function fired to set the EventCalendar ref
events | PropTypes.array | Array of event
sections | PropTypes.array | (optional) Array of columns 
width | PropTypes.number | Container width
format24h | PropTypes.boolean | Use format 24hour or 12hour
formatHeader | PropTypes.string | Header date format
upperCaseHeader | PropTypes.boolean | Sets date header as uppercase (default false)
headerStyle | PropTypes.object | Header style
renderEvent | PropTypes.function | Function return a component to render event `renderEvent={(event) => <Text>{event.title}</Text>}`
eventTapped | PropTypes.function | Function on event press
dateChanged | PropTypes.function | Function on date change. Passes new date as a string formatted as 'YYYY-MM-DD'
initDate | PropTypes.string | Show initial date (default is today)
scrollToFirst | PropTypes.boolean | Scroll to first event of the day (default true)
size | PropTypes.number | Number of date will render before and after initDate (default is 30 will render 30 day before initDate and 29 day after initDate)
virtualizedListProps | PropTypes.object | Prop pass to virtualizedList
start | PropTypes.number | Start time (default 0)
end | PropTypes.number | End time (default 24)
headerIconLeft | PropTypes.element | If specified, renders this element instead of the default left arrow image
headerIconRight | PropTypes.element | If specified, renders this element instead of the default right arrow image
_goToDate | (date : string) => void | Requires the reference set using the `onRef` prop. E.g. `ref._goToDate('2017-09-07')`
size | number | How many Day pages forward are reachable (great number might cause laggy performance)


`EventCalendar` can be configured through a `styles` prop whereby any of the components in the calendar can be styled.
```
    {
        container: {
            backgroundColor: 'white'
        }, 
        event: {
            opacity: 0.5
        }
        
        // more options shown in the example
    }
```

Event color can be overridden by specifying a `color` attribute inside the event object. E.g.
```
{
    color: '#F4EFDB',
    start: '2017-09-07 00:30:00',
    end: '2017-09-07 01:30:00',
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032'
}
```

## Install
Not in any package managers right now. Just fork or clone the repository.

## Examples

```js
import EventCalendar from 'react-native-events-calendar'

let { width } = Dimensions.get('window')

// current styling API
const calendarTheme = {
  container: {...},
  event: {...},
  eventTitle: {...},
  headerText: {...},
  lineHalf: {...},
  lineNow: {...},
  sectionLabel: {...},
  sectionTab: {...},
  sectionsContainer: {...},
  timeLabel: {...},
  verticalLine: {...},
  weekDateNumber: {...},
  weekDateNumberActive: {...},
  weekDateSymbol: {...},
  weekDateSymbolActive: {...},
  weekdayActive: {...}
}

const sections = [
  {
    label: 'Room 1',
    id: 'room1'
  }
]

const events = [
    {
      start: '2017-09-07 01:30:00',
      end: '2017-09-07 02:20:00',
      title: 'Test event',
      sectionId: 'room1', // which section (column) should the event be binded to
      disabled: true // is event not interactive
    }
]


render () {
  return (
    <EventCalendar
      eventTapped={this._eventTapped}
      emptyCellTapped={this._emptyCellTapped}
      events={events}
      sections={sections}
      onDayChange={day => { this._onDayChange(day) }}
      width={width}
      formatDateHeader={'dddd Do MMMM YYYY'}
      start={dayStartTime}
      end={dayEndTime}
      initDate={dateNow}
      scrollToFirst={true}
      styles={calendarTheme}
      size={350} 
    />
  )
}

```
