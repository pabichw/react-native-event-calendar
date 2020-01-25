// @flow
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  VirtualizedList
} from 'react-native'
import { range, filter } from 'lodash'
import moment, { Moment } from 'moment'
import React from 'react'
import styleConstructor from './style'
import DayView from './DayView'
import FlexRow from '../_common/flexRow/flexRow'

const arrowRight = require('../../assets/images/rightGreenArrow2.png')
const arrowLeft = require('../../assets/images/leftGreenArrow.png')

interface EventCalendarProps {
  initDate: string | Date; // ??
  events: object[];
  sections: object[];
  width: number;
  size?: number;
  scrollToFirst: boolean;
  format24h?: boolean;
  formatDateHeader?: string;
  headerStyle?: object;
  virtualizedListProps?: object;
  virtualizedWeeksListProps?: object;
  styles?: object;
  start?: number;
  end?: number;

  renderEvent?: (any) => void;
  eventTapped: (any) => void;
  emptyCellTapped?: (any) => void;
  onDayChange?: (Moment) => void;
}

interface EventCalendarState {
  date: Moment;
  index: number;
  weekIndex: number;
  weeks: object;
}
const SECTION_HEADER_HEIGHT = 40

export default class EventCalendar extends React.Component<EventCalendarProps, EventCalendarState> {
  styles: object = {}

  static defaultProps = {
    size: 28,
    initDate: moment().toDate(),
    start: 0,
    end: 24
  }

  constructor (props) {
    super(props)

    const { start, end } = this.props

    this.styles = styleConstructor(props.styles, (end - start) * 100)

    this.state = {
      date: moment(this.props.initDate),
      index: this.props.size,
      weeks: null,
      weekIndex: 0
    }
  }

  componentDidMount (): void {
    this._createWeeks()
  }

  componentDidUpdate (): void{
    const { start, end, sections, styles } = this.props
    const sectionsHeaderOffset = sections && sections.length > 0 ? SECTION_HEADER_HEIGHT : 0
    this.styles = styleConstructor(styles, (end - start) * 100 + sectionsHeaderOffset + 50)
  }

  _createWeeks () {
    const { date } = this.state

    let newWeeks = {}
    const weeksNumber = 8 // must be an even number
    const startDay = moment(date).startOf('isoWeek').subtract(Math.floor(weeksNumber * 7 / 2), 'days')
    let currDate = startDay
    range(weeksNumber).map(() => {
      const name = currDate.format('YYYY-MM-DD')
      newWeeks[name] = []
      range(7).map(() => {
        newWeeks[name].push(currDate.format())
        currDate.add(1, 'days')
      })
    })
    console.log('weeks:', newWeeks)
    this.setState({ weeks: newWeeks, weekIndex: weeksNumber / 2 })
  }

  _getItemLayout (data, index) {
    const { width } = this.props
    return { length: width, offset: width * index, index }
  };

  _getWeekLayout = (data, weekIndex) => {
    const { width } = this.props
    let weekListWidth = width - 60
    return { length: weekListWidth, offset: weekListWidth * weekIndex, index: weekIndex }
  };

  _getItem (events, index) {
    const date = moment(this.props.initDate).add(index - this.props.size, 'days')
    return filter(events, event => {
      const eventStartTime = moment(event.start)
      return eventStartTime >= date.clone().startOf('day') &&
        eventStartTime <= date.clone().endOf('day')
    })
  }

  _getWeekItem = (weeks, index) => {
    if (index < 0) {
      return []
    }
    const key = Object.keys(weeks)[index]
    const correctWeek = weeks[key]
    return correctWeek.map(day => {
      return moment(day)
    })
  }

  _renderItem ({ index, item }) {
    const { width, format24h, scrollToFirst, sections, start = 0, end = 24 } = this.props
    const { date } = this.state
    return (
      <DayView
        date={date}
        index={index}
        format24h={format24h}
        formatHeader={this.props.formatDateHeader}
        headerStyle={this.props.headerStyle}
        renderEvent={this.props.renderEvent}
        eventTapped={this.props.eventTapped}
        emptyCellTapped={this.props.emptyCellTapped}
        events={item}
        sections={sections}
        width={width} // + 500 for scrollable horizontally
        styles={this.styles}
        scrollToFirst={scrollToFirst}
        start={start}
        end={end}
      />
    )
  }

  _renderWeek = ({ item }) => {
    const { date } = this.state
    const week = item.map((currDate, idx) =>
      <TouchableOpacity key={idx} onPress={() => this._dayClicked(currDate)} style={[this.styles.weekDate, moment(currDate).isSame(date) ? this.styles.weekdayActive : null]}>
        <Text
          style={[this.styles.weekDateSymbol, moment(currDate).isSame(date) ? this.styles.weekDateSymbolActive : null]}>{moment(currDate).format('dd')[0]}</Text>
        <Text
          style={[this.styles.weekDateNumber, moment(currDate).isSame(date) ? this.styles.weekDateNumberActive : null]}>{moment(currDate).format('D')}</Text>
      </TouchableOpacity>
    )
    return <View style={this.styles.singleWeekContainer}>{week}</View>
  }

  _goToPage = async (index: number, currDate?: Date) => {
    console.log('going to index:', index)
    if (index <= 0 /* || index >= this.props.size * 2 */) {
      return
    } else if (index >= this.props.size * 2) {
      const date = moment(currDate)
      this.setState({ date })
    } else {
      const date = currDate ? moment(currDate) : moment(this.props.initDate).add(index - this.props.size, 'days')
      this.setState({ date, index })
    }
    this.refs.calendar.scrollToIndex({ index, animated: false })
  }

