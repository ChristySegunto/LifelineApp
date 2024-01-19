import React, { useState, userState, useEffect, useContext } from "react";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, ImageBackground, TouchableOpacity, Image, Alert } from 'react-native';
// import { app, getDatabase, db } from "firebase/database";
import { getFirestore, collection, doc, getDoc, query, where, getDocs, Timestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { app, db } from '../Firebase/firebase';


const Home_Fireauth = ({ navigation }) => {
    const [userName, setUserName] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const auth = getAuth();
    const db = getFirestore(app);


    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const firestore = getFirestore(app);
                const userDocRef = doc(firestore, 'users', user.uid);
                try {
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUserName(userData.fullName);
                    } else {
                        console.error('User document not found in Firestore');
                    }
                } catch (error) {
                    console.error('Error fetching user data from Firestore', error);
                }
            }

        })
        // Cleanup function for useEffect
        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        const currentDate = new Date().toLocaleDateString();
        setCurrentDate(currentDate);
    }, []);

    const onHandleLogout = async () => {
        try {
            await signOut(auth);
            Alert.alert('Success', 'Logged Out Successfully');
            navigation.navigate('Login'); // Navigate to the login screen after logout
        } catch (error) {
            console.error('Logout error:', error.message);
            // Handle logout error if necessary
        }
    };

    return (
        <View style={styles.mainView}>
            <ImageBackground source={require('./../assets/img/lifeline_1080x1920.png')} resizeMode="cover" style={styles.backgroundView}>
                <View style={styles.BigContainer}>
                    <View style={styles.ExtraSpaceUp}>
                        <View style={styles.header}>
                            <View style={styles.row1}>
                                <View style={styles.TitleName}>
                                    <Text style={styles.TextGreet}>Hi, </Text>
                                    <Text style={styles.TextGreet1}>{userName}</Text>
                                </View>
                                <View style={styles.DateToday}>
                                    <Text style={styles.TextDate}>{currentDate}</Text>
                                </View>
                            </View>
                            <View style={styles.row2}>
                                <Image source={require('./../assets/img/firehat.png')} style={styles.Hello}></Image>
                            </View>
                        </View>
                    </View>

                    <View style={styles.BoxLayout}>
                        <View style={styles.LeftBox}>
                            <View style={styles.LeftBox1}>
                                <Image source={require('./../assets/img/locatethefire.png')} style={styles.ButtonImage2}></Image>
                                <Text style={styles.ButtonText}>Available</Text>
                                <Text style={styles.BigButtonText1}>Fire Brigades</Text>
                                <Text style={styles.NumButtonText}>10</Text>
                            </View>
                            <View style={styles.LeftBox2}>
                                <TouchableOpacity style={styles.Button2} onPress={() => navigation.navigate('FireReports')} >
                                    <Image source={require('./../assets/img/locatethefire.png')} style={styles.ButtonImage2}></Image>
                                    <Text style={styles.ButtonText}>Locate the</Text>
                                    <Text style={styles.BigButtonText}>Fire</Text>
                                    <Text style={styles.MiniButtonText}>See a real-time update of fire incidents in a map.</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.RightBox}>
                            <View style={styles.RightBox1}>
                                <TouchableOpacity style={styles.Button2} onPress={() => navigation.navigate('Chat_Fireauth')}>
                                    <Image source={require('./../assets/img/chatwithfirey.png')} style={styles.RButtonImage1}></Image>
                                    <Text style={styles.RButtonText1}>View chats</Text>
                                    <Text style={styles.RBigButtonText1}>From Firey</Text>
                                    <Text style={styles.MiniButtonText}>Fire updates from Firey.</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.RightBox2}>
                                <Text style={styles.BigButtonText1}>Fire incidents</Text>
                                <Text style={styles.RButtonText2}>Happened Today</Text>

                                <Text style={styles.RNumButtonText2}>3</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.ExtraSpaceDown}>
                        <View style={styles.footer}>
                            <TouchableOpacity style={styles.icons} onPress={() => Alert.alert('You are already on the home page.')}>
                                <Entypo name="home" size={45} color="#C1121F" style={styles.icon1} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.icons} onPress={() => navigation.navigate('Chat_Fireauth')}>
                                <Entypo name="message" size={45} color="#A6A6A6" style={styles.icon1} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.icons} onPress={onHandleLogout}>
                                <MaterialIcons name="logout" size={45} color="#A6A6A6" style={styles.icon1} />
                            </TouchableOpacity>


                        </View>
                    </View>
                </View>
            </ImageBackground>
        </View>

    )

}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
    },

    backgroundView: {
        flex: 1,
    },

    BigContainer: {
        flex: 1,
    },

    ExtraSpaceUp: {
        flex: 1.5,
    },

    header: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 25,
        marginRight: 25,
        marginTop: 50,
        marginBottom: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.71)',
        borderRadius: 10,
        padding: 30,
    },


    row1: {
        flex: 2,
        alignContent: 'center',
        justifyContent: 'center',
    },
    row2: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },


    TitleName: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 20,
    },
    DateToday: {
        flex: 1,

    },
    TextGreet: {
        fontSize: 25,
        color: '#000',
    },
    TextGreet1: {
        fontSize: 25,
        color: '#C1121F',
    },
    TextDate: {
        fontSize: 14,
        color: '#545454',
    },
    Hello: {
        width: 90,
        height: 90,
    },



    BoxLayout: {
        flex: 3,
        flexDirection: 'row',
    },
    LeftBox: {
        flex: 1,
        marginRight: '2.5%',
        marginLeft: '7%',
        marginVertical: '2%',
    },
    LeftBox1: {
        flex: 1.5,
        backgroundColor: 'rgba(255, 255, 255, 0.33)',
        marginBottom: '8%',
        borderRadius: 10,
        borderRadius: 10,
        paddingTop: 13,
        paddingLeft: 13,
        paddingRight: 13,
        paddingBottom: 13,
    },
    BigButtonText1: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#C1121F',
        //marginBottom: 15,
    },
    NumButtonText: {
        fontSize: 60,
        textAlign: 'right',
        fontWeight: 'bold',
        color: '#C1121F',
        marginBottom: 15,
        letterSpacing: -5,
    },


    LeftBox2: {
        flex: 1.75,
        backgroundColor: 'rgba(255, 255, 255, 0.71)',
        borderRadius: 10,
        paddingTop: 13,
        paddingLeft: 13,
        paddingRight: 13,
        paddingBottom: 13,
    },
    Button2: {
        flex: 1,
        flexDirection: 'column',
    },
    ButtonImage2: {
        width: '35%',
        height: '25%',
        resizeMode: 'contain',

    },
    ButtonText: {
        marginTop: 5,
        fontSize: 17,
        fontWeight: 'bold',
    },
    BigButtonText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#C1121F',
        marginTop: -4,
        marginBottom: 15,
    },
    MiniButtonText: {
        marginTop: 15,
        fontSize: 14,
        color: '#545454',
    },


    RightBox: {
        flex: 1,
        marginLeft: '2.5%',
        marginRight: '7%',
        marginVertical: '2%',
    },


    RightBox1: {
        flex: 1.75,
        backgroundColor: 'rgba(255, 255, 255, 0.71)',
        marginBottom: '8%',
        borderRadius: 10,
        paddingTop: 10,
        paddingLeft: 13,
        paddingRight: 13,
        paddingBottom: 13,
    },
    RButtonImage1: {
        width: '35%',
        height: '25%',
        resizeMode: 'contain',
    },
    RButtonText1: {
        marginTop: 5,
        fontSize: 15,
        fontWeight: 'bold',
    },
    RBigButtonText1: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#C1121F',
        marginTop: -4,
        marginBottom: 20,
    },
    RMiniButtonText1: {
        marginTop: 15,
        fontSize: 14,
        color: '#545454',
    },




    RightBox2: {
        flex: 1.5,
        backgroundColor: 'rgba(255, 255, 255, 0.33)',
        borderRadius: 10,
        paddingTop: 13,
        paddingLeft: 13,
        paddingRight: 13,
        paddingBottom: 13,
    },

    RButtonText2: {
        marginTop: -5,
        fontSize: 17,
        fontWeight: 'bold',
    },
    RNumButtonText2: {
        fontSize: 100,
        fontWeight: 'bold',
        color: '#C1121F',
        marginBottom: 15,
        letterSpacing: -5,
        textAlign: 'right',
    },


    ExtraSpaceDown: {
        flex: 1,
    },

    footer: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 50,
        marginBottom: 10,
        backgroundColor: '#FFF',
        borderRadius: 10,
        alignItems: 'center',
    },

    icons: {
        flex: 1,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
    },

    icon1: {
        marginLeft: 40,
        marginRight: 40,
        alignContent: 'center',
        justifyContent: 'center',
    },


});


export default Home_Fireauth;