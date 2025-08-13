import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import AppBackground from '../components/AppBackground';
import { tips } from '../data/tips';
import Card from '../components/Card';
import { useStore } from '../store/context';

const { height } = Dimensions.get('window');

const TipsList = ({ screen }) => {
  const navigation = useNavigation();
  const { fetchTips, savedTips } = useStore();

  useFocusEffect(
    useCallback(() => {
      fetchTips();
    }, []),
  );

  let selectedTips;

  screen === 'Saved' ? (selectedTips = savedTips) : (selectedTips = tips);

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
            <View style={styles.infoContainer}>
              <Text style={styles.title}>
                {screen === 'Saved' ? 'Saved eco-tips' : 'Eco-Tips:'}
              </Text>
            </View>
          </View>

          <FlatList
            scrollEnabled={false}
            keyExtractor={(_, index) => index}
            data={selectedTips}
            renderItem={({ item }) => <Card item={item} screen={screen} />}
          />
        </View>
      </ScrollView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: height * 0.07,
  },
  infoContainer: {
    height: 60,
    width: '72%',
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
    marginBottom: 24,
    paddingHorizontal: 28,
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
});

export default TipsList;
