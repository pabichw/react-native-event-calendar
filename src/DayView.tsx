// @flow
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import populateEvents from './Packer'
import React from 'react'
import moment from 'moment'
import _ from 'lodash'
import styleConstructor from './style'
import { Moment } from 'moment'

const LEFT_MARGIN = 50 - 1
const SECTION_HEADER_HEIGHT = 40
const CALENDER_HEIGHT = 2400 + SECTION_HEADER_HEIGHT

interface DayViewProps {
  date: Moment;
  styles?: object;
  scrollToFirst?: boolean;
  format24h?: boolean;
  width?: number;
  sections?: [{label: string; id: string}];
  eventTapped?: (any) => void;
  emptyCellTapped?: (any) => void;
  start?: number;
  end?: number;
}

interface DayViewState {
  _scrollY: number;
  packedEvents: any;
}

export default class DayView extends React.PureComponent<DayViewProps, DayViewState> {
  styles: object = {}
  calendarHeight: number;

  constructor (props) {
    super(props)
    this.calendarHeight = (props.end - props.start) * 100 + SECTION_HEADER_HEIGHT
    const width = props.width - LEFT_MARGIN
    const packedEvents = populateEvents(props.events, width, props.start)
    let initPosition = _.min(_.map(packedEvents, 'top')) - this.calendarHeight / 48
    initPosition = initPosition < 0 ? 0 : initPosition

    this.styles = styleConstructor(this.props.styles, this.calendarHeight)
    this.state = {
      _scrollY: initPosition,
      packedEvents
    }
  }

  // TODO: dont use componentWillReceiveProps - rework
  componentWillReceiveProps (nextProps) {
    const width = nextProps.width - LEFT_MARGIN
    this.setState({
      packedEvents: populateEvents(nextProps.events, width, nextProps.start)
    })
    // this.props.scrollToFirst && this.scrollToFirst()
  }

  componentDidMount () {
    this.props.scrollToFirst && this.scrollToFirst()
  }

  scrollToFirst () {
    setTimeout(() => {
      if (this.state && this.state._scrollY && this._scrollView) {
        this._scrollView.scrollTo({ x: 0, y: this.state._scrollY, animated: true })
      }
    }, 1)
  }

  _renderNowLine () {
    const offset = CALENDER_HEIGHT / 24
    const { width, styles } = this.props
    const timeNowHour = moment().hour()
    const timeNowMin = moment().minutes()
    return (
      <View key={`timeNow`}
        style={[styles.lineNow, { top: ((offset * (timeNowHour - this.props.start) + offset * timeNowMin / 60)) + SECTION_HEADER_HEIGHT, width: width - 20 }]}
      />
    )
  }

  _renderLines () {
    const offset = CALENDER_HEIGHT / 24
    const { format24h, start, end } = this.props

    let lines = _.range(start, end).map((i: number, index: number) => {
      let timeText
      if (i === start && i < 12) {
        timeText = !format24h ? `${i}am` : i
      } else if (i === start && i >= 12) {
        timeText = !format24h ? `${i}pm` : i
      } else if (i < 12) {
        timeText = !format24h ? `${i}am` : i
      } else if (i === 12) {
        timeText = !format24h ? `${i}pm` : i
      } else if (i === 24) {
        timeText = !format24h ? `12am` : 0
      } else {
        timeText = !format24h ? `${i - 12}pm` : i
      }
      const { width, styles } = this.props
      return [
        <Text
          key={`timeLabel${i}`}
          style={[styles.timeLabel, { top: (offset * index - 6) + SECTION_HEADER_HEIGHT }]}
        >
          {timeText}
        </Text>,
        i === 0 ? null
          : <View
            key={`line${i}`}
            style={[styles.line, { top: (offset * index) + SECTION_HEADER_HEIGHT, width: width - 20 }]}
          />,
        <View
          key={`lineQuater${i}-1`}
          style={[styles.lineQuarter, { top: (offset * (index + 0.25)) + SECTION_HEADER_HEIGHT, width: width - 20 }]}
        />,
        <View
          key={`lineHalf${i}`}
          style={[styles.lineHalf, { top: (offset * (index + 0.5)) + SECTION_HEADER_HEIGHT, width: width - 20 }]}
        />,
        <View
          key={`lineQuater${i}-2`}
          style={[styles.lineQuarter, { top: (offset * (index + 0.75)) + SECTION_HEADER_HEIGHT, width: width - 20 }]}
        />,
        index === end - start - 1 &&
          [
            <Text
              key={`timeLabel${end + 1}`}
              style={[styles.timeLabel, { top: (offset * (index + 1) - 6) + SECTION_HEADER_HEIGHT }]}
            >
              {end < 12 ? `${end - 12}am` : `${end - 12}pm`}
            </Text>,
            <View
              key={`line${end + 1}`}
              style={[styles.line, { top: (offset * (index + 1)) + SECTION_HEADER_HEIGHT, width: width - 20 }]}
            />
          ]
      ]
    })

    return lines
  };

