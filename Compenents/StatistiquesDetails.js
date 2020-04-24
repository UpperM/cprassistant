import React from 'react'
import { StyleSheet, View, Text, AsyncStorage, FlatList, Alert } from 'react-native'
import moment from 'moment'
import DetailsChoc from '../Compenents/DetailsChoc'
import StatisquesDetailsPlayer from '../Compenents/StatisquesDetailsPlayer'
import { TouchableOpacity } from 'react-native-gesture-handler'
class StatistiquesDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cpr: undefined,
      adrenaline: undefined,
      records: undefined,
      choc: undefined,
      isLoading: true,
      isPlaying: false,
      cprData: undefined,
      settings: undefined,
      adrenaline_unit: undefined
    }
  }
  // Retrieve settings from AsyncStorage
  _getSettings = async () => {
    await AsyncStorage.getItem('settings').then((settings) => {
        const s = settings ? JSON.parse(settings) : []; // get array
        this.setState({settings: s})
    })

    const index = this.state.settings.findIndex(element => element.id == "adrenaline_unit" )
    this.setState({adrenaline_unit: this.state.settings[index].value})
  }


  componentDidMount() {
    this._getSettings()

      this.setState({
        cpr: this.props.route.params.cpr,
        choc: this.props.route.params.cpr.choc,
        adrenaline: this.props.route.params.cpr.adrenaline,
        records: this.props.route.params.cpr.records,
        isLoading: false
      }, () => {
        this._displayDetails()
      })
      this._getCprInfos()

  }
  _getCprInfos = async() => {
    var data = await AsyncStorage.getItem('cpr')
    this.setState({cprData: JSON.parse(data)})
  }

  _saveCprInfos = async() => {
    await AsyncStorage.setItem('cpr',JSON.stringify(this.state.cprData))
  }

  _deleteRecord () {
    this.setState(prevState => ({
      cprData : prevState.cprData.filter(item => item["start_cpr"] !== this.state.cpr["start_cpr"])
    }), () => {
      this._saveCprInfos()
      this.props.navigation.goBack();
    });
  }

  _askForEdit() {
    this.props.navigation.navigate("StatistiquesEdit", {cpr: this.state.cpr})
  }

  _askForEraseData = () =>{
    Alert.alert(
      "Effacer le patient",
      "Êtes-vous sûr de vouloir supprimer ce patient ? Cette action est irreversible",
      [
        {
          text: "Annuler",
          onPress: () => {},
          style: "Cancel"
        },
        {
          text: "Effacer",
          onPress: () => this._deleteRecord()
        }
      ],
      { cancelable: false }
    )
  }

  _getTimeDifference(start,end) {
    return (moment.utc(moment(end,"DD/MM/YYYY HH:mm:ss").diff(moment(start,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss"))
  }

  _convertDate(date) {
    return moment(date).format('DD/MM/YYYY HH:mm:ss')
  }


  _displayDetails() {
    if (this.state.cpr != undefined) {
      return (
        <View style={styles.main}>
            <Text style={styles.patientName}>{this.state.cpr["patient_name"]}</Text>

            <Text style={{fontSize: 15}}>Début du massage : {this._convertDate(this.state.cpr["start_cpr"])}</Text>
            <Text style={{fontSize: 15}}>Fin du massage : {this._convertDate(this.state.cpr["end_cpr"])}</Text>
            <Text style={{fontSize: 15}}>Durée totale : {this._getTimeDifference(this._convertDate(this.state.cpr["start_cpr"]),this._convertDate(this.state.cpr["end_cpr"]))}</Text>
            <Text style={{fontSize: 15}}>Intubation : {this._convertDate(this.state.cpr["intubation"])} ({this._getTimeDifference(this._convertDate(this.state.cpr["start_cpr"]),this._convertDate(this.state.cpr["intubation"]))})</Text>

            <Text style={styles.listTitle}>Liste des chocs</Text>
            <FlatList
            data={this.state.choc}
            keyExtractor={(item) => item.toString()} // Clef unique
            renderItem={({item}) => <DetailsChoc choc={item} start_cpr={this.state.cpr["start_cpr"]}/> }
            contentContainerStyle={{
              flexGrow: 1,
              }}
            />

            <Text style={styles.listTitle}>Adrénaline injectée {this.state.adrenaline.length * this.state.adrenaline_unit} mg</Text>
            <FlatList
            data={this.state.adrenaline}
            keyExtractor={(item) => item.toString()} // Clef unique
            renderItem={({item}) => <DetailsChoc choc={item} start_cpr={this.state.cpr["start_cpr"]}/> }
            contentContainerStyle={{
              flexGrow: 1,
              }}
            />
            <Text style={styles.listTitle}>Enregistrements</Text>
            <FlatList
            data={this.state.records}
            keyExtractor={(item) => item.toString()} // Clef unique
            renderItem={({item}) => <StatisquesDetailsPlayer records={item}/> }
            contentContainerStyle={{
              flexGrow: 1,
              }}
            />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => this._askForEraseData()}>
              <Text style={styles.erase_data}>Supprimer ce patient</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this._askForEdit()}>
              <Text style={styles.edit_data}>Editer ce patient</Text>
            </TouchableOpacity>
          </View>

        </View>
      )
    }
  }

    render() {
      return (
          <View style={{flex: 1}}>
            {this._displayDetails()}
          </View>
        )
    }
}

const styles = StyleSheet.create({
  main: {
    flex:1,
    margin: 10
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
  erase_data: {
    marginLeft: 10,
    marginRight: 20,
    fontSize: 16,
    color: 'red',
  },
  edit_data: {
    marginLeft: 50,
    fontSize: 16,
  }
})

export default StatistiquesDetails