  _goToWeek (weekIndex) {
    const { weeks } = this.state
    const weeksNumber = Object.keys(weeks).length
    if (weekIndex < 0 || weekIndex >= weeksNumber) {
      return
    }
    this.refs.weekHeader.scrollToIndex({ index: weekIndex, animated: true })
    this.setState({ weekIndex })
  }

  _updateWeekRange = (weekIndex: number) => {
    console.log('weekIndex:', weekIndex)
    const { weeks } = this.state
    const weeksNumber = Object.keys(weeks).length
    const fetchForward = weekIndex >= weeksNumber - 4
    const fetchBackwards = weekIndex <= 1
    this.setState({ weekIndex })
    const firstMonday = Object.keys(weeks)[0]
    const lastMonday = Object.keys(weeks)[Object.keys(weeks).length - 1]

    if (fetchForward) {
      console.log('fetchForward:', fetchForward)

      const mondayAfter = moment(lastMonday).add(1, 'week')
      const newWeek = []
      range(7).map((idx: number) => {
        const day = mondayAfter.clone().add(idx, 'day')
        newWeek.push(day.format())
      })

      let newWeekObj = Object.assign({}, weeks)
      newWeekObj[mondayAfter.format('YYYY-MM-DD')] = newWeek
      // delete newWeekObj[firstMonday]

      this.setState({ weeks: newWeekObj })
    } else if (fetchBackwards) {
    }
  }

  _dayClicked = async (currDate) => {
    const { date, index } = this.state
    const { onDayChange } = this.props
    const offset = moment(currDate).diff(date, 'days')

    await this._goToPage(index + offset, currDate)
    onDayChange && onDayChange(currDate)
  }

  render () {
    const {
      width,
      virtualizedListProps,
      virtualizedWeeksListProps,
      events,
      formatDateHeader,
      size
    } = this.props
    const { weeks, weekIndex } = this.state

    const weeksNumber = Object.keys(weeks || {}).length

    return (
      <View style={[this.styles.container, { width }]}>
        <View style={this.styles.header}>
          <Text style={this.styles.headerText}>{this.state.date.format(formatDateHeader || 'DD MMMM YYYY')}</Text>
          {weeks && Object.keys(weeks).length > 0 &&
          <>
            <FlexRow style={this.styles.weekDatesContainer}>
              <TouchableOpacity onPress={() => {
                if (weekIndex <= 0) return

                this._goToWeek(weekIndex - 1)
                this._dayClicked(moment(this.state.date).subtract(7, 'days'))
              }}>
                <Image source={arrowLeft} style={this.styles.arrow} />
              </TouchableOpacity>
              <VirtualizedList
                ref='weekHeader'
                windowSize={2}
                initialNumToRender={2}
                initialScrollIndex={weeksNumber / 2}
                data={weeks}
                getItemCount={() => weeksNumber}
                showsHorizontalScrollIndicator={false}
                getItem={this._getWeekItem}
                keyExtractor={(item, index) => `${index}`}
                getItemLayout={this._getWeekLayout}
                horizontal
                pagingEnabled
                renderItem={this._renderWeek}
                style={{ marginLeft: 4 }}
                onMomentumScrollEnd={async (event) => {
                  const { weekIndex: oldWeekIndex } = this.state
                  const weeksWidth = width - 60
                  const weekIndex = parseInt(event.nativeEvent.contentOffset.x / weeksWidth)
                  this._updateWeekRange(weekIndex)

                  const swippedForward = weekIndex - oldWeekIndex > 0
                  const swippedBackwards = weekIndex - oldWeekIndex < 0
                  if (swippedForward) {
                    this._dayClicked(moment(this.state.date).add(7, 'days'))
                  } else if (swippedBackwards) {
                    this._dayClicked(moment(this.state.date).subtract(7, 'days'))
                  }
                }}
                {...virtualizedWeeksListProps}
              />
              <TouchableOpacity onPress={() => {
                this._goToWeek(weekIndex + 1)
                this._dayClicked(moment(this.state.date).add(7, 'days'))
              }}>
                <Image source={arrowRight} style={this.styles.arrow} />
              </TouchableOpacity>
            </FlexRow>
          </>
          }
        </View>
        <VirtualizedList
          ref='calendar'
          windowSize={2}
          initialNumToRender={2}
          initialScrollIndex={size}
          data={events}
          getItemCount={() => size * 2}
          getItem={this._getItem.bind(this)}
          keyExtractor={(item, index) => `${index}`}
          getItemLayout={this._getItemLayout.bind(this)}
          horizontal
          pagingEnabled
          renderItem={this._renderItem.bind(this)}
          style={{ width: width }}
          onMomentumScrollEnd={async (event) => {
            const { onDayChange, size } = this.props
            const { date: oldDate, weekIndex } = this.state
            const index = parseInt(event.nativeEvent.contentOffset.x / width)
            const date = moment(this.props.initDate).add(index - size, 'days')

            onDayChange && onDayChange(date)
            await this._goToPage(index)

            if (moment(oldDate).format('dddd') === 'Monday' && moment(this.state.date).format('dddd') === 'Sunday') {
              await this._goToWeek(weekIndex - 1)
            } else if (moment(oldDate).format('dddd') === 'Sunday' && moment(this.state.date).format('dddd') === 'Monday') {
              await this._goToWeek(weekIndex + 1)
              this._updateWeekRange(weekIndex + 1)
            }
          }}
          {...virtualizedListProps}
        />
        {/* {this._renderItem({ index: this.state.index, item: this._getItem(events, this.state.index) })} */}

      </View>

    )
  }
}
