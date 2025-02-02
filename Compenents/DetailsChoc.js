import React from 'react'
import { View, StyleSheet,Text} from 'react-native'
import moment from 'moment'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

class DetailsChoc extends React.Component {
    _convertDate(date) {
        return moment(date).format('DD/MM/YYYY HH:mm:ss')
      }

    _getTimeDifference(date) {

        return (moment.utc(moment(this._convertDate(date),"DD/MM/YYYY HH:mm:ss").diff(moment(this._convertDate(this.props.start_cpr),"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss"))
    }

    render() {
        const {choc, start_cpr} = this.props
        return(
            <View>
              <View style={styles.main_container}>
              <Text style={styles.choc_minute}>{this._getTimeDifference(choc)}</Text>
                <Text style={styles.choc_date}>{this._convertDate(choc)}</Text>
              </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    main_container: {
      margin:wp('1%'),
      flexDirection: 'row',
      borderBottomColor: '#666666',
      borderBottomWidth: 0.5,
    },
    choc_minute: {
        fontSize: wp('3.8%'),
        flex: 1,
        flexWrap: 'wrap',
      },
      choc_date: {
        fontStyle: 'italic',
        fontSize: wp('3.8%'),
        color: '#666666'
      }
  })

export default DetailsChoc