  _onEventTapped (event) {
    this.props.eventTapped(event)
  };

  _renderEvents () {
    const { sections, width, start } = this.props
    const { packedEvents } = this.state

    const sectionWidth = (sections && sections.length > 0) ? (width - LEFT_MARGIN) / sections.length : 0

    let events = packedEvents.map((event, i) => {
      const eventWidth = sections && sections.length > 0 ? sectionWidth : event.width
      const correctSectionId = _.findIndex(sections, sec => {
        return sec.id === event.sectionId
      })
      const correctLeftOffset = (sections && sections.length > 0) ? correctSectionId * sectionWidth + 1 : 1

      const offsetTop = CALENDER_HEIGHT / 24
      const startHour = moment(event.start).subtract(start, 'hours').get('hour')
      const startMin = moment(event.start).get('minute')

      // hotfix - coords should be calculated in Packer.ts
      const style = {
        left: correctLeftOffset,
        height: event.height,
        width: eventWidth,
        top: (offsetTop * startHour + offsetTop * startMin / 60) + SECTION_HEADER_HEIGHT + 1
      }

      return (
        <View
          key={i}
          style={[this.styles.event, style, event.disabled ? this.styles.eventDisabled : null]}
        >
          {this.props.renderEvent ? this.props.renderEvent(event) : (
            <TouchableOpacity
              disabled={event.disabled}
              activeOpacity={0.5}
              style={{ width: '100%' }}
              onPress={() => this._onEventTapped(this.props.events[event.index])}
            >
              <Text style={[{ width: '100%', height: '100%' }, this.styles.eventTitle]}>{event.title || ''}</Text>
            </TouchableOpacity>
          )}
        </View>
      )
    })

    return (
      <View>
        <View style={{ marginLeft: LEFT_MARGIN }}>
          {events}
        </View>
      </View>
    )
  }

  _renderEmptyCells = () => {
    const { sections, width, start, end, date } = this.props

    const sectionWidth = (sections && sections.length > 0) ? (width - LEFT_MARGIN) / sections.length : 0
    const offset = CALENDER_HEIGHT / 24

    const cellsMinInterval = 30
    const cellsEachHour = 2
    const cells = sections.map((section, idx) => {
      const correctLeftOffset = (sections && sections.length > 0) ? idx * sectionWidth + 1 : 1

      const cellWidth = sections && sections.length > 0 ? sectionWidth : 20 // magic number
      const cellsAmount = (end - start) * cellsEachHour
      const cells = _.fill(Array(cellsAmount), {})

      const sectionCells = cells.map((cell, idx) => {
        const from = moment({ year: date.get('years'), month: date.get('month'), day: date.date(), hour: start, minutes: 0, seconds: 0 }).add(idx * cellsMinInterval, 'minutes')
        const style = {
          width: cellWidth,
          height: offset / cellsEachHour,
          top: (offset * idx / cellsEachHour) + SECTION_HEADER_HEIGHT,
          left: correctLeftOffset
        }
        const data = {
          section,
          from
        }
        return (
          <TouchableOpacity key={idx} style={[style, this.styles.emptyCell]} onPress={() => this.props.emptyCellTapped(data)}/>
        )
      })

      return sectionCells
    })

    return (
      <View>
        <View style={{ marginLeft: LEFT_MARGIN }}>
          {cells}
        </View>
      </View>
    )
  }

  _renderSections = () => {
    const { sections, width } = this.props
    const sectionWidth = sections.length > 0 ? (width - LEFT_MARGIN) / sections.length : 0

    return (
      <View style={this.styles.sectionsContainer} pointerEvents="none">
        {sections && sections.map((section, idx: number) =>
          <View
            key={idx}
            style={[this.styles.sectionTab, { left: sectionWidth * idx, width: sectionWidth }]}>
            <View style={[this.styles.verticalLine, { top: SECTION_HEADER_HEIGHT, left: -1 }]}/>
            <Text style={[this.styles.sectionLabel]}>{section.label}</Text>
          </View>
        )}
      </View>
    )
  }

  render () {
    const { styles, sections } = this.props
    return (
      <>
        {sections && this._renderSections()}
        <ScrollView ref={ref => (this._scrollView = ref)}
          contentContainerStyle={[styles.contentStyle, { width: this.props.width }]}
        >
          {this._renderLines()}
          {this._renderEmptyCells()}
          {this._renderEvents()}
          {this._renderNowLine()}
        </ScrollView>
      </>
    )
  }
}
