// chat.js
import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback
} from 'react';
import colors from '../colors';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, Text } from 'react-native';
import { GiftedChat } from "react-native-gifted-chat";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, doc } from "firebase/firestore";
import { app } from '../Firebase/firebase';
import { useAuth } from './../Firebase/AuthContext';



export default function Chat(){
    const [messages, setMessages] = useState([]);
    const auth = getAuth(app);
    const user = auth.currentUser;
    const db = getFirestore(app);

    const userId = auth.currentUser.uid;
    useLayoutEffect(() => {

        const collectionRef = collection(db, 'users', userId, 'messages');
        const q = query(collectionRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            console.log('querySnapshot unsubscribe');
            setMessages(
                querySnapshot.docs.map(doc => ({
                    _id: doc.data()._id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    user: doc.data().user
                }))
            );
        });
        return unsubscribe;
    }, []);

    const onSend = useCallback((messages = []) => {

            setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));

            const { _id, createdAt, text, user } = messages[0];
            const auth = getAuth();
            
            addDoc(collection(db, 'users', userId, 'messages'), {
                _id,
                createdAt,
                text,
                user
            });

    }, []);

    return (

        <GiftedChat
            messages={messages}
            showAvatarForEveryMessage={false}
            showUserAvatar={false}
            onSend={messages => onSend(messages)}
            messagesContainerStyle={{
                backgroundColor: '#fff'
            }}
            textInputStyle={{
                backgroundColor: '#fff',
                borderRadius: 20,
            }}
            user={{
                _id: user?.uid,
                //avatar: 'https://i.pravatar.cc/300'
            }}
        />
    );


}