import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useState } from 'react';
import { shop } from '../data/shop';

export const StoreContext = createContext();

export const useStore = () => {
  return useContext(StoreContext);
};

export const ContextProvider = ({ children }) => {
  const [savedTips, setSavedTips] = useState([]);
  const [savedScores, setSavedScores] = useState([]);
  const [rockets, setRockets] = useState(shop);
  const [savedBalance, setSavedBalance] = useState([]);

  // notes

  const saveTip = async data => {
    try {
      const storedTip = await AsyncStorage.getItem('tips');
      let tips = storedTip !== null ? JSON.parse(storedTip) : [];

      const updatedTips = [...tips, data];

      await AsyncStorage.setItem('tips', JSON.stringify(updatedTips));
    } catch (e) {
      console.error('Failed', e);
    }
  };

  const fetchTips = async () => {
    try {
      const savedData = await AsyncStorage.getItem('tips');
      const parsed = JSON.parse(savedData);

      if (parsed != null) {
        setSavedTips(parsed);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeTip = async selectedTip => {
    const jsonValue = await AsyncStorage.getItem('tips');
    let data = jsonValue != null ? JSON.parse(jsonValue) : [];

    const filtered = data.filter(item => item !== selectedTip);

    setSavedTips(filtered);
    await AsyncStorage.setItem('tips', JSON.stringify(filtered));
  };

  // score

  const saveScore = async data => {
    try {
      const storedScore = await AsyncStorage.getItem('scores');
      let scores = storedScore !== null ? JSON.parse(storedScore) : [];

      const updatedScores = [...scores, data];

      await AsyncStorage.setItem('scores', JSON.stringify(updatedScores));
    } catch (e) {
      console.error('Failed', e);
    }
  };

  const fetchScore = async () => {
    try {
      const savedData = await AsyncStorage.getItem('scores');
      const parsed = JSON.parse(savedData);

      if (parsed != null) {
        setSavedScores(parsed);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // rockets

  const saveRockets = async item => {
    try {
      await AsyncStorage.setItem('rockets', JSON.stringify(item));
    } catch (e) {
      console.error('Failed', e);
    }
  };

  const fetchRockets = async () => {
    try {
      const savedData = await AsyncStorage.getItem('rockets');
      const parsed = JSON.parse(savedData);

      if (parsed != null) {
        setRockets(parsed);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // balance

  const saveBalance = async data => {
    try {
      const storedBalance = await AsyncStorage.getItem('balance');
      let balance = storedBalance !== null ? JSON.parse(storedBalance) : [];

      const updatedBalance = [...balance, data];

      await AsyncStorage.setItem('balance', JSON.stringify(updatedBalance));
    } catch (e) {
      console.error('Failed', e);
    }
  };

  const saveUpdatedBalance = async data => {
    try {
      const storedBalance = await AsyncStorage.getItem('balance');
      let balance = storedBalance !== null ? JSON.parse(storedBalance) : [];

      await AsyncStorage.setItem('balance', JSON.stringify([data]));
    } catch (e) {
      console.error('Failed', e);
    }
  };

  const fetchBalance = async () => {
    try {
      const savedData = await AsyncStorage.getItem('balance');
      const parsed = JSON.parse(savedData);

      if (parsed != null) {
        setSavedBalance(parsed);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    saveTip,
    fetchTips,
    savedTips,
    removeTip,
    saveScore,
    fetchScore,
    savedScores,
    rockets,
    setRockets,
    saveRockets,
    fetchRockets,
    setSavedScores,
    saveBalance,
    fetchBalance,
    savedBalance,
    saveUpdatedBalance,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};
