import React from 'react'
import { AppContext } from './AppProvider'

export const Main: React.FC = () => {
  const context = React.useContext(AppContext)

  const { setSharedConfig } = context

  React.useEffect(() => {
    console.log('main mounted')
    // Loading config from plugin
    parent.postMessage({ pluginMessage: { type: 'load-config' } }, '*')

    window.onmessage = (event: MessageEvent) => {
      const { type, data } = event.data.pluginMessage
      if (type === 'send-config') {
        console.log('config received', data)
        setSharedConfig(data)
      }
    }
  }, [])

  return (
    <div>
      <h3>Main</h3>
    </div>
  )
}
