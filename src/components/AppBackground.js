import { ImageBackground } from 'react-native';

const AppBackground = ({ children }) => {
  return (
    <ImageBackground
      source={require('../assets/images/bg.png')}
      style={{ flex: 1 }}
    >
      {children}
    </ImageBackground>
  );
};

export default AppBackground;
