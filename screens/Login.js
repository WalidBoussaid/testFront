import React, { useEffect, useState } from "react";

import {
    Button,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async () => {
        try {
            let isVerified = true;
            if (email == "") {
                isVerified = false;
                alert("Veuillez remplir le champ email !");
            }

            if (
                !/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/.test(email) ||
                email.length < 7
            ) {
                isVerified = false;
                alert("Veuillez entrer un email valide");
            }

            if (password == "") {
                isVerified = false;
                alert("Veuillez remplir le champ mot de passe !");
            }

            if (password.length < 6) {
                isVerified = false;
                alert("Veuillez entrer un mot de passe à min 6 caractères");
            }

            if (isVerified) {
                const log = {
                    mail: email,
                    password: password,
                };

                const response = await fetch(
                    "http://192.168.0.119:3000/login/",
                    {
                        method: "POST",
                        body: JSON.stringify(log),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    const token = data.token;

                    await AsyncStorage.setItem("token", token);

                    if (data.role == "candidate") {
                        navigation.navigate("HomeCandidate");
                    } else if (data.role == "employer") {
                        navigation.navigate("HomeEmployer");
                    } else {
                        alert("admin");
                    }
                } else {
                    const error = await response.json();
                    console.log(error);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <LinearGradient colors={["#1A91DA", "white"]} style={styles.container}>
            <View style={styles.logo}>
                <MaterialIcons name="person-search" size={80} color="white" />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.text}>Connexion</Text>

                <TextInput
                    placeholder="Votre email"
                    keyboardType="email-address"
                    style={styles.input}
                    onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                    placeholder="Votre mot de passe"
                    secureTextEntry
                    style={styles.input}
                    onChangeText={(text) => setPassword(text)}
                />
                <TouchableOpacity
                    style={styles.touchable}
                    onPress={handleSubmit}
                >
                    <View style={styles.btnContainer}>
                        <Text style={styles.btnText}>Valider</Text>
                    </View>
                </TouchableOpacity>
                <Pressable onPress={() => navigation.navigate("Register")}>
                    <Text style={{ textAlign: "center", marginTop: 9 }}>
                        Vers Inscription
                    </Text>
                </Pressable>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        marginBottom: 50,
    },
    inputContainer: {
        width: "100%",
        paddingHorizontal: 50,
    },
    input: {
        backgroundColor: "white",
        width: "100%",
        borderRadius: 25,
        padding: 9,
        textAlign: "center",
        fontSize: 19,
        marginVertical: 5,
    },
    touchable: {
        marginVertical: 9,
    },
    text: {
        color: "white",
        fontSize: 25,
        textAlign: "center",
    },
    btnContainer: {
        backgroundColor: "turquoise",
        borderRadius: 7,
        padding: 9,
    },
    btnText: {
        textAlign: "center",
        fontSize: 17,
        textTransform: "uppercase",
    },
});

export default Login;
