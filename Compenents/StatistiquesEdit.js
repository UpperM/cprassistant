import React from 'react'
import { StyleSheet, View, Text, AsyncStorage, FlatList, Alert } from 'react-native'
import moment from 'moment'
import DetailsChoc from '../Compenents/DetailsChoc'
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native-gesture-handler'
import DialogInput from '../Modules/DialogInput';
import Toast from 'react-native-simple-toast';

class StatistiquesEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cpr: undefined,
      adrenaline: undefined,
      records: undefined,
      choc: undefined,
      isLoading: true,
      isPlaying: false,
      patient_name: undefined,
      isDialogVisible: false,
      intubation: undefined,
      start_cpr: undefined,
      end_cpr: undefined,
      showPickerEnd: false,
      showPickerStart: false
    }
  }

  _displayDialog (value) {
    this.setState({ isDialogVisible: value });
  }

  componentDidMount() {
      this.setState({
        cpr: this.props.route.params.cpr,
        choc: this.props.route.params.cpr.choc,
        adrenaline: this.props.route.params.cpr.adrenaline,
        records: this.props.route.params.cpr.records,
        patient_name: this.props.route.params.cpr['patient_name'],
        start_cpr: this.props.route.params.cpr['start_cpr'],
        end_cpr: this.props.route.params.cpr['end_cpr'],
        intubation: this.props.route.params.cpr['intubation'],
        isLoading: false
      }, () => {
        this._displayDetails()
        this._getCprInfos()
      })

  }

  _saveCprInfos () {
    console.log("Save deleted array")
    AsyncStorage.setItem('cpr',JSON.stringify(this.state.cprData))
  }

  _deleteThisRecord () {
    this.setState(prevState => ({
      cprData : prevState.cprData.filter(item => item["start_cpr"] !== this.state.cpr["start_cpr"]),
    }), () => {
      this._saveCprInfos()
      this._storeThisRecord()

    });

  }

  _getCprInfos = async() => {
    var data = await AsyncStorage.getItem('cpr')
    console.log(data)
    this.setState({cprData: JSON.parse(data)})
  }

  _storeThisRecord = async() => {
    var array = {
        start_cpr: this.state.start_cpr,
        end_cpr: this.state.end_cpr,
        patient_name: this.state.patient_name,
        choc: this.state.choc,
        adrenaline: this.state.adrenaline,
        records : this.state.records,
        intubation: this.state.intubation
    }
    console.log("Store new infos")
    await AsyncStorage.getItem('cpr')
    .then((cpr) => {
      const c = cpr ? JSON.parse(cpr) : [];
      c.push(array);
      AsyncStorage.setItem('cpr', JSON.stringify(c));
    });

    this.props.navigation.navigate("Statistiques")

  }

  _getTimeDifference(start,end) {
    return (moment.utc(moment(end,"DD/MM/YYYY HH:mm:ss").diff(moment(start,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss"))
  }

  _convertDate(date) {
    return moment(date).format('DD/MM/YYYY HH:mm:ss')
  }

  _editPatientName(inputText) {
    this.setState({
      patient_name: inputText
    })
  }

  _displayDatePicker(state,id) {

    if (id == 'start') {
      this.setState({
        showPickerStart: state
      })
    } else {
      this.setState({
        showPickerEnd: state
      })
    }
  }

  _updateDate(date,id) {

    if (date == undefined) {
      this.setState({showPickerEnd: false, showPickerStart: false})
      return;
    }
      switch (id) {
        case 'start':
          if (date > new Date(this.state.end_cpr)) {
            Toast.show('La date de début ne peut pas être superieur à la date de fin')
          } else {
            this.setState({start_cpr: date, showPickerStart: false})
          }
          break;

        case 'end':
          if (date < new Date(this.state.start_cpr)) {
            Toast.show('La date de fin ne peut pas être inférieur à la date de début')
          } else {
            this.setState({end_cpr: date, showPickerEnd: false})
          }
          break;
      }

  }

  _saveData() {
    this._deleteThisRecord()
  }

  _displayDetails() {
    if (this.state.cpr != undefined) {
      return (
        <View style={styles.main}>
          <TouchableOpacity  style={styles.main_container} onPress={() => {this._displayDialog(true)}}>
              <Text style={styles.settings_name}>Nom du patient</Text>
              <Text style={styles.settings_value}>{this.state.patient_name}</Text>
          </TouchableOpacity>

          <TouchableOpacity  style={styles.main_container} onPress={() => {this._displayDatePicker(true,'start')}}>
              <Text style={styles.settings_name}>Date de début du massage</Text>
              <Text style={styles.settings_value}>{this._convertDate(this.state.start_cpr)}</Text>
          </TouchableOpacity>

          <TouchableOpacity  style={styles.main_container} onPress={() => {this._displayDatePicker(true,'end')}}>
              <Text style={styles.settings_name}>Date de fin du massage</Text>
              <Text style={styles.settings_value}>{this._convertDate(this.state.end_cpr)}</Text>
          </TouchableOpacity>

          <DialogInput isDialogVisible={this.state.isDialogVisible}
                    title="Changement de nom"
                    submitText="Sauvegarder"
                    cancelText="Annuler"
                    submitInput={ (inputText) => {
                        this._editPatientName(inputText)
                        this._displayDialog(false)
                    } }
                    closeDialog={ () => {this._displayDialog(false)}}>
          </DialogInput>

        </View>
      )
    }
  }

    render() {


      return (
          <View style={{flex: 1}}>
            {this._displayDetails()}

            {this.state.showPickerStart &&
            <DateTimePicker
            testID="dateTimePicker"
            timeZoneOffsetInMinutes={0}
            value={new Date(this.state.start_cpr)}
            mode="time"
            is24Hour={true}
            onChange={(event,selectedDate) => this._updateDate(selectedDate,'start')}
            display="default"
            />
            }

          {this.state.showPickerEnd &&
            <DateTimePicker
            testID="dateTimePicker"
            timeZoneOffsetInMinutes={0}
            value={new Date(this.state.end_cpr)}
            mode="time"
            is24Hour={true}
            onChange={(event,selectedDate) => this._updateDate(selectedDate,'end')}
            display="default"
            />
            }

            <TouchableOpacity style={{alignContent: "center"}} onPress={() => this._saveData()}>
              <Text style={styles.save_data}>Sauvegarder</Text>
            </TouchableOpacity>
          </View>
        )
    }
}

const styles = StyleSheet.create({
  main: {
    flex:1,
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin:5
  },
  chocList: {
    marginTop: 15,
  },
  listTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20
  },
  save_data: {
    margin: 10,
    fontSize: 18,
    color: 'green',
    textAlign: 'center'
  },
  main_container: {
    height: 60,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#f8f8f8',
    backgroundColor: '#ffffff',
    alignItems: 'center'
  },
  settings_name: {
    margin: 10,
    fontSize: 16,
    flex: 1,
    flexWrap: 'wrap',
},
settings_value: {
    marginRight: 20,
    fontSize: 16,
    color: '#666666'
},
})

export default StatistiquesEdit
