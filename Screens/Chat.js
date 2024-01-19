// chat.js
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
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, doc, getDoc } from "firebase/firestore";
import { app } from '../Firebase/firebase';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
//import { getFirestore, collection, addDoc } from "firebase/firestore";

export default function Chat() {
    const navigation = useNavigation();
    const [messages, setMessages] = useState([]);
    const [conversationStep, setConversationStep] = useState(0);
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

    const resetChat = () => {
        // Reset all relevant state variables
        setMessages([]);
        setLocationDetails('');
        setFireCauseDetails('');
        setFireSizeDetails('');
        setFireDepartment('');
        setSpecialNeeds('');
        setAdditionalInfo('');
        setIsTextInputEnabled(true);
        setConversationStep(0);  // Reset the summarization flag
    };

    useEffect(() => {
        //Initiate the chat when the component mounts
        resetChat();
        handleFireInitiation();
    }, []);  
 
    
    const proceedButton = { title: 'Proceed', value: 'proceed', style: { backgroundColor: '#C1121F', color: 'white' } };
    const exitButton = { title: 'Exit', value: 'exit', style: { backgroundColor: '#A6A6A6', color: 'white' } };


    const handleFireInitiation = () => {
        const initialMessage = createBotMessage("Hi, this is Firey. Please select an option:", [
            { ...proceedButton, onPress: () => handleButtonPress(proceedButton.value) },
            { ...exitButton, onPress: () => handleButtonPress(exitButton.value) },
        ]);
        setMessages((prevMessages) => GiftedChat.append(prevMessages, initialMessage));
        setIsTextInputEnabled(false); // Disable text input during handleFireInitiation

        setConversationStep(0);

    };

    const createBotMessage = (text, buttons = []) => ({
        _id: Math.round(Math.random() * 1000000).toString(),
        text,
        buttons,
        createdAt: new Date(),
        user: { _id: 2, name: 'Firey', avatar: './../assets/img/avatar.png' },
    });

    const handleButtonPress = (value) => {

        if(value === 'proceed'){
            setIsTextInputEnabled(true);
            handleProceed();
        } else if (value === 'exit'){
            Alert.alert("Thank you for using Firey.","We hope that you are always safe!");
            navigation.navigate('Home_Resident');
        }

    }

    const handleProceed = (text) => {
        switch (conversationStep) {
            case 0:
                console.log(conversationStep);
                askLocationDetails();
                break;
            case 1:
                console.log(conversationStep);
                setLocationDetails(text);
                askFireCauseDetails(); // Remove this line
                break;
            case 2:
                console.log(conversationStep);
                setFireCauseDetails(text);
                askFireSizeDetails(); // Remove this line
                break;
            case 3:
                console.log(conversationStep);
                setFireSizeDetails(text);
                askSpecialNeeds(); // Remove this line
                break;
            case 4:
                console.log(conversationStep);
                setSpecialNeeds(text);
                askAdditionalInformation(); // Remove this line
                break;
            case 5:
                console.log(conversationStep);
                setAdditionalInfo(text);
                goodbye(); // Remove this line
                break;
            default:
                
                break;
        }
    };

        const askLocationDetails = (text) => {
            //setLocationDetails(text);
            const locationMessage = createBotMessage(`Hello! I'm here to help. I'm sorry to hear about the emergency.\n\nPlease provide details about the location.`);  
            setMessages((prevMessages) => GiftedChat.append(prevMessages, locationMessage));
            setConversationStep(1);
            console.log("Conversation Step: ", conversationStep);
            console.log("part: askLocationDetails");
        };

        const askFireCauseDetails = (text) => {
            //setFireCauseDetails(text);
            //handle user input for location details
            //setLocationDetails(text);

            const fireCauseMessage = createBotMessage("Thank you! That is noted. Can you provide any additional details, such as how the fire started?");
            setMessages((prevMessages) => GiftedChat.append(prevMessages, fireCauseMessage));
            setConversationStep(2);
            console.log("Conversation Step: ", conversationStep);
            console.log("part: fireCauseMessage");
        };

        const askFireSizeDetails = (text) => {
            //setFireSizeDetails(text);
            // Logic to handle user input for fire cause details
            //setFireCauseDetails(text);

            const fireSizeMessage = createBotMessage("Understood. How about the size of the fire?");
            setMessages((prevMessages) => GiftedChat.append(prevMessages, fireSizeMessage));

            // Update the conversation step
            setConversationStep(3);
        };

        // Use useEffect to log the conversation step after it's updated
        useEffect(() => {
            console.log("Conversation Step: ", conversationStep);
            if (conversationStep === 3) {
                console.log("part: FireSizeDetails");
            }
        }, [conversationStep, locationDetails, fireCauseDetails, fireSizeDetails, specialNeeds, additionalInfo]);

        const askSpecialNeeds = (text) => {
            //setSpecialNeeds(text);
            //setFireSizeDetails(text);

            const specialNeedsMessage = createBotMessage("I've relayed that information to the fire department.\n\nIn the meantime, please make sure to evacuate the building calmly and follow any safety procedures.\n\nIs there anyone with mobility issues or special needs that the emergency services should be aware of?")
            setMessages((prevMessages) => GiftedChat.append(prevMessages, specialNeedsMessage));

            setConversationStep(4);
            console.log("Conversation Step: ", conversationStep);
            console.log("part: askSpecialNeeds");
        };


        const askAdditionalInformation = (text) => {
            //setAdditionalInfo(text);
            //setSpecialNeeds(text);
            // Logic to handle user input for additional information
            const additionalInfoMessage = createBotMessage("Is there any other important information that you can provide?");
            setMessages((prevMessages) => GiftedChat.append(prevMessages, additionalInfoMessage));
            setConversationStep(5);
            console.log("Conversation Step: ", conversationStep);
            console.log("part: AdditionalInformation");

        };
        

        const goodbye = (text) => {
            //setAdditionalInfo(text);
            //setAdditionalInfo(text);
            const goodbyeMessage = createBotMessage(`The fire departments are now informed. They’ll do their best to reach the location as quickly as possible.\n\nPlease let them know anything else they might need to be aware of when they arrive.\n\nKeep safe and take care!`);
            setMessages((prevMessages) => GiftedChat.append(prevMessages, goodbyeMessage));
            setConversationStep(7);
            console.log("Conversation Step: ", conversationStep);
            console.log("part: goodbye");
            setIsTextInputEnabled(false);
            
        }

    useEffect(() => {
        if (conversationStep === 7) {
            summarizeMessage();
        }
    }, [conversationStep]);



        const summarizeMessage = async () => {
            const defaultMessage = createBotMessage(`This is your summarized fire report:\n\nLocation Details: ${locationDetails}\nFire Cause Details: ${fireCauseDetails}\nFire Size Details: ${fireSizeDetails}\nSpecial Needs: ${specialNeeds}\nAdditional Information: ${additionalInfo}`);
            setMessages((prevMessages) => GiftedChat.append(prevMessages, defaultMessage));

            // Get the current user's ID
            const db = getFirestore();
            const auth = getAuth();
            const userId = auth.currentUser.uid;

            // Get the user's data
            let fullName = '';
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                fullName = userSnap.data().fullName;
            } else {
                console.log('No such document!');
            }

            try {
                await addDoc(collection(db, "fireReport"), {
                    userId: userId,
                    userFullName: fullName,
                    locationDetails: locationDetails,
                    fireCauseDetails: fireCauseDetails,
                    fireSizeDetails: fireSizeDetails,
                    specialNeeds: specialNeeds,
                    additionalInfo: additionalInfo,
                    timestamp: defaultMessage.createdAt.toLocaleDateString('en-GB', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric',
                    }),

                    // Add any other fields you want to store here
                });

                console.log("success adding the data in the database");
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }



    const onSend = (messages = []) => {
        const userMessage = messages[0];
        setMessages((prevMessages) => GiftedChat.append(prevMessages, userMessage));

        // Assuming you want to handle the user's input for the current step
        handleProceed(userMessage.text);

    };

    


    const renderButtons = (buttons) => (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
            {buttons && buttons.map((button) => (
                <TouchableOpacity
                    key={button.value}
                    onPress={button.onPress}
                    style={{
                        backgroundColor: button.style.backgroundColor,
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 5,
                        marginHorizontal: 4,
                    }}
                >
                    <Text style={{ color: button.style.color }}>{button.title}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );





    return (
        <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}

            renderMessage={(props) => (
                <>
                    <View style={{ backgroundColor: props.currentMessage.user._id === 2 ? '#F6F6F6' : '#C1121F', borderRadius: 10, padding: 10, marginLeft: props.currentMessage.user._id === 1 ? '36%' : 0, marginBottom: 5, width: '60%' }}>
                        <Text style={{ color: props.currentMessage.user._id === 1 ? 'white' : 'black' }}>{props.currentMessage.text}</Text>
                        {renderButtons(props.currentMessage.buttons)}
                    </View>
                </>
            )}

            messagesContainerStyle={{
                backgroundColor: '#fff',
            }}
            user={{
                _id: 1, // Your user ID
            }}
            textInputProps={{editable: isTextInputEnabled}} // Disable TextInput based on isTextInputEnabled state

        />
    );
}



