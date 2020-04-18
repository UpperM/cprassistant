import React from 'react'
import { View, Button, TextInput, StyleSheet, FlatList,Text, TouchableOpacity} from 'react-native'
import moment from 'moment'
import { Player } from '@react-native-community/audio-toolkit'

class StatisquesDetailsPlayer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isPlaying: false
    }
  }


  _destroyPlayer() {
    this.setState({isPlaying: false})
    this.player.destroy()
  }

  _playRecord (fileName) {
    this.player = new Player(fileName).play()
    this.player.on('ended', () => {this._destroyPlayer()})
    this.player.on('error', err => console.log('error with player', err));
  }

  _togglePlay(records) {
    if (this.state.isPlaying) {
      this.player.stop()
      this._destroyPlayer()
    } else {
      this.setState({isPlaying: true}, () => {
        this._playRecord(records)
      })
    }
  }

  _convertDate(date) {
    console.log("Origine : " + date)
    date = date.replace("cpr_record_","")
    date = date.replace("_",":")
    date = date.replace("_",":")
    date = date.replace(".mp4","")
    console.log(date)
    return moment(date).format('DD/MM/YYYY HH:mm:ss')
  }

    render() {
        const {records, playRecord} = this.props

        return(
          <TouchableOpacity style={styles.main_container} onPress={() => this._togglePlay(records)}>
            <Text style={styles.record_name}>{this._convertDate(records)}</Text>
            <Text style={styles.play_button}>{this.state.isPlaying ? 'Stop' : 'Play'}</Text>
          </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({
  main_container: {
    margin:5,
    height: 25,
    flexDirection: 'row',
    borderBottomColor: '#666666',
    borderBottomWidth: 0.5,
  },

  record_name: {
      fontSize: 15,
      flex: 1,
      flexWrap: 'wrap',
    },
    play_button: {
      fontStyle: 'italic',
      fontSize: 16,
      color: '#666666'
    }
  })

export default StatisquesDetailsPlayer
