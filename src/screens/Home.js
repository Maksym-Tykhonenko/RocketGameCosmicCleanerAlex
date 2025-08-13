import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import AppBackground from '../components/AppBackground';
import LargeButton from '../components/LargeButton';
import { useStore } from '../store/context';
import Countdown from '../components/Countdown';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation();
  const { fetchScore, savedScores } = useStore();
  const [isVisibleCountdown, setIsVisibleCountdown] = useState(false);

  const bestScore = Math.max(...savedScores);

  useFocusEffect(
    useCallback(() => {
      fetchScore();
    }, []),
  );

  return (
    <AppBackground>
      {isVisibleCountdown ? (
        <Countdown setIsVisibleCountdown={setIsVisibleCountdown} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.infoContainer}
                onPress={() => navigation.navigate('Rocket')}
              >
                <Image source={require('../assets/icons/edit.png')} />
                <Text style={styles.title}>My Rocket</Text>
              </TouchableOpacity>
              <View style={styles.settingsContainer}>
                <Image source={require('../assets/icons/settings.png')} />
              </View>
            </View>

            <View style={{ alignItems: 'center' }}>
              <Image source={require('../assets/images/home.png')} />
              <View style={styles.scoreContainer}>
                <Text style={styles.title}>Best score: </Text>
                <Text style={styles.scoreText}>
                  {savedScores.length === 0 ? '0' : bestScore}
                </Text>
              </View>

              <View style={{ gap: 7, width: '100%' }}>
                <LargeButton
                  title={'Play rocket game'}
                  onPress={() => {
                    setIsVisibleCountdown(true),
                      setTimeout(() => {
                        navigation.navigate('Game');
                      }, 4000000);
                  }}
                />
                <LargeButton
                  title={'Upgrades unlocker'}
                  textStyle={{ color: '#fff' }}
                  style={styles.menuButton}
                  onPress={() => navigation.navigate('Upgrades')}
                />
                <LargeButton
                  title={'Eco-Tips'}
                  textStyle={{ color: '#fff' }}
                  style={styles.menuButton}
                  onPress={() => navigation.navigate('Tips')}
                />
                <LargeButton
                  title={'Saved tips'}
                  textStyle={{ color: '#fff' }}
                  style={styles.menuButton}
                  onPress={() => navigation.navigate('SavedTips')}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 44,
    paddingTop: height * 0.07,
  },
  infoContainer: {
    height: 60,
    width: '72%',
    borderRadius: 52,
    backgroundColor: '#161B24',
    borderWidth: 2,
    borderColor: '#35435C',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 24,
  },
  settingsContainer: {
    width: 60,
    height: 60,
    borderRadius: 52,
    backgroundColor: '#161B24',
    borderWidth: 2,
    borderColor: '#35435C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreContainer: {
    height: 60,
    width: '72%',
    borderRadius: 52,
    backgroundColor: '#161B24',
    borderWidth: 2,
    borderColor: '#35435C',
    justifyContent: 'center',
    alignItems: 'center',
    top: -16,
    flexDirection: 'row',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'regular',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 36,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FBCF12',
    textAlign: 'center',
  },
  menuButton: {
    backgroundColor: '#161B24',
    borderColor: '#35435C',
    borderWidth: 2,
  },
});

export default Home;
