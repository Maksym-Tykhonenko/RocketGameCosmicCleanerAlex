import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  PanResponder,
  Modal,
  Share,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import Card from '../components/Card';
import { tips } from '../data/tips';
import { useStore } from '../store/context';
import AppBackground from '../components/AppBackground';
import LargeButton from '../components/LargeButton';
import Orientation from 'react-native-orientation-locker';

const { width, height } = Dimensions.get('window');
const ROCKET_WIDTH = 70;
const ROCKET_HEIGHT = 100;
const ITEM_SIZE = 50;
const INITIAL_SPEED = 4;
const FUEL_IMAGE = require('../assets/images/game/fuel.png');
const DEBRIS_IMAGES = [
  require('../assets/images/game/trash/1.png'),
  require('../assets/images/game/trash/2.png'),
  require('../assets/images/game/trash/3.png'),
  require('../assets/images/game/trash/4.png'),
  require('../assets/images/game/trash/5.png'),
];

const TOTAL_ITEMS = 8;

function randomX() {
  return Math.random() * (width - ITEM_SIZE);
}

function getInitialItems() {
  let items = [];
  let now = Date.now();

  let fuelTime = now + Math.random() * 10000;
  for (let i = 0; i < TOTAL_ITEMS; i++) {
    let isFuel = i === 0;
    items.push({
      id: i + '_' + now,
      type: isFuel ? 'fuel' : 'debris',
      image: isFuel
        ? FUEL_IMAGE
        : DEBRIS_IMAGES[Math.floor(Math.random() * DEBRIS_IMAGES.length)],
      x: randomX(),
      y: -Math.random() * 200 - ITEM_SIZE,
      created: now,
      isFuel,
      nextFuelTime: fuelTime,
    });
  }
  return items;
}

