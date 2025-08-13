import { Share, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useStore } from '../store/context';
import MediumButton from './MediumButton';

const Card = ({ item, screen }) => {
  const { saveTip, fetchTips, removeTip } = useStore();
  const [buttonColor, setButtonColor] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchTips();
      renderSavedPlaces(item);
    }, []),
  );

  useEffect(() => {
    renderSavedPlaces(item);
  }, [buttonColor]);

  const handleToggleSaved = selectedTip => {
    if (buttonColor) {
      removeTip(selectedTip);
      setButtonColor(false);
    } else {
      saveTip(selectedTip);
      setButtonColor(true);
    }
  };

  const renderSavedPlaces = async item => {
    const jsonValue = await AsyncStorage.getItem('tips');
    const favoritesList = JSON.parse(jsonValue);

    if (favoritesList != null) {
      let data = favoritesList.find(fav => fav === item);

      return data == null ? setButtonColor(false) : setButtonColor(true);
    }
  };

  const handleShare = async tip => {
    try {
      await Share.share({
        message: `${tip}`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View
      style={[styles.tipContainer, screen === 'Game' && { paddingTop: 14 }]}
    >
      {screen === 'Game' && <Text style={styles.cardTitle}>Eco-tip:</Text>}
      <Text style={styles.tipText}>{item}</Text>
      <View style={styles.buttonsWrap}>
        <MediumButton
          title={buttonColor ? 'Saved' : 'Save'}
          style={!buttonColor && { backgroundColor: '#303D53' }}
          textStyle={!buttonColor && { color: '#fff' }}
          onPress={() => handleToggleSaved(item)}
        />
        <MediumButton
          title={'Share'}
          style={{ backgroundColor: '#303D53' }}
          textStyle={{ color: '#fff' }}
          onPress={() => handleShare(item)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tipContainer: {
    paddingTop: 32,
    padding: 25,
    width: '100%%',
    borderRadius: 22,
    backgroundColor: '#161B24',
    borderWidth: 2,
    borderColor: '#35435C',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  tipText: {
    fontSize: 22,
    fontWeight: 'semibold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 19,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 13,
  },
  menuButton: {
    backgroundColor: '#161B24',
    borderColor: '#35435C',
    borderWidth: 2,
  },
  buttonsWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
});

export default Card;
