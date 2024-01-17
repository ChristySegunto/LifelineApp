import React, { useState, userState } from "react";
import {Text, StyleSheet, View, ScrollView, ImageBackground, Image, TextInput, TouchableOpacity, Alert } from "react-native";
import { app, getDatabase, db } from "firebase/database";
import { getFirestore, collection, doc, getDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const Login = ({navigation})=>{

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = async () => {
        const auth = getAuth(app);

        // Initialize Firestore
        const firestore = getFirestore(app);

        // try {

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            
            if (userCredential && userCredential.user){
                const user = userCredential.user;

                

                // Check user role in Firestore
                const userDocRef = doc(firestore, 'users', user.uid); // Assuming 'users' is your collection
                const userDoc = await getDoc(userDocRef);



                if (userDoc.exists()) {
                    const userAcc = userDoc.data();
                    const userRole = userAcc.role;

                    Alert.alert('Success', 'Logged In Successfully');

                    if (userRole === 'Fireauth') {
                        navigation.navigate('Home_Fireauth');
                    } else if (userRole === 'Resident') {
                        navigation.navigate('Home_Resident');
                    } else {
                        console.error('Unknown user role:', userRole);
                    }
                    
                } else {
                    console.error('User document not found in Firestore.');
                }

            } else {
                Alert.alert('Failed', 'Invalid Credentials');
            }
            

        // } catch (error) {
        //     const errorCode = error.code;
        //     const errorMessage = error.message;
        //     // ..
        //     //Alert.alert('Error', errorMessage);
        // }
            

    }

    function navigate(){
        navigation.navigate('Register');
        navigation.navigate('Home_Resident');
        navigation.navigate('Home_Fireauth')
    }



    return (

        <View style={styles.mainView}> 
            <ImageBackground source={require('./../assets/img/lifeline_imagebg_1080x1920.png')} style={styles.mainView}>
                <View style={styles.TopView}>
                    <Image source={require('./../assets/img/lifeline_logo_only_tp.png')} style={styles.ImageStyle}/>   
                </View>
                <View style={styles.BottomView}>
                    <Text style={styles.Heading}>
                        LOGIN
                    </Text>
                    <Text style={styles.SubHeading}>
                        Please log in to continue.
                    </Text>
                    
                    <View style={styles.FormView}>

                    </View>

                    {/* Textbox */}
                    <TextInput value={email} placeholder={"Email"} style={styles.TextInput} onChangeText={(text) => setEmail(text)} />
                    <TextInput value={password} placeholder={"Password"} secureTextEntry={true} style={styles.TextInput} onChangeText={(text) => setPassword(text)} />

                    {/* Button */}
                    <TouchableOpacity style={styles.Button} onPress={signIn}>
                        <Text style={styles.ButtonText}>LOGIN</Text>
                    </TouchableOpacity>

                    {/* Hyperlink  */}
                    <View style={styles.ExtraView}>
                        <Text style={styles.MiniText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigate('Login')}>
                            <Text style={styles.HyperlinkText}>Register.</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ImageBackground>
        </View>
    )
};


const styles = StyleSheet.create({
    mainView:{
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
    TopView:{
        width: '100%',
        height: '35%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 70,
    },
    BottomView:{
        width: '100%',
        height:'70%',
        backgroundColor: 'rgba(246, 246, 246, 0.7)',
        borderRadius: 30,
        alignItems: 'center',
    },
    ImageStyle:{
        width: '65%',
        resizeMode: 'contain',
    },
    Heading:{
        color: '#000',
        fontSize: 60,
        fontWeight: 'bold',
        marginTop: 40,
    },
    SubHeading:{
        color: '#000',
        fontSize: 15,
    },
    FormView:{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 30,
    },
    TextInput:{
        width: '80%',
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 20,
        fontSize:17,
    },
    Button:{
        width: 200,
        height: 50,
        backgroundColor: '#C1121F',
        alignItems: 'center', // Center text horizontally
        justifyContent: 'center', // Center text vertically
        borderRadius: 10,
        marginTop: 40,
        marginBottom: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    ButtonText:{
        color: '#FFF',
        fontSize: 16,
    },

    ExtraView: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    MiniText: {
        color: '#000',
        fontSize: 14,
    },

    HyperlinkText: {
        color: '#C1121F',
        fontSize: 14,
    },

    
});

export default Login;