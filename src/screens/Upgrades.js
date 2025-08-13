import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';

import AppBackground from '../components/AppBackground';
import { useStore } from '../store/context';
import LargeButton from '../components/LargeButton';

const { height } = Dimensions.get('window');

const Upgrades = () => {
  const navigation = useNavigation();
  const {
    rockets,
    setRockets,
    saveRockets,
    fetchRockets,
    saveUpdatedBalance,
    fetchBalance,
    savedBalance,
  } = useStore();
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [selectedRocket, setSelectedRocket] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFail, setIsFail] = useState(false);
  const { height } = useWindowDimensions();
  const total = savedBalance.reduce((acc, score) => acc + score, 0);

  useFocusEffect(
    useCallback(() => {
      fetchRockets();
      fetchBalance();
    }, [isSuccess]),
  );

  console.log(savedBalance);

  const handleUnlockRocket = () => {
    if (total < rockets[selectedRocket].cost)
      setIsFail(true), setIsVisibleModal(false);
    else {
      const isUnlockedRocket = rockets.map((rocket, idx) => {
        if (idx === selectedRocket) return { ...rocket, unlocked: true };
        return rocket;
      });

      setRockets(isUnlockedRocket);
      setIsVisibleModal(false);

      const sub = total - rockets[selectedRocket].cost;

      saveUpdatedBalance(sub);
      saveRockets(isUnlockedRocket);
      setIsSuccess(true);
    }
  };

  console.log(' rockets[selectedRocket].cost', total);

  const handleShowModal = selectedIdx => {
    setIsVisibleModal(true);
    setSelectedRocket(selectedIdx);
  };

  return (
    <AppBackground>
      {(isVisibleModal || isFail || isSuccess) && (
        <BlurView style={styles.blurBg} blurType="dark" blurAmount={3} />
      )}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Image source={require('../assets/icons/back.png')} />
            </TouchableOpacity>
            <View style={styles.infoContainer}>
              <Text style={styles.title}>Upgrades unlocker</Text>
            </View>
          </View>

          <View style={{ alignItems: 'center' }}>
            <View style={styles.scoreContainer}>
              <Text style={styles.title}>Your balance: </Text>
              <Text style={styles.scoreText}> {total} Xp</Text>
            </View>

            {rockets.map((rocket, idx) => (
              <View style={styles.rocketContainer} key={idx}>
                <Image source={rocket.image} />
                <View style={{ marginTop: 5 }}>
                  <Text style={styles.rocketName}>{rocket.defaultName}</Text>
                  <Text style={styles.rocketCost}>{rocket.cost} Xp</Text>
                  <TouchableOpacity
                    disabled={rocket.unlocked}
                    style={[
                      styles.unlockButton,
                      rocket.unlocked && { opacity: 0.2 },
                    ]}
                    onPress={() => handleShowModal(idx)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.btnText}>
                      {rocket.unlocked ? 'Unlocked' : 'Unlock'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
        <Modal visible={isVisibleModal} transparent style={{}}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={styles.modalView}>
              <Image
                source={rockets[selectedRocket].image}
                style={styles.modalImg}
              />
              <Text style={styles.modalTitle}>
                Are you sure want to unlock this upgrade?
              </Text>

              <View style={styles.resContainer}>
                <Text style={styles.statText}>Unlock cost: </Text>
                <Text style={styles.quantityText}>
                  {rockets[selectedRocket].cost} Xp
                </Text>
              </View>

              <LargeButton title={'Unlock'} onPress={handleUnlockRocket} />

              <LargeButton
                title={'Cancel'}
                style={styles.button}
                textStyle={{ color: '#fff' }}
                onPress={() => setIsVisibleModal(false)}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>

      {isSuccess && (
        <Modal visible={isSuccess} transparent animationType="fade" style={{}}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View style={[styles.modalView, { marginTop: height * 0.18 }]}>
              <Image
                source={rockets[selectedRocket].image}
                style={styles.modalImg}
              />
              <Text style={styles.modalTitle}>Upgrade unlocked!</Text>

              <LargeButton title={'Ok'} onPress={() => setIsSuccess(false)} />

              <LargeButton
                title={'Share'}
                style={styles.button}
                textStyle={{ color: '#fff' }}
                onPress={() => setIsVisibleModal(false)}
              />
            </View>
          </View>
        </Modal>
      )}
      {isFail && (
        <Modal visible={isFail} transparent animationType="fade" style={{}}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View style={[styles.modalView, { marginTop: height * 0.18 }]}>
              <Image
                source={rockets[selectedRocket].image}
                style={styles.modalImg}
              />
              <Text style={styles.modalTitle}>Upgrade was not unlocked</Text>

              <Text style={[styles.statText, { marginBottom: 34 }]}>
                You have not enough XP
              </Text>

              <LargeButton
                title={'Close'}
                style={styles.button}
                textStyle={{ color: '#fff' }}
                onPress={() => setIsFail(false)}
              />
            </View>
          </View>
        </Modal>
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
    width: '78%',
    borderRadius: 52,
    backgroundColor: '#161B24',
    borderWidth: 2,
    borderColor: '#35435C',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 15,
  },
  backBtn: {
    width: 60,
    height: 60,
    borderRadius: 52,
    backgroundColor: '#161B24',
    borderWidth: 2,
    borderColor: '#35435C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  rocketName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 9,
  },
  rocketCost: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FBCF12',
    marginBottom: 9,
  },
  scoreContainer: {
    height: 60,
    width: '100%',
    borderRadius: 52,
    backgroundColor: '#161B24',
    borderWidth: 2,
    borderColor: '#35435C',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 21,
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
  rocketContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 5,
    width: '100%',
    borderRadius: 52,
    backgroundColor: '#161B24',
    borderWidth: 2,
    borderColor: '#35435C',
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: '8%',
  },
  unlockButton: {
    width: 113,
    height: 40,
    backgroundColor: '#FBCF12',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
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
    marginBottom: 22,
  },
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
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 13,
    fontWeight: 'regular',
  },
  modalText: { fontSize: 24, color: '#fff', marginBottom: 10 },
  button: {
    backgroundColor: '#161B24',
    borderWidth: 2,
    borderColor: '#35435C',
    marginTop: 8,
  },
  statText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  quantityText: { color: '#FBCF12', fontSize: 20, fontWeight: '900' },
  modalImg: {
    width: 153,
    height: 190,
    marginBottom: 20,
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

export default Upgrades;
