import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import AppBackground from '../components/AppBackground';
import { useStore } from '../store/context';

const { height } = Dimensions.get('window');

const Rocket = () => {
  const navigation = useNavigation();
  const { rockets, setRockets, saveRockets, fetchRockets, fetchBalance } =
    useStore();
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [selectedRocket, setSelectedRocket] = useState(0);
  const [inputValue, setInputValue] = useState('');

  const unlockedRockets = rockets.filter(rocket => rocket.unlocked);

  const isEquipped = rockets.find(rocket => rocket.equipped);

  useFocusEffect(
    useCallback(() => {
      fetchRockets();
      fetchBalance();
    }, []),
  );

  const handleEquipRocket = selectedRocket => {
    const isEquippedRocket = rockets.map((rocket, idx) => {
      if (idx === selectedRocket) return { ...rocket, equipped: true };
      return { ...rocket, equipped: false };
    });

    setRockets(isEquippedRocket);
    saveRockets(isEquippedRocket);
  };

  const handleShowModal = selectedIdx => {
    setIsVisibleModal(true);
    setSelectedRocket(selectedIdx);
  };

  const handleChangeName = () => {
    const isChangedRocketName = rockets.map((rocket, idx) => {
      if (idx === selectedRocket) return { ...rocket, name: inputValue };
      return rocket;
    });

    setRockets(isChangedRocketName);
    saveRockets(isChangedRocketName);
    setInputValue('');
    if (inputValue) setIsVisibleModal(false);
  };

  return (
    <AppBackground>
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
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.infoContainer}
              onPress={() => navigation.navigate('Rocket')}
            >
              <Image source={require('../assets/icons/edit.png')} />
              <Text style={styles.title}>My Rocket</Text>
            </TouchableOpacity>
            <View style={styles.backBtn}>
              <Image source={require('../assets/icons/settings.png')} />
            </View>
          </View>

          <View style={{ alignItems: 'center' }}>
            <Image source={isEquipped.image} style={styles.rocketImg} />

            {unlockedRockets.map((rocket, idx) => (
              <TouchableOpacity
                onPress={() => handleShowModal(idx)}
                style={styles.rocketContainer}
                key={idx}
              >
                <Image source={rocket.image} />
                <View style={{ marginTop: 20 }}>
                  <Text style={styles.rocketName}>{rocket.name}</Text>

                  <TouchableOpacity
                    disabled={rocket.equipped}
                    style={[
                      styles.unlockButton,
                      rocket.equipped && { opacity: 0.2 },
                    ]}
                    onPress={() => handleEquipRocket(idx)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.btnText}>
                      {rocket.equipped ? 'Equipped' : 'Equip'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={isVisibleModal}
        transparent
        animationType="fade"
        style={{}}
      >
        <View style={styles.modalWrap}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Enter the rocket name</Text>
            <TextInput
              style={styles.input}
              placeholder="Rocket Name"
              value={inputValue}
              onChangeText={setInputValue}
              maxLength={15}
            />
            <TouchableOpacity style={styles.saveBtn} onPress={handleChangeName}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    width: '64%',
    borderRadius: 52,
    backgroundColor: '#161B24',
    borderWidth: 2,
    borderColor: '#35435C',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    flexDirection: 'row',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 4,
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
  modalView: {
    width: '70%',
    padding: 27,
    paddingBottom: 12,
    backgroundColor: 'rgba(128, 128, 128, 0.73)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  modalTitle: {
    fontSize: 17,
    color: '#000',
    marginBottom: 13,
    fontWeight: 'semibold',
    textAlign: 'center',
  },
  statText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  rocketImg: {
    width: 193,
    height: 244,
  },
  input: {
    width: '100%',
    height: 26,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  saveBtn: {
    paddingTop: 20,
    paddingHorizontal: 30,
  },
  buttonText: {
    fontSize: 17,
    color: '#007AFF',
    fontWeight: 'semibold',
  },
  modalWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.19,
  },
});

export default Rocket;
