import React from 'react'
import StackNavigator from './src/navigations/StackNavigator'
import { LanguageProvider } from './src/contexts/LanguageContext'
import { VideoPlayerProvider } from './src/contexts/VideoContext'
import { QualityPrefrenceContext } from './src/contexts/QualityPrefrenceContext'
import { GeneralContextProvider } from './src/contexts/GeneralContext'
import { UserContextProvider } from './src/contexts/UserContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient()

const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <GeneralContextProvider>
          <LanguageProvider>
            <QualityPrefrenceContext>
              <VideoPlayerProvider>
                <StackNavigator />
              </VideoPlayerProvider>
            </QualityPrefrenceContext>
          </LanguageProvider>
        </GeneralContextProvider>
      </UserContextProvider>
      </QueryClientProvider>

    </>
  )
}

export default App