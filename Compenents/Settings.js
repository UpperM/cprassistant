import React from 'react'
import { View, TouchableOpacity, StyleSheet, FlatList,Text, AsyncStorage, Alert } from 'react-native'
import SettingsItem from '../Compenents/SettingsItem'
import {widthPercentageToDP, heightPercentageToDP} from 'react-native-responsive-screen';
import DeviceInfo from 'react-native-device-info'
class Settings extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            settings: [],
            adrenaline_repeat: undefined,
            appVersion: undefined
        }

    }

    toggleSwitch = (value) => {
        this.setState({adrenaline_repeat: value})
        this._setSettings('adrenaline_repeat',value)
        this._getSettingValue("adrenaline_repeat")
      }

    _initSwitchValue () {
      this._getSettingValue('adrenaline_repeat') == 'true' ? this.setState({adrenaline_repeat: true}) : this.setState({adrenaline_repeat: true})
    }

    _getSettingValue(id) {
      var value = this.state.settings.filter(data => data.id == id).map(item => item.value)
      return value.toString()
     }

    // On mount retrieve settings from AsyncStorage. If not settings found, execute initial settings
    componentDidMount = () => {
        AsyncStorage.getItem('settings').then((value) => {
            if (value) {
              this.setState({ settings: JSON.parse(value) }, () => {
                this._initSwitchValue()
              })
            }
          })
          this.setState({
            appVersion: DeviceInfo.getVersion()
          })
    }

    _handleToggle(state) {
      this.setState((prevstate) => ({
        adrenaline_repeat: !prevstate.adrenaline_repeat
    }));
    }

    _askForEraseData = () =>{
      Alert.alert(
        "Effacer mes données",
        "Êtes-vous sûr de vouloir supprimer toutes vos données ? Cette action est irreversible",
        [
          {
            text: "Annuler",
            onPress: () => {},
            style: "Cancel"
          },
          {
            text: "Effacer",
            onPress: () => this._eraseData()
          }
        ],
        { cancelable: false }
      )
    }

    // Erase CPR Data
    _eraseData() {
      AsyncStorage.removeItem('cpr')
    }

    // Update the state then save to AsyncStorage
    _setSettings = async(id,newValue) => {
        const elementsIndex = this.state.settings.findIndex(element => element.id == id )
        let newArray = [...this.state.settings]
        newArray[elementsIndex] = {...newArray[elementsIndex], value: newValue}
        this.setState({settings: newArray},() => {
            this._saveSettings()
        })
    }

    // Save settings state to AsyncStorage
    _saveSettings = async () => {
        AsyncStorage.setItem('settings', JSON.stringify(this.state.settings));
    }

    // Retrieve settings from AsyncStorage
    _getSettings = async () => {
        AsyncStorage.getItem('settings').then((settings) => {
            const s = settings ? JSON.parse(settings) : []; // get array
            this.setState({settings: s})
        })
    }

    render() {

        return (
          <View style={{flex: 1}}>
            <View style={{flex: 1}}>
            <View style={{marginTop: widthPercentageToDP('4%')}}>
              <Text style={styles.header}>Mes règlages</Text>
              <FlatList
                scrollEnabled={false}
                data={this.state.settings}
                renderItem={({ item }) => <SettingsItem settings={item} setSettings={this._setSettings} toggle={this._handleToggle}  />}
                keyExtractor={item => item.id}
            />

            </View>
            <View>
              <Text style={styles.header}>Mes données</Text>
                <TouchableOpacity  style={styles.main_container} onPress={() => {this._askForEraseData()}}>
                  <Text style={styles.settings_name}>Effacer tous les comptes rendus</Text>
                </TouchableOpacity>
            </View>
            </View>
              <Text style={styles.appVersionContainer}>
                Version {this.state.appVersion}
              </Text>
          </View>
        );
      }
    }

    const styles = StyleSheet.create({

      header: {
        fontSize: widthPercentageToDP('5.5%'),
        marginTop: heightPercentageToDP('2%'),
        marginLeft: widthPercentageToDP('2%')
      },

      main_container: {
        height: heightPercentageToDP('7%'),
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: '#f8f8f8',
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center'
      },
      appVersionContainer: {
        margin: heightPercentageToDP('1%'),
        fontSize: widthPercentageToDP('3%'),
        textAlign: 'center',
        color: '#666666'
      },
      settings_name: {
          margin: widthPercentageToDP('2%'),
          fontSize: widthPercentageToDP('4%'),
          flex: 1,
          flexWrap: 'wrap',
          color: 'red',
      },
    });



export default Settings
