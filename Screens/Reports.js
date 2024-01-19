// Report.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { app } from '../Firebase/firebase';
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, doc, getDocs, where, } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";


//import { getFirestore, collection, doc, getDoc } from "firebase/firestore";
// posts = [
//     {
//         id: '1',
//         title: 'Sample Post',
//         content: 'This is a sample post.'
//     },
// ];

const currentDate = new Date();
const options = { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit' };
const dateOnly = currentDate.toLocaleDateString('en-PH', options);

export const PostContext = React.createContext();
export default function FireReports() {
    const [posts, setPosts] = useState([]);


    useEffect(() => {
        const fetchPosts = async () => {
            const currentDate = new Date();
            const dateOnly = currentDate.toLocaleDateString('en-GB'); // Get the current date without time

            // Get the current user's ID
            const db = getFirestore();

            const q = query(
                collection(db, "fireReport"),
                where("timestamp", "==", dateOnly)
            );

            const querySnapshot = await getDocs(q);
            const posts = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    userFullName: data.userFullName,
                    timestamp: data.timestamp,
                    additionalInfo: data.additionalInfo,
                    fireCauseDetails: data.fireCauseDetails,
                    fireSizeDetails: data.fireSizeDetails,
                    locationDetails: data.locationDetails,
                    specialNeeds: data.specialNeeds,
                    id: doc.id // Include the document ID so you can use it in keyExtractor
                };
            });
            setPosts(posts);

        };

        fetchPosts();
    }, []);


    const renderPost = ({ item }) => (
        <View style={styles.postContainer}>
            <Text style={styles.postTitle}>{item.userFullName}</Text>
                <Text style={styles.postContent}>
                    <Text style={styles.postContentTitle, { fontWeight: 'bold' }}>Location of the Fire: </Text>
                    <Text style={[styles.postContent, { fontWeight: 'normal' }]}>{item.locationDetails}</Text>
                </Text>
                <Text style={styles.postContent}>
                    <Text style={styles.postContentTitle, { fontWeight: 'bold' }}>Cause of Fire: </Text>
                    <Text style={[styles.postContent, { fontWeight: 'normal' }]}>{item.fireCauseDetails}</Text>
                </Text>
                <Text style={styles.postContent}>
                    <Text style={styles.postContentTitle, { fontWeight: 'bold' }}>Fire Size Details: </Text>
                    <Text style={[styles.postContent, { fontWeight: 'normal' }]}>{item.fireSizeDetails}</Text>
                </Text>
                <Text style={styles.postContent}>
                    <Text style={styles.postContentTitle, { fontWeight: 'bold' }}>Special Needs: </Text>
                    <Text style={[styles.postContent, { fontWeight: 'normal' }]}>{item.specialNeeds}</Text>
                </Text>
                <Text style={styles.postContent}>
                    <Text style={styles.postContentTitle, { fontWeight: 'bold' }}>Additional Information: </Text>
                    <Text style={[styles.postContent, { fontWeight: 'normal' }]}>{item.additionalInfo}</Text>
                </Text>

        </View>
    );

    return (
        <ImageBackground source={require('./../assets/img/lifeline_1080x1920.png')} resizeMode="cover" style={styles.backgroundView}>
            <View style={styles.container}>
                <View style={styles.dateTodayContainer}>
                    <Text style={styles.dateTitle}>As of {dateOnly} </Text>
                </View>
            
                <FlatList
                    style={styles.feed}
                    data={posts}
                    renderItem={renderPost}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundView: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        marginTop: 15,
    },
    dateTodayContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.80)',
        marginTop: 15,
        height: 50,
        marginBottom: 15,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateTitle:{
        fontSize: 25,
        color: '#C1121F',
    },
    feed: {
        marginHorizontal: 16
    },
    postContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.45)',
        borderRadius: 5,
        padding: 17,
        marginBottom: 15
    },
    postTitle: {
        fontSize: 25,
        fontWeight: '500',
        color: '#C1121F',
    },
    postContent: {
        marginTop: 8,
        lineHeight: 18,
        fontSize: 17,
        marginLeft: 30,
    }
});