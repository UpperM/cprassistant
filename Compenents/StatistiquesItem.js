import React from 'react'
import { StyleSheet, Text, TouchableOpacity} from 'react-native'
import moment from 'moment'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

class StatistiquesItem extends React.Component {

    render() {
        const {cpr, displayDetail } = this.props

        return(
            <TouchableOpacity style={styles.main_container} onPress={() => displayDetail(cpr)}>
                <Text style={styles.patient_name}>{cpr.patient_name}</Text>
                <Text style={styles.start_date}>{moment(cpr.start_cpr).format('DD/MM/YYYY HH:mm')}</Text>
          </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
  main_container: {
    height: hp('7%'),
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#f8f8f8',
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

    patient_name: {
      margin: wp('2%'),
      fontSize: wp('4.5%'),
      flex: 1,
      flexWrap: 'wrap',
    },
    start_date: {
      marginRight: wp('4%'),
      fontSize: wp('4%'),
      fontStyle: 'italic',
      color: '#666666'
    }
  })

export default StatistiquesItem
