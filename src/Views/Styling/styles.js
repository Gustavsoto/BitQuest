import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    welcomeContainer: {
        backgroundColor: '#121212',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    HomeContainer: {
        backgroundColor: '#121212',
        width: '100%',
        height: '100%',
        flexDirection: 'row',
    },
    button: {
        width: 150,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0096FF',
        borderRadius: 10,
    },
    title: {
        color: '#E8E8E8',
        fontSize: 30,
        paddingBottom: 20,
    },
    homeBox: {
       backgroundColor: '#1E1E1E',
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
    },
    sideBar: {
        width: '40px',
        height: '100%',
        color: '#1E1E1E',
        borderBlockColor: '#2A2A2A',
        rowGap: 20,
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    sideBarIcon: {
        width: 45,
        height: 45,
        backgroundColor: 'crimson',
        paddingBottom: 20,
    },
});
