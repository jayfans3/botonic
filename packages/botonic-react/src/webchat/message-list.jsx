import React, { useContext } from 'react'
import { WebchatContext } from '../contexts'
import { StyledScrollbar } from './styled-scrollbar'
import { staticAsset } from '../utils'
import Fade from 'react-reveal/Fade'

export const WebchatMessageList = props => {
  const { webchatState, getThemeProperty } = useContext(WebchatContext)
  const CustomIntro = getThemeProperty('intro.custom')
  const introImage = getThemeProperty('intro.image')
  const introStyle = getThemeProperty('intro.style')

  const scrollbarOptions = {
    ...{ enable: true, autoHide: true },
    ...getThemeProperty('scrollbar'),
  }

  const DefaultIntro = introImage && (
    <img
      style={{
        maxHeight: '50%',
        width: '100%',
        ...(introStyle || {}),
      }}
      src={staticAsset(introImage)}
    />
  )

  return (
    <StyledScrollbar
      scrollbar={scrollbarOptions}
      data-simplebar-auto-hide={scrollbarOptions.autoHide}
      style={{
        ...(props.style || {}),
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <Fade>{CustomIntro ? <CustomIntro /> : DefaultIntro}</Fade>
      {webchatState.messagesComponents.map((e, i) => (
        <div
          style={{
            display: 'flex',
            overflowX: 'hidden',
            flexDirection: 'column',
            flex: 'none',
            whiteSpace: 'pre',
            wordWrap: 'break-word',
          }}
          key={i}
        >
          {e}
        </div>
      ))}
      {props.children}
    </StyledScrollbar>
  )
}
