import React, {useState} from 'react'
import { View, AsyncStorage, TextInput, StyleSheet, Switch,Text, TouchableOpacity} from 'react-native'
import moment from 'moment'
import DialogInput from 'react-native-dialog-input';

class SettingsItem extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isDialogVisible: false,
            dialogTitle: "none",
            settingId: "",
            toggleSwitchRepeatAdrenaline: undefined
        }
    }


    _displayDialog (value) {
        this.setState({ isDialogVisible: value });
    }

    _displaySettings(id,value,title) {
        switch(id) {
            case 'adrenaline_timer':
                return (
                    <TouchableOpacity  style={styles.main_container} onPress={() => {this._editSettings(id)}}>
                        <Text style={styles.settings_name}>{title}</Text>
                            <Text style={styles.settings_value}>{value} min</Text>
                    </TouchableOpacity>
                )
                break
            case 'adrenaline_unit':
                return (
                    <TouchableOpacity  style={styles.main_container} onPress={() => {this._editSettings(id)}}>
                        <Text style={styles.settings_name}>{title}</Text>
                        <Text style={styles.settings_value}>{value} mg</Text>
                    </TouchableOpacity>
                )
                break;
            case 'adrenaline_repeat':
                return (
                    <TouchableOpacity  style={styles.main_container} onPress={() => {this._editSettings(id)}}>
                        <Text style={styles.settings_name}>{title}</Text>
                        <Text style={styles.settings_value}>{value} fois</Text>
                    </TouchableOpacity>
                )
                break;
            default:
                break;
        }
    }

    _editSettings (id,oldValue) {
        switch(id) {
            case 'adrenaline_timer':
                this.setState({
                    dialogTitle: "Minuteur d'adrénaline",
                    settingId: id,
                    isDialogVisible: true
                })
                break
            case 'adrenaline_unit':
                this.setState({
                    dialogTitle: "Quantité d'adrènaline administré",
                    settingId: id,
                    isDialogVisible: true
                })
                break;
            case 'adrenaline_repeat':
                this.setState({
                    dialogTitle: "Répétition de l'alerte d'adrénaline",
                    settingId: id,
                    isDialogVisible: true
                })
                break;
            default:
                break;
        }
    }

    render() {
        const {settings,setSettings,handleToggle} = this.props
        return(
            <View>

                {this._displaySettings(settings.id,settings.value,settings.title)}

                <DialogInput isDialogVisible={this.state.isDialogVisible}
                    title={this.state.dialogTitle}
                    submitText="Sauvegarder"
                    cancelText="Annuler"
                    textInputProps={{ keyboardType: 'number-pad' }}
                    submitInput={ (inputText) => {
                        setSettings(this.state.settingId,inputText)
                        this._displayDialog(false)
                    } }
                    closeDialog={ () => {this._displayDialog(false)}}>
                </DialogInput>
            </View>


        )
    }
}

const styles = StyleSheet.create({
    main_container: {
      height: 60,
      flexDirection: 'row',
      borderTopWidth: 1,
      borderColor: '#f8f8f8',
      backgroundColor: '#ffffff',
      flex: 1,
      justifyContent: 'center',
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
    }
  })

export default SettingsItem
