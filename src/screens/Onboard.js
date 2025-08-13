import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AppBackground from '../components/AppBackground';
import { useEffect, useState } from 'react';
import LargeButton from '../components/LargeButton';
import { onboard } from '../data/onboard';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const Onboard = () => {
  const [step, setStep] = useState(0);
  const navigation = useNavigation();
  const [showImage, setShowImage] = useState(true);

  const handleNextStep = () => {
    step === 4 ? navigation.replace('Home') : setStep(step + 1);
  };

  useEffect(() => {
    setTimeout(() => {
      setShowImage(false);
    }, 3000);
  }, []);

  return (
    <>
      {showImage ? (
        <View style={styles.imageContainer}>
          {Platform.OS === 'ios' ? (
            <Image
              source={require('../assets/images/ios.png')}
              style={{ width: '95%', height: 380 }}
            />
          ) : (
            <Image
              source={require('../assets/images/logo.png')}
              style={{ width: '95%', height: 380 }}
            />
          )}
        </View>
      ) : (
        <AppBackground>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              <Image
                source={onboard[step].image}
                style={[
                  step === 0 && {
                    marginTop: height * 0.11,
                    width: '90%',
                    height: 370,
                  },
                  step === 1 && {
                    marginTop: height * 0.16,
                    marginBottom: 80,
                  },
                  step === 2 && {
                    marginTop: height * 0.05,
                  },
                  step === 3 && {
                    marginTop: height * 0.053,
                    marginBottom: 22,
                  },
                  step === 4 && {
                    marginTop: height * 0.11,
                    width: '90%',
                    height: 370,
                  },
                ]}
              />

              <View style={styles.welcomeContainer}>
                <Text style={styles.title}>{onboard[step].title}</Text>
                <Text style={styles.subtitle}>{onboard[step].subtitle}</Text>
                <LargeButton
                  title={onboard[step].buttonText}
                  onPress={handleNextStep}
                />
              </View>
            </View>
          </ScrollView>
        </AppBackground>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 15,
  },
  imageContainer: {
    backgroundColor: Platform.OS === 'ios' ? '#161B24' : 'rgb(11, 14, 19)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeContainer: {
    width: '100%',
    paddingTop: 27,
    paddingBottom: 41,
    paddingHorizontal: 36,
    borderRadius: 52,
    backgroundColor: '#161B24',
    borderWidth: 2,
    borderColor: '#35435C',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 22,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'regular',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 36,
  },
});

export default Onboard;