export default function Game() {
  const [rocketX, setRocketX] = useState(width / 2 - ROCKET_WIDTH / 2);
  const [items, setItems] = useState(getInitialItems());
  const [fuel, setFuel] = useState(100);
  const [debrisCollected, setDebrisCollected] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [playTime, setPlayTime] = useState(0);
  const [randomTip, setRandomTip] = useState(
    () => tips[Math.floor(Math.random() * tips.length)],
  );
  const speedRef = useRef(INITIAL_SPEED);
  const frameRef = useRef();
  const lastFuelDropRef = useRef(Date.now());
  const navigation = useNavigation();
  const { saveScore, saveBalance, rockets } = useStore();

  useFocusEffect(
    useCallback(() => {
      Orientation.lockToPortrait();
    }),
  );

  useEffect(() => {
    if (gameOver) return;
    const speedInterval = setInterval(() => {
      speedRef.current *= 2;
    }, 60000);
    return () => clearInterval(speedInterval);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const fuelInterval = setInterval(() => {
      setFuel(f => Math.max(0, f - 100 / 30));
    }, 1000);
    return () => clearInterval(fuelInterval);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
    frameRef.current = requestAnimationFrame(gameStep);
    return () => cancelAnimationFrame(frameRef.current);
  });

  function gameStep() {
    setItems(prevItems => {
      let now = Date.now();
      let nextItems = prevItems.map(item => ({
        ...item,
        y: item.y + speedRef.current,
      }));

      let newItems = [];
      let debrisCount = debrisCollected;
      let fuelAmount = fuel;
      let collected = false;
      nextItems.forEach(item => {
        if (
          item.y + ITEM_SIZE > height - ROCKET_HEIGHT - 10 &&
          item.y < height - 10 &&
          item.x < rocketX + ROCKET_WIDTH &&
          item.x + ITEM_SIZE > rocketX
        ) {
          if (item.type === 'debris') {
            debrisCount++;
          } else {
            fuelAmount = Math.min(100, fuelAmount + 50);
          }
          collected = true;
        } else if (item.y < height) {
          newItems.push(item);
        }
      });

      while (newItems.length < TOTAL_ITEMS) {
        let isFuel = false;
        let now = Date.now();

        if (now - lastFuelDropRef.current > 10000) {
          isFuel = true;
          lastFuelDropRef.current = now;
        }
        newItems.push({
          id: 'n_' + now + '_' + Math.random(),
          type: isFuel ? 'fuel' : 'debris',
          image: isFuel
            ? FUEL_IMAGE
            : DEBRIS_IMAGES[Math.floor(Math.random() * DEBRIS_IMAGES.length)],
          x: randomX(),
          y: -ITEM_SIZE,
          created: now,
          isFuel,
        });
      }

      if (collected) {
        setDebrisCollected(debrisCount);
        setFuel(fuelAmount);
      }

      if (fuelAmount <= 0) {
        setGameOver(true);

        setPlayTime(Date.now() - startTime);
        return [];
      }

      return newItems;
    });

    if (!gameOver) frameRef.current = requestAnimationFrame(gameStep);
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !gameOver,
      onMoveShouldSetPanResponder: () => !gameOver,
      onPanResponderMove: (_, gestureState) => {
        setRocketX(prevX => {
          let newX = prevX + gestureState.dx;
          return Math.max(
            0,
            Math.min(
              width - ROCKET_WIDTH,
              gestureState.moveX - ROCKET_WIDTH / 2,
            ),
          );
        });
      },
      onPanResponderGrant: (_, gestureState) => {
        setRocketX(
          Math.max(
            0,
            Math.min(width - ROCKET_WIDTH, gestureState.x0 - ROCKET_WIDTH / 2),
          ),
        );
      },
    }),
  ).current;

  function formatTime(ms) {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  }

  function restartGame() {
    setFuel(100);
    setDebrisCollected(0);
    setGameOver(false);
    setStartTime(Date.now());
    setPlayTime(0);
    setRocketX(width / 2 - ROCKET_WIDTH / 2);
    speedRef.current = INITIAL_SPEED;
    lastFuelDropRef.current = Date.now();
    setItems(getInitialItems());
    saveScore(debrisCollected);
    saveBalance(debrisCollected);
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Youre earned: ${debrisCollected} Xp!
Used time: ${formatTime(playTime)}`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const isEquipped = rockets.find(rocket => rocket.equipped);

  return (
    <AppBackground>
      {gameOver && (
        <BlurView style={styles.blurBg} blurType="dark" blurAmount={3} />
      )}
      <View style={styles.container} {...panResponder.panHandlers}>
        <View style={styles.stats}>
          <View style={styles.fuelContainer}>
            <Text style={styles.statText}>Cleaned: </Text>
            <Text style={styles.quantityText}>{debrisCollected}</Text>
          </View>

          <View style={styles.fuelContainer}>
            <Text style={styles.statText}>Fuel: </Text>
            <Text
              style={[
                styles.quantityText,
                { color: '#1EFB12' },
                fuel < 70 && fuel > 30 && { color: '#FBE812' },
                fuel < 30 && fuel > 10 && { color: '#FB5012' },
                fuel < 10 && { color: '#FF0004' },
              ]}
            >
              {fuel.toFixed(0)}%
            </Text>
          </View>
        </View>

        {items.map(item => (
          <Image
            key={item.id}
            source={item.image}
            style={{
              position: 'absolute',
              width: ITEM_SIZE,
              height: ITEM_SIZE,
              left: item.x,
              top: item.y,
            }}
          />
        ))}
        <Image
          source={isEquipped.image}
          style={{
            position: 'absolute',
            width: ROCKET_WIDTH,
            height: ROCKET_HEIGHT,
            left: rocketX,
            top: height - ROCKET_HEIGHT - 60,
          }}
        />
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
        <Modal visible={gameOver} transparent animationType="fade" style={{}}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Game Over!</Text>
              <Text style={styles.modalSubtitle}>You're out of fuel!</Text>

              <View style={styles.resContainer}>
                <Text style={styles.statText}>Youre earned: </Text>
                <Text style={styles.quantityText}>{debrisCollected} Xp</Text>
              </View>

              <View style={styles.resContainer}>
                <Text style={styles.statText}>Used time: </Text>
                <Text style={[styles.quantityText]}>
                  {formatTime(playTime)}
                </Text>
              </View>

              <LargeButton title={'Try Again'} onPress={restartGame} />

              <LargeButton
                title={'Back home'}
                style={styles.button}
                textStyle={{ color: '#fff' }}
                onPress={() => {
                  saveScore(debrisCollected), saveBalance(debrisCollected);
                  setTimeout(() => {
                    setGameOver(false), navigation.goBack();
                  }, 300);
                }}
              />

              <LargeButton
                title={'Share'}
                style={{ backgroundColor: 'transparent' }}
                textStyle={{ color: '#fff' }}
                onPress={handleShare}
              />
            </View>
            <View style={[{ width: '90%', marginTop: 9 }]}>
              <Card item={randomTip} screen={'Game'} />
            </View>
          </View>
        </Modal>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  resContainer: {
    paddingHorizontal: 20,
    minWidth: '65%',
    height: 60,
    backgroundColor: '#161B24',
    borderWidth: 2,
    borderColor: '#35435C',
    borderRadius: 500,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 13,
  },
  statText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  quantityText: { color: '#FBCF12', fontSize: 20, fontWeight: '900' },
  modalView: {
    width: '90%',
    padding: 27,
    paddingBottom: 37,
    backgroundColor: '#161B24',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    borderRadius: 52,
    borderWidth: 2,
    borderColor: '#35435C',
  },
  modalTitle: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 13,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 13,
    fontWeight: 'regular',
  },
  modalText: { fontSize: 24, color: '#fff', marginBottom: 10 },
  restartBtn: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#2d74da',
    borderRadius: 10,
  },
  restartText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  button: {
    backgroundColor: '#161B24',
    borderWidth: 2,
    borderColor: '#35435C',
    marginTop: 8,
  },
  slider: {
    position: 'absolute',
    left: '10%',
    bottom: 90,
    width: '80%',
    height: 6,
    backgroundColor: '#fff',
    borderRadius: 2,
    zIndex: -1,
  },
  blurBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 10,
  },
});
