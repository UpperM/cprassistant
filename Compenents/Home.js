import React from 'react'
import { View, Button, TextInput, StyleSheet, TouchableOpacity,Text, AsyncStorage, PermissionsAndroid,Platform} from 'react-native'
import ProgressCircle from 'react-native-progress-circle'
import moment, { unix } from "moment";
import DialogInput from '../Modules/DialogInput';
import Toast from 'react-native-simple-toast';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import {
    Player,
    Recorder,
    MediaStates
} from '@react-native-community/audio-toolkit';

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isInProgress: false,
            allCpr: [],
            cpr_id: undefined,
            start_cpr: undefined,
            patient_name: undefined,
            choc: [],
            adrenaline: [],
            intubation: undefined,
            records: [],
            initialTimer : undefined,
            timer: 0,
            buttonVisibility: true,
            showIntubation: true,
            stopwatch: 0,
            timerEndIn: 0,
            progressPercent:100,
            isVisible: true,
            cpr: undefined,
            isDialogVisible: false,
            settings: [],
            isRecording: false,
            recognized: '',
            started: '',
            results: [],
        }

    }

    componentDidMount() {
        this._getSettings()
        this.recorder = null
        this.player = null
        this.repeatCount = 0
        let recordAudioRequest;
        if (Platform.OS == 'android') {
          recordAudioRequest = this._requestRecordAudioPermission();
        } else {
          recordAudioRequest = new Promise(function (resolve, reject) { resolve(true); });
        }
    }


    /* AsyncStorage Function */
    _showStorage () {
        AsyncStorage.getAllKeys((err, keys) => {
            AsyncStorage.multiGet(keys, (error, stores) => {
              stores.map((result, i, store) => {
                console.log({ [store[i][0]]: store[i][1] });
                return true;
              });
            });
          });
    }

    _getSettingValue(id) {
        var value = this.state.settings.filter(data => data.id == id).map(item => item.value)
        return value.toString()
    }

    _getInitialTimer() {
        var value = parseInt(this._getSettingValue('adrenaline_timer'))
        this.setState({
            initialTimer: value * 60
        })
    }

    /* Play Reminder funciton */
    _stopReminder() {
        this.player.stop()
        this.player.destroy()
    }

    _playReminder() {
        this.player = new Player('reminder.mp3')

        var repeatCount = parseInt(this._getSettingValue('adrenaline_repeat'))
        this.player.on('ended', () => {
            this._doWePlayAgain()
        })
        this.player.play()
    }

    _doWePlayAgain() {
        console.log("Calling doWePlay")
        this.repeatCount = this.repeatCount + 1

        // Get count from settings
        var settingsRepeatCount = parseInt(this._getSettingValue('adrenaline_repeat'))
        console.log("Settings : " + settingsRepeatCount + " Current count : " + this.repeatCount)
        if (this.repeatCount >= settingsRepeatCount) {
            console.log("On stop")
            this._stopReminder()
            this.repeatCount = 0
        } else {
            console.log("On replay")
            this._playReminder()
        }
    }
    /* Record functions */
    async _requestRecordAudioPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: 'Microphone Permission',
              message: 'CPR Assistant à besoin d\'accèder à votre microphone',
              buttonNeutral: 'Plus tard',
              buttonNegative: 'Non',
              buttonPositive: 'Oui',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
          } else {
            return false;
          }
        } catch (err) {
          console.error(err);
          return false;
        }
    }

    _reloadRecorder() {
        if (this.recorder) {
          this.recorder.destroy();
        }

        var date = moment(new Date()).format('YYYY-MM-DDTHH_mm_ss') // Ne pas remplacer les _ par des : car cela fait planté le lecteur audio
        var filename = "cpr_record_" + date + ".mp4"
        this.setState({records: [...this.state.records, filename]})

        this.recorder = new Recorder(filename, {
          bitrate: 256000,
          channels: 2,
          sampleRate: 44100,
          quality: 'max'
        });
        this.recorder.toggleRecord()
    }

    _onRecordPress() {
        if (this.state.isRecording)
        {
            //Stop record
            Toast.show('Enregistrement effectué')
            this.setState({isRecording: false});
            this.recorder.destroy()
        } else {
            // Start Record
            this.setState({isRecording: true});
            Toast.show('Enregistrement en cours ...')
            this._reloadRecorder()
        }
    }

    // Retrieve settings from AsyncStorage
    _getSettings = async () => {
        await AsyncStorage.getItem('settings').then((settings) => {
            const s = settings ? JSON.parse(settings) : []; // get array
            this.setState({settings: s})
        })
    }
    _cprArrayExist = async() => {
        try {
           let value = await AsyncStorage.getItem('cpr');
           if (value != null){
              return true
           }
           else {
               var array = {}
               await AsyncStorage.setItem("cpr",JSON.stringify(array))
          }
        } catch (error) {
          // Error retrieving data
        }
    }

    _getCprInfos = async() => {
        this._showStorage()
        var data = await AsyncStorage.getItem('cpr')
        this.setState({allCpr: data})
    }

    _storeCprInfos = async() => {
        var array = {
            start_cpr: this.state.start_cpr,
            end_cpr: new Date(),
            patient_name: this.state.patient_name,
            choc: this.state.choc,
            adrenaline: this.state.adrenaline,
            records : this.state.records,
            intubation: this.state.intubation
        }

        AsyncStorage.getItem('cpr')
        .then((cpr) => {
          const c = cpr ? JSON.parse(cpr) : [];
          c.push(array);
          AsyncStorage.setItem('cpr', JSON.stringify(c));
        });
    }

    _setProgressPercent () {
        this.setState({progressPercent: (this.state.timer / this.state.initialTimer) * 100})
    }

    // Handle action when start cpr is clicked
    _handleStartButton () {
        if (this.state.isInProgress) {
            this._displayEndDialog(true)
        } else
        {
            this._startCpr()
        }
    }

    _incrementChoc() {
        this.setState({
            choc: [...this.state.choc, new Date()]
        })
    }

    _addIntubation() {
        this.setState({
            intubation: new Date(),
            showIntubation: false
        })
    }

    _incrementAdrenaline() {
        this.setState({adrenaline: [...this.state.adrenaline, new Date()]})
        this.setState({progressPercent: 100})
        this._stopCountdown()
        this.startTimer()
    }

    _endCpr() {
        deactivateKeepAwake()
        this._getCprInfos()
        this._storeCprInfos()

        // Reset adrenaline and choc count
        this.setState({
            adrenaline: [],
            choc: [],
            progressPercent:100,
            isInProgress: false,
            showIntubation: true,
            intubation: undefined
        })

        this._stopChronometer()
        this._stopCountdown()

    }

    _resetCountdownValue() {
        this._getInitialTimer()
        this.setState({
            timer: this.state.initialTimer
        })
    }

    _startCpr () {
        activateKeepAwake()
        this.setState({
            isInProgress: true,
            start_cpr: new Date()
        }, () => {
            this.startTimer()
            this._startChronometer()

        })

    }

    _setTextStartButton () {
        if (this.state.isInProgress) {
            return(
                "Arrêter le massage cardiaque"
            )
        } else {
            return(
                "Débuter le massage cardiaque"
            )
        }
    }

    _formatSecondToTime(second) {
        return new Date(second * 1000).toISOString().substr(11, 8)
    }

    _displayButtons() {

        if(this.state.isInProgress) {
            return (
            <View>
                <TouchableOpacity style={styles.button} onPress={() => this._incrementAdrenaline()}>
                    <Text style={styles.textButton}>Administration d'adrénaline ({this._formatSecondToTime(this.state.timer)})</Text>
                </TouchableOpacity>

                {this.state.showIntubation &&
                <TouchableOpacity style={styles.button} onPress={() => this._addIntubation()}>
                    <Text style={styles.textButton}>Intubation orotrachéale</Text>
                </TouchableOpacity>
                }
                <TouchableOpacity style={styles.button} onPress={() => this._incrementChoc()}>
                    <Text style={styles.textButton}>Choc</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => this._onRecordPress()}>
                    <Text style={styles.textButton}>{this.state.isRecording ? 'Arrêter l\'Enregistrement' : 'Enregistrement vocal'}</Text>
                </TouchableOpacity>

                <View style={styles.countContainer}>
                    <Text>Nombre de choc : {this.state.choc.length} </Text>
                    <Text>Quantité d'adrénaline : {this.state.adrenaline.length} </Text>
                </View>

            </View>
            )
        }

    }

    _displayEndDialog(state) {
        this.setState({isDialogVisible: state})
    }

    /* Countdown timer functions */
    startTimer = async() => {
        await this._getSettings()

        this.setState({progressPercent: 100})
        this._resetCountdownValue()
        this.clockCall = setInterval(() => {
         this.decrementClock();
        }, 1000);
    }

    decrementClock = () => {

        if(this.state.timer === 0) {
            // Stop the timer
            this._stopCountdown()
            this._playReminder()
            this._incrementAdrenaline()
        }

        this.setState((prevstate) => ({
            timer: prevstate.timer-1,
            timerEndIn: this.state.initialTimer - prevstate.timer
        }), () => {
            this._setProgressPercent()
        });

    }

    _stopCountdown = () => {
        clearInterval(this.clockCall)
        this._resetCountdownValue()
    }

    componentWillUnmount() {
        clearInterval(this.clockCall);
    }

    /* Chronometer functions */
    _startChronometer = () => {
        this.chronometer = setInterval(() => {
         this._incrementChronometer();
        }, 1000);
    }

    _incrementChronometer = () => {
        this.setState((prevstate) => ({ stopwatch: prevstate.stopwatch + 1 }));
    }

    _stopChronometer = () => {
        clearInterval(this.chronometer);
        this.setState({stopwatch: 0 })
    }

    fetchAllItems = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys()
            const items = await AsyncStorage.multiGet(keys)

            return items
        } catch (error) {
            console.log(error, "problemo")
        }
    }

    render() {
        //AsyncStorage.clear();
        console.log("render")
        return(
            <View style={styles.container}>

            <View style={styles.timer}>
            </View>

            <View style={styles.ProgressCircle}>
            <ProgressCircle
                percent={this.state.progressPercent}
                radius={100}
                borderWidth={9}
                color="#3399FF"
                shadowColor="#999"
                bgColor="#fff"
            >
                <Text style={styles.timer}>{this._formatSecondToTime(this.state.stopwatch)}</Text>
            </ProgressCircle>

            </View>



            <TouchableOpacity style={styles.buttonRed} onPress={() => this._handleStartButton()}>
                <Text style={styles.buttonRedText}>{this._setTextStartButton()}</Text>
            </TouchableOpacity>

            <DialogInput isDialogVisible={this.state.isDialogVisible}
                    title={"Nom du patient"}
                    hintInput ={"Jean Dupont"}
                    submitText="Valider"
                    cancelText="Annuler"
                    submitInput={ (inputText) => {
                        this.setState({patient_name: inputText}, () => {
                            this._displayEndDialog(false)
                            this._endCpr()
                        })
                    } }
                    closeDialog={ () => {this._displayEndDialog(false)}}>
            </DialogInput>

            {this._displayButtons()}

          </View>
        )
    }
}

const styles = StyleSheet.create({
    timer: {
        alignItems: "center",
        fontSize: 30
    },

    container: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 10
    },

    buttonRed: {
        alignItems: "center",
        backgroundColor: "#c95959",
        padding: 10,
        margin: 10,
        justifyContent: 'center', //Centered vertically
        alignItems: 'center', // Centered horizontally
        flex: 0.1
    },

    buttonRedText: {
        color: '#DDDDDD',
        fontSize: 23,
    },

    button: {
      alignItems: "center",
      backgroundColor: "#DDDDDD",
      padding: 10,
      margin: 10
    },

    textButton: {
        fontSize: 15
    },
    countContainer: {
      alignItems: "center",
      padding: 10
    },
    ProgressCircle: {
        justifyContent: 'center',
        alignItems: 'center'
    }
  });


export default Home
