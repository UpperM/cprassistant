import React from 'react'
import { View, Button, TextInput, StyleSheet, FlatList,Text, TouchableOpacity} from 'react-native'
import moment from 'moment'

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
    height: 60,
    flexDirection: 'row',
    borderTopWidth: 1.5,
    borderColor: '#f8f8f8',
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

    patient_name: {
      margin: 10,
      fontSize: 18,
      flex: 1,
      flexWrap: 'wrap',
    },
    start_date: {
      marginRight: 20,
      fontStyle: 'italic',
      fontSize: 16,
      color: '#666666'
    }
  })

export default StatistiquesItem
