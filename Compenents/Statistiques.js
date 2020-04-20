import * as React from 'react'
import { View, StyleSheet, FlatList,AsyncStorage} from 'react-native'
import StatistiquesItem from '../Compenents/StatistiquesItem'

class Statistiques extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            cpr: [],
            cprData: undefined,
            flights: []
        }
    }

    _getCprInfos = async() => {
        var data = await AsyncStorage.getItem('cpr')
        this.setState({cprData: JSON.parse(data)})
    }


    _displayDetail = (cpr) => {
        this.props.navigation.navigate("StatistiquesDetails", {cpr: cpr})
    }


    _displayList() {
        return(
            <FlatList
            data={this.state.cprData}
            keyExtractor={(item) => item.start_cpr.toString()} // Clef unique
            renderItem={({item}) => <StatistiquesItem cpr={item} displayDetail={this._displayDetail} /> }
            />
        )
    }


    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this._getCprInfos()
        });
      }

    render() {

        return(
            <View style={styles.mainContainer}>
                {this._displayList()}
            </View>
        )
    }
}


const styles = StyleSheet.create({


    mainContainer: {
        backgroundColor: '#f7f8fa',
        flex: 1
    },
    textinput: {
      marginLeft: 5,
      marginRight: 5,
      height: 50,
      borderColor: '#000000',
      borderWidth: 1,
      paddingLeft: 5
    },
    button: {
        height: 50
    }
  })


export default Statistiques
