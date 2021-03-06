/* @flow */

import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ListView
} from 'react-native'

import * as firebase from 'firebase'
import {Container, Content, ListItem} from 'native-base'

var data = []
var currentUser

export default class FavTab extends Component {
  constructor (props) {
    super(props)

    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

    this.state = {
      listViewData: data
    }
  }

componentDidMount() {
  this.getFavorites()
}

getFavorites = async () => {
  currentUser = await firebase.auth().currentUser
  var that = this

  firebase.database().ref(currentUser.uid).child('favorites').on('child_added', function (data) {
    var newData = [...that.state.listViewData]
    newData.push(data)
    that.setState({listViewData: newData})
  })
}

  render () {
    return (
      <Container style={styles.container}>
        <Content>
          <ListView
            enableEmptySections
            dataSource={this.ds.cloneWithRows(this.state.listViewData)}
            renderRow={data =>
              <ListItem onPress = {() =>
              this.props.navigation.navigate('SearchTabNavigator', {beerName: data.val().name})}>
                <Text>{data.val().name}</Text>
              </ListItem>
            }
          />
        </Content>
      </Container>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
})
