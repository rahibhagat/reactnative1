/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
  }
}
import React, { Component } from 'react';

import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight
} from 'react-native';
import Runinfo from './components/Runinfo';
import Runinfonumeric from './components/Runinfonumeric';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import MapView from 'react-native-maps';
import haversine from 'haversine';
import reducer from './reducer';
import {incrementDistance, setSpeed, setBearing} from './action';



const styles = StyleSheet.create({
  infoWrapper: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    flexDirection: 'row',
    flex: 1
  },
  map: {
    position:'absolute',
    right:0,
    left:0,
    bottom:0,
    top:0
    
  }
});


let id = 0;
const store = createStore(reducer);
type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);

    let watchID = navigator.geolocation.watchPosition(
      (position) => {

        if(this.state.previousCoordinate) {
          let distance = haversine(this.state.previousCoordinate,
                                         position.coords,{unit: 'mile'});
          store.dispatch(incrementDistance(distance));
        }
        store.dispatch(setSpeed(position.coords.speed));
        store.dispatch(setBearing(position.coords.heading));

        

      this.setState({
        markers:[
        ...this.state.markers,{
        coordinate: position.coords,
        key:id++
       }
      ],
      previousCoordinate: position.coords,
    
    });
  }, 
  (error) => this.setState({ error: error.message }),
  { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000, distanceFilter: 5},);

    this.state = { markers: [], watchID };

 
  }



  componentWillUnmount() {
    navigator.geolocation.stopWatch(this.state.watchID);
  }


    addMarker(region) {
      let now = (new Date).getTime();
      if (this.state.ladAddedMarker > now - 5000) {
        return;
      }

      this.setState({
        markers: [
          ...this.state.markers, {
            coordinate: region,
            key: id++
          }
        ],
        ladAddedMarker: now
      });
    }


  render() {
    return (
      <Provider store = {store}>
        <View style={{flex: 1}}>
        <MapView style={styles.map}
          showsUserLocation = {true}
          followsUserLocation = {true}
          initialRegion={{
            latitude: 22.284627,
            longitude: 73.225371,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02
          }}
          onRegionChange={(region) => this.addMarker(region)}
        >
            {this.state.markers.map((marker)=>(
          <MapView.Marker coordinate={marker.coordinate} key={marker.key}/>
        ))}
        <MapView.Polyline
              coordinates = {this.state.markers.map((marker) => marker.coordinate)}
              strokeWidth={5}
            />
          </MapView>
          <View style={styles.infoWrapper}>
            <Runinfonumeric title="Distance" 
            unit="mi" type="distance"
            ref={(info) => this.distanceInfo = info}
            />
            <Runinfonumeric title="Speed" 
            unit="km/h" type="speed"
            ref={(info) => this.speedInfo = info}
            />
            <Runinfo title="Direction" 
            value="NE" type="bearing"
            ref={(info) => this.directionInfo = info}
            />
          </View>
        </View>
        </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
