import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import AppBackground from '../components/AppBackground';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useStore } from '../store/context';
import Orientation from 'react-native-orientation-locker';

const { height } = Dimensions.get('window');
const ROCKET_WIDTH = 70;
const ROCKET_HEIGHT = 100;

export default function Countdown({ setIsVisibleCountdown }) {
  const { rockets } = useStore();
  const [count, setCount] = useState(3);
  const [showGo, setShowGo] = useState(false);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      Orientation.lockToPortrait();
    }, []),
  );

  useEffect(() => {
    if (count >= 0) {
      const timer = setTimeout(() => {
        if (count === 0) {
          setShowGo(true);

          setTimeout(() => {
            setIsVisibleCountdown(false);
            navigation.navigate('Game');
          }, 600);
        } else {
          setCount(prev => prev - 1);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [count]);

  const isEquipped = rockets.find(rocket => rocket.equipped);

  return (
    <AppBackground>
      <View style={styles.container}>
        <View style={styles.stats}>
          <View style={styles.fuelContainer}>
            <Text style={styles.statText}>Cleaned: </Text>
            <Text style={styles.quantityText}>000</Text>
          </View>

          <View style={styles.fuelContainer}>
            <Text style={styles.statText}>Fuel: </Text>
            <Text style={[styles.quantityText, { color: '#1EFB12' }]}>
              100%
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.countText,
            showGo && {
              color: '#FBCF12',
              fontSize: 125,
              marginTop: height * 0.21,
            },
          ]}
        >
          {showGo ? 'GO!' : count}
        </Text>
      </View>

      <View>
        <View style={styles.slider}>
          <Image
            source={require('../assets/images/game/slider.png')}
            style={{ position: 'absolute', right: -15, top: -7 }}
          />
          <Image
            source={require('../assets/images/game/slider.png')}
            style={{ position: 'absolute', left: -15, top: -7 }}
          />
        </View>
      </View>
      <View style={{ alignItems: 'center' }}>
        <Image
          source={isEquipped.image}
          style={{
            position: 'absolute',
            width: ROCKET_WIDTH,
            height: ROCKET_HEIGHT,
            bottom: 40,
          }}
        />
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  stats: {
    paddingTop: height * 0.07,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    zIndex: 20,
  },
  fuelContainer: {
    width: '40%',
    height: 60,
    backgroundColor: '#161B24',
    borderWidth: 2,
    borderColor: '#35435C',
    borderRadius: 500,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  statText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  quantityText: { color: '#FBCF12', fontSize: 20, fontWeight: '900' },
  slider: {
    position: 'absolute',
    left: '10%',
    bottom: 70,
    width: '80%',
    height: 6,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  countText: {
    fontSize: 208,
    color: '#fff',
    marginTop: height * 0.17,
    fontWeight: 'bold',
  },
});
