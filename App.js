import * as React from 'react';
import { AsyncStorage } from 'react-native';
import Navigation from './Navigation/Navigation'

export default class App extends React.Component {

    // On mount retrieve settings from AsyncStorage. If not settings found, execute initial settings
  componentDidMount = () => {
      AsyncStorage.getItem('settings').then((value) => {
          if (!value) {
            this._setInitialSettings()
          }
        })
  }
  // Population AsyncStorage with default settings
  _setInitialSettings() {
      let settings = [
          {
              id: 'adrenaline_timer',
              title: 'Minuteur d\'adrénaline',
              value: '3'
            },
            {
                id: 'adrenaline_unit',
                title: 'Quantité d\'adrénaline injectée',
                value: '1'
            },
            {
                id: 'adrenaline_repeat',
                title: 'Répéter l\'alerte d\'adrénaline',
                value: '2'
                
            }
      ]
      AsyncStorage.setItem("settings",JSON.stringify(settings))
  }

  render() {
    return (
      <Navigation/>
    )
  }
}

