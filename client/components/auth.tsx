import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useForm, Controller } from "react-hook-form";
import Toast from "react-native-toast-message";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const AuthFormData = {
    name: "",
    email: "",
    password: ""
};

type AuthStackParamList = {
    Signup: undefined;
    Login: undefined;
};

type SignupScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Signup'>;
type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

interface LoginSignupProps {
    onLogin: () => void;
}

const SignupScreen = ({ navigation }: { navigation: SignupScreenNavigationProp }) => {
    const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues: AuthFormData });
    const fadeAnim = new Animated.Value(0);

    interface SignupFormData {
        name: string;
        email: string;
        password: string;
    }

    const onSubmit = (data: SignupFormData) => {
        console.log("Signup Data:", data);
        Toast.show({ type: "success", text1: "Signup Successful!", text2: "Please login to continue" });
        setTimeout(() => navigation.navigate("Login"), 1000);
    };

    React.useEffect(() => {
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }, []);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>  
            <Text style={styles.title}>Sign Up</Text>
            <Controller
                control={control}
                rules={{ required: "Name is required" }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput style={styles.input} placeholder="Name" onBlur={onBlur} onChangeText={onChange} value={value} />
                )}
                name="name"
            />
            {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

            <Controller
                control={control}
                rules={{ required: "Email is required" }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" onBlur={onBlur} onChangeText={onChange} value={value} />
                )}
                name="email"
            />
            {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

            <Controller
                control={control}
                rules={{ required: "Password is required" }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput style={styles.input} placeholder="Password" secureTextEntry onBlur={onBlur} onChangeText={onChange} value={value} />
                )}
                name="password"
            />
            {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.link}>Already have an account? Login</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const LoginScreen = ({ navigation, onLogin }: { navigation: LoginScreenNavigationProp, onLogin: () => void }) => {
    const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues: AuthFormData });
    const fadeAnim = new Animated.Value(0);

    interface LoginFormData {
        email: string;
        password: string;
    }

    const onSubmit = (data: LoginFormData) => {
        console.log("Login Data:", data);
        Toast.show({ type: "success", text1: "Login Successful", text2: "!" });

        setTimeout(() => {
            onLogin();
        }, 1000);
    };

    React.useEffect(() => {
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }, []);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>  
            <Text style={styles.title}>Login</Text>
            <Controller
                control={control}
                rules={{ required: "Email is required" }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" onBlur={onBlur} onChangeText={onChange} value={value} />
                )}
                name="email"
            />
            {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

            <Controller
                control={control}
                rules={{ required: "Password is required" }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput style={styles.input} placeholder="Password" secureTextEntry onBlur={onBlur} onChangeText={onChange} value={value} />
                )}
                name="password"
            />
            {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.link}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const LoginSignup = ({ onLogin }: LoginSignupProps) => {
    return (
        <>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="Login">
                    {props => <LoginScreen {...props} onLogin={onLogin} />}
                </Stack.Screen>
            </Stack.Navigator>
            <Toast />
        </>
    );
};

export default LoginSignup;

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center", 
        padding: 20, 
        backgroundColor: "#f5f5f5" 
    },
    title: { 
        fontSize: 28, 
        fontWeight: "bold", 
        marginBottom: 20, 
        color: "#333"
    },
    input: { 
        width: "100%", 
        paddingVertical: 12, 
        paddingHorizontal: 15, 
        borderWidth: 1, 
        borderColor: "#ccc", 
        borderRadius: 10, 
        backgroundColor: "#fff", 
        fontSize: 16,
        elevation: 2, 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 10
    },
    button: { 
        backgroundColor: "#007BFF",
        padding: 12, 
        borderRadius: 10, 
        width: "100%", 
        alignItems: "center",
        elevation: 2, 
    },
    buttonText: { 
        color: "white", 
        fontSize: 18, 
        fontWeight: "bold"
    },
    link: { 
        marginTop: 10, 
        color: "#007BFF", 
        fontSize: 16
    },
    error: { 
        color: "red", 
        marginBottom: 10, 
        fontSize: 14
    }
});