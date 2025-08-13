import { Platform } from 'react-native';

export const onboard = [
  {
    image:
      Platform.OS === 'ios'
        ? require('../assets/images/onboard1IOS.png')
        : require('../assets/images/onboard1.png'),
    title:
      Platform.OS === 'ios'
        ? `Welcome to Rocket Game: Cosmic Cleaner`
        : `Welcome to Crown Rocket Game: Cosmic Cleaner`,
    subtitle: `Join the mission to clean up space and protect our universe. Every move counts — for space and for Earth!`,
    buttonText: 'Get Started',
  },

  {
    image: require('../assets/images/onboard2.png'),
    title: `Control Your Rocket`,
    subtitle: `Swipe left or right to avoid dangers, collect space debris, and gather fuel. Stay sharp — space is full of surprises!`,
    buttonText: 'Next',
  },

  {
    image: require('../assets/images/onboard3.png'),
    title: `Save Space, Save Earth`,
    subtitle: `Every collected item makes space cleaner. Learn eco tips from Greenpeace and become a hero for our planet.`,
    buttonText: 'Next',
  },

  {
    image: require('../assets/images/onboard4.png'),
    title: `Upgrade Your Rocket`,
    subtitle: `Use collected debris to unlock rocket upgrades and eco-friendly skins. Play your way — and green your rocket!`,
    buttonText: 'Next',
  },

  {
    image:
      Platform.OS === 'ios'
        ? require('../assets/images/onboard1IOS.png')
        : require('../assets/images/onboard1.png'),
    title: `Eco Tips & Save Them`,
    subtitle: `Discover and save helpful tips about protecting the environment — both in the game and in real life.`,
    buttonText: 'Let`s go!',
  },
];
