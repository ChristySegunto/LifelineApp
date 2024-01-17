import React, { useState, userState } from "react";
import { Text, StyleSheet, Button, View, ScrollView, ImageBackground, Image, TextInput, TouchableOpacity, TextLink, Alert } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { app, db } from '../Firebase/firebase';

const Register = ({navigation}) => {

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCPassword] = useState("");


    const signUp = async () => {
        const auth = getAuth(app);
        const db = getFirestore(app);

        try{
            if (password === cpassword) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                // Signed in 
                const user = userCredential.user;
                // ...

                const userRef = doc(db, 'users', user.uid);
                await setDoc(userRef, {
                    fullName,
                    email,
                    phoneNum,
                    role: 'Resident',
                });

                Alert.alert('Success', 'Account created successfully');
                navigation.navigate('Login');

            } else {
                alert("Passwords are different!")
            }

                
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
                // ..
            Alert.alert('Error', errorMessage);
        }
        
        
    };
    
    function navigate() {
        navigation.navigate('Register');
        navigation.navigate('Home_Resident');
        navigation.navigate('Home_Fireauth');
    }


    return (

        <View style={styles.mainView}>
            <ImageBackground source={require('./../assets/img/lifeline_imagebg_1080x1920.png')} style={styles.mainView}>
                <View style={styles.TopView}>
                    <Image source={require('./../assets/img/lifeline_logo_only_tp.png')} style={styles.ImageStyle} />
                </View>
                
                <ScrollView style={styles.BottomView} contentContainerStyle={styles.scrollViewContent}>

                    {/* <Icon style={styles.Icons} onPress={navigate('Login')} name="chevron-left" size={20} color={"#000"}/> */}

                    <Text style={styles.Heading}>
                        REGISTER
                    </Text>
                    <Text style={styles.SubHeading}>
                        Please register in to continue.
                    </Text>

                    <View style={styles.FormView}>

                    </View>

                    {/* Textbox */}
                    <TextInput value={fullName} placeholder={"Full Name"} style={styles.TextInput} onChangeText={(text) => setFullName(text)} />
                    <TextInput value={email} placeholder={"Email"} style={styles.TextInput} onChangeText={(text) => setEmail(text)} />
                    <TextInput value={phoneNum} placeholder={"Phone Number"} style={styles.TextInput} onChangeText={(text) => setPhoneNum(text)} />
                    <TextInput value={password} placeholder={"Password"} secureTextEntry={true} style={styles.TextInput} onChangeText={(text) => setPassword(text)} />
                    <TextInput value={cpassword} placeholder={"Confirm Password"} secureTextEntry={true} style={styles.TextInput} onChangeText={(text) => setCPassword(text)} />

                    {/* Button */}
                    <TouchableOpacity style={styles.Button} onPress={signUp}>
                        <Text style={styles.ButtonText}>REGISTER</Text>
                    </TouchableOpacity>

                    {/* Hyperlink */}
                    <View style={styles.ExtraView}>
                        <Text style={styles.MiniText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.HyperlinkText}>Login.</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </ImageBackground>
        </View>
    )
};


const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'contain', // or 'contain' based on your requirement
    },
    TopView: {
        width: '100%',
        height: '25%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    BottomView: {
        width: '100%',
        height: '95%',
        backgroundColor: 'rgba(246, 246, 246, 0.7)',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    ImageStyle: {
        width: '45%',
        resizeMode: 'contain',
    },
    Heading: {
        color: '#000',
        fontSize: 50,
        fontWeight: 'bold',
        marginTop: 35,
    },
    SubHeading: {
        color: '#000',
        fontSize: 15,
    },
    FormView: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 20,
    },
    TextInput: {
        width: '80%',
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 15,
        fontSize: 17,
    },
    Button: {
        width: 200,
        height: 50,
        backgroundColor: '#C1121F',
        alignItems: 'center', // Center text horizontally
        justifyContent: 'center', // Center text vertically
        borderRadius: 10,
        marginTop: 30,
        marginBottom: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    ButtonText: {
        color: '#FFF',
        fontSize: 16,
    },

    ExtraView:{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },

    MiniText:{
        color: '#000',
        fontSize: 14,
    },

    HyperlinkText: {
        color: '#C1121F',
        fontSize: 14,
    },

    Icons:{
        position: 'absolute',
        left: 25,
        top: 25,
    }


});

export default Register;