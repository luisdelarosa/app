import React, { Component } from 'react';
import * as firebase from "firebase";
import MapView from 'react-native-maps';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  NavigatorIOS
} from 'react-native';

firebase.initializeApp({
});

export default class NavigatorIOSApp extends Component {
  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: login,
          title: 'Login'
        }}
        style={{flex: 1}}
      />
    );
  }
}

export class mapview extends Component {
  constructor(props) {
    super(props)

    this.state = {
      markers: []
    }

    let userId = "N0RmyPovlLZYOvnxhhT1JnwZXrH3"
    Database.listenUserDetails(userId, this.onOtherUserUpdatedLocation)
  }

  onOtherUserUpdatedLocation = (lat, lng, timestamp) => {
    this.state.markers = [{
      coordinate: {latitude: parseFloat(lat), longitude: parseFloat(lng)},
      key: "123",
      title: "KrauseFx",
      description: "fastlane guy" + timestamp
    }]
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          style={styles.map}
        >
          {this.state.markers.map(marker => (
            <MapView.Marker
              coordinate={marker.coordinate}
              title={marker.title}
              description={marker.description}
              key={marker.key}
            />
          ))}
        </MapView>
      </View>
    );
  }
}

export class login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: 'email@krausefx.com',
      password: 'abcdefg123'
    }
  }

  async signup(email, pass) {
    try {
      console.log("start")
      await firebase.auth().createUserWithEmailAndPassword(email, pass);

      console.log("Account created");
    } catch (error) {
      console.log(error.toString())
    }
  }

  async login(email, pass) {
    try {
      await firebase.auth()
          .signInWithEmailAndPassword(email, pass);

      console.log("Logged In!");

      let userId = "N0RmyPovlLZYOvnxhhT1JnwZXrH3"
      Database.setUserLocation(userId, "37.78825", "-122.4324", "23.03.2019")

      this.props.navigator.push({
        component: mapview,
        title: 'Map'
      });

    } catch (error) {
      console.log(error.toString())
    }
  }

  async logout() {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.log(error);
    }
  }

  onPressRegister = () => {
    this.signup(this.state.email, this.state.password)
  }

  onPressLogin = () => {
    this.login(this.state.email, this.state.password)
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.email}
          placeholder="Email"
          onChangeText={email => this.setState({email})}
          value={this.state.email}
        />
        <TextInput
          style={styles.password}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={password => this.setState({password})}
          value={this.state.password}
        />
        <Button
          onPress={this.onPressRegister}
          title="Register"
          color="#841584"
          accessibilityLabel="Signup"
        />
        <Button
          onPress={this.onPressLogin}
          title="Login"
          color="#841584"
          accessibilityLabel="Login"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  email: {
    textAlign: 'center',
    height: 50,
    borderStyle: 'solid',
    borderWidth: 1,
    margin: 30,
    marginBottom: 0,
    marginTop: 100
  },
  password: {
    textAlign: 'center',
    height: 50,
    borderStyle: 'solid',
    borderWidth: 1,
    margin: 30
  },
  map: {
    height: "100%",
    width: "100%"
  }
});

AppRegistry.registerComponent('wwdcfamily', () => NavigatorIOSApp);

class Database {
  /**
   * Sets a user location
   * @param userId
   * @param lat
   * @param lng
   * @param timestamp
   * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
   */
  static setUserLocation(userId, lat, lng, timestamp) {
    let userLocationPath = "/user/" + userId + "/details";

    return firebase.database().ref(userLocationPath).set({
      lat: lat,
      lng: lng,
      timestamp: timestamp
    })
  }

  /**
   * Listen for changes to a users location
   * @param userId
   * @param callback Users details
   */
  static listenUserDetails(userId, callback) {
    let userDetailsPath = "/user/" + userId + "/details";

    firebase.database().ref(userDetailsPath).on('value', (snapshot) => {
      var lat = "";
      var lng = "";
      var timestamp = "";

      if (snapshot.val()) {
        lat = snapshot.val().lat
        lng = snapshot.val().lng
        timestamp = snapshot.val().timestamp
      }

      console.log(snapshot.val())

      callback(lat, lng, timestamp)
    });
  }
}

module.exports = Database;
