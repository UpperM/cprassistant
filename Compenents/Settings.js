import React from 'react'
import { View, TouchableOpacity, StyleSheet, FlatList,Text, AsyncStorage, Alert } from 'react-native'
import SettingsItem from '../Compenents/SettingsItem'

class Settings extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            settings: [],
            adrenaline_repeat: undefined
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
          <View>
            <View style={{marginTop: 50}}>
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
                  <Text style={styles.erase_data}>Effacer tous les comptes rendus</Text>
                </TouchableOpacity>
            </View>
          </View>
        );
      }
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        marginRight:1,
        backgroundColor: '#f7f8fa'
      },

      header: {
        fontSize: 20,
        margin: 10
      },

      line: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',
        flexDirection: 'row',
      },

      input: {
        borderRadius: 2,
        borderWidth: 2,
        borderColor: '#009688',
        flex: 1,
        padding: 5
      },

      text: {
        textAlign: 'center',
        padding: 15
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
      erase_data: {
        marginLeft: 10,
        marginRight: 20,
        fontSize: 16,
        color: 'red',
        textAlign: 'left'
      }
    });



export default Settings
