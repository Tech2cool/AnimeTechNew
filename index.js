/**
 * @format
 */
import 'react-native-gesture-handler';
import SQLite from "react-native-sqlite-storage";
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './App';
SQLite.enablePromise(true);

AppRegistry.registerComponent(appName, () => App);
