// Chat_Fireauth.js
import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback,
} from 'react';
import colors from '../colors';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { TouchableOpacity, Text, View, Alert } from 'react-native';
import { GiftedChat } from "react-native-gifted-chat";
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { app } from '../Firebase/firebase';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
//import { getFirestore, collection, addDoc } from "firebase/firestore";

export default function Chat_Fireauth() {
    const navigation = useNavigation();
    const [messages, setMessages] = useState([]);
    const [locationDetails, setLocationDetails] = useState('');
    const [fireCauseDetails, setFireCauseDetails] = useState('');
    const [fireSizeDetails, setFireSizeDetails] = useState('');
    const [fireDepartment, setFireDepartment] = useState('');
    const [specialNeeds, setSpecialNeeds] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [userName, setUserName] = useState('');
    

    //firebase

    const currentDate = new Date();
    const dateOnly = currentDate.toLocaleDateString();

    const [isTextInputEnabled, setIsTextInputEnabled] = useState(true); // Add this state

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const db = getFirestore();
                const q = query(collection(db, "fireReport"));
                const querySnapshot = await getDocs(q);

                const posts = querySnapshot.docs.map(doc => ({
                    userFullName: doc.data().userFullName,
                    timestamp: doc.data().timestamp,
                    additionalInfo: doc.data().additionalInfo,
                    fireCauseDetails: doc.data().fireCauseDetails,
                    fireSizeDetails: doc.data().fireSizeDetails,
                    locationDetails: doc.data().locationDetails,
                    specialNeeds: doc.data().specialNeeds,
                    id: doc.id
                }));

                setMessages((prevMessages) => GiftedChat.append(prevMessages, posts.map(createBotMessageFromData)));
            } catch (error) {
                console.error("Error fetching fire report:", error);
            }
        };

        // ...

        fetchReport();

        
    }, []);

    // ...

    const createBotMessageFromData = (fireReportData) => ({
        _id: `${fireReportData.id}-${new Date().getTime()}`,
        text: `Subject: Urgent - ${fireReportData.userFullName}\n\n
Hey Team,

This is Firey, your AI assistant. I've received updates regarding the ongoing fire incident at ${fireReportData.locationDetails}. Here are the details:

Date:
${fireReportData.timestamp}

Person who reported: 
${fireReportData.userFullName}

Location: 
${fireReportData.locationDetails}

Cause of fire:
${fireReportData.fireCauseDetails}

Size of fire:
${fireReportData.fireSizeDetails}

Thank you and stay safe!`,

createdAt: new Date(),
user: { _id: 2, name: 'Firey', avatar: './../assets/img/avatar.png' },

});




    const proceedButton = { title: 'Proceed', value: 'proceed', style: { backgroundColor: '#C1121F', color: 'white' } };
    const exitButton = { title: 'Exit', value: 'exit', style: { backgroundColor: '#A6A6A6', color: 'white' } };



    const createBotMessage = (text, buttons = []) => ({
        _id: Math.round(Math.random() * 1000000).toString(),
        text,
        buttons,
        createdAt: new Date(),
        user: { _id: 2, name: 'Firey', avatar: './../assets/img/avatar.png' },
    });




    const sendToFireAuth = async (message) => {
        // Assuming you have a Firebase Authentication user
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const messagesRef = collection(db, "messages");
            await addDoc(messagesRef, {
                text: message[0].text,
                createdAt: new Date().getTime(),
                user: {
                    _id: user.uid,
                    name: user.displayName,
                    avatar: user.photoURL,
                },
                // Assuming you have a 'role' field for the user
                role: 'fireauth',
            });
        }

    };


    return (
        <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}

            messagesContainerStyle={{
                backgroundColor: '#fff',
            }}
            user={{
                _id: 1, // Your user ID
            }}
            textInputProps={{ editable: isTextInputEnabled }} // Disable TextInput based on isTextInputEnabled state

        />
    );
}



