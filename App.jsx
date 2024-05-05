import React from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {VideoStateProvider} from './src/context/VideoStateContext';
import StackNavigator from './src/navigation/StackNavigator';
import {SettingsControlProvider} from './src/context/SettingsControlContext';
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsControlProvider>
        <VideoStateProvider>
            <StackNavigator />
        </VideoStateProvider>
      </SettingsControlProvider>
    </QueryClientProvider>
  );
};

export default App;
