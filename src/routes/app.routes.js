import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useRoute } from '@react-navigation/native';

import Home from '../pages/Home';
import PostAdd from '../pages/PostAdd';
import Camera from '../pages/Camera';
import FullPost from '../pages/FullPost';


import Ionicons from 'react-native-vector-icons/Ionicons';


const AuthStack = createBottomTabNavigator()
const Stack = createStackNavigator()



function HomeRoute() {

    return (
        <Stack.Navigator
            screenOptions={{
                initialRouteName: 'Home',
                headerShown: false
            }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="FullPost" component={FullPost} />
        </Stack.Navigator>
    )
}

function PostAddRoute() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name="PostAdd" component={PostAdd} />
            <Stack.Screen name="Camera" component={Camera} />



        </Stack.Navigator>
    )

}

function AppRoutes() {
   
    return (

        <AuthStack.Navigator
            initialRouteName="Home"
            tabBarOptions={{
                keyboardHidesTabBar: true,
                showLabel: false,
                style: {
                    backgroundColor: '#852eff',
                    borderRadius: 200,
                    position: 'absolute',
                    width: 400,
                    top: '93%',
                    left: '2.5%'
                },
                activeTintColor: '#fff',
                inactiveTintColor: 'rgba(255, 255, 255, 0.52)'
            }}
        >
            <AuthStack.Screen
                name="Home"
                component={HomeRoute}
                options={{
                    headerShown: false, tabBarIcon: ({ color }) => {
                        return <Ionicons name="home-outline" color={color} size={35} />
                    }
                }}
            />

            <AuthStack.Screen
                name="PostAdd"
                component={PostAddRoute}
                options={{
                    tabBarVisible: false,
                    tabBarIcon: ({ color }) => {
                        return <Ionicons name="add-circle-outline" color={color} size={35} />
                    }
                }}
            />



        </AuthStack.Navigator>
    )
}



export default AppRoutes;